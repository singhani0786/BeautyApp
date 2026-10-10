from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.product import Product, ProductVariant, PriceRecord
from app.schemas.product import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendationCategoryResult,
    ProductInfo,
    VariantInfo,
    PriceInfo,
)

def build_product_info(product: Product, variant: ProductVariant, price: PriceRecord) -> ProductInfo:
    price_info = PriceInfo(
        retailer=price.retailer,
        currency=price.currency,
        mrp=price.mrp,
        current_price=price.current_price,
        discount_percent=price.discount_percent,
        in_stock=price.in_stock,
        stock_status=price.stock_status,
        product_url=price.product_url,
        affiliate_url=price.affiliate_url or price.product_url,
        is_stale=price.is_stale,
        last_checked_at=price.last_checked_at,
    )

    variant_info = VariantInfo(
        id=variant.id,
        shade_name=variant.shade_name,
        shade_code=variant.shade_code,
        hex_color=variant.hex_color,
        undertone=variant.undertone,
        depth_level=variant.depth_level,
        sku=variant.sku,
        image_url=variant.image_url,
        prices=[price_info]
    )

    all_v_infos = [
        VariantInfo(
            id=v.id,
            shade_name=v.shade_name,
            shade_code=v.shade_code,
            hex_color=v.hex_color,
            undertone=v.undertone,
            depth_level=v.depth_level,
            sku=v.sku,
            image_url=v.image_url,
            prices=[
                PriceInfo(
                    retailer=p.retailer,
                    currency=p.currency,
                    mrp=p.mrp,
                    current_price=p.current_price,
                    discount_percent=p.discount_percent,
                    in_stock=p.in_stock,
                    stock_status=p.stock_status,
                    product_url=p.product_url,
                    affiliate_url=p.affiliate_url or p.product_url,
                    is_stale=p.is_stale,
                    last_checked_at=p.last_checked_at,
                ) for p in v.prices
            ]
        )
        for v in product.variants
    ]

    return ProductInfo(
        id=product.id,
        title=product.title,
        brand=product.brand,
        category=product.category,
        description=product.description,
        finish=product.finish,
        coverage=product.coverage,
        rating=product.rating,
        review_count=product.review_count,
        matched_variant=variant_info,
        best_price=price_info,
        all_variants=all_v_infos
    )

async def get_makeup_recommendations(
    request: RecommendationRequest,
    session: AsyncSession
) -> RecommendationResponse:
    # Query products with loaded variants and prices
    stmt = (
        select(Product)
        .where(Product.is_active == True)
        .options(
            selectinload(Product.variants).selectinload(ProductVariant.prices)
        )
    )

    if request.category and request.category != "all":
        stmt = stmt.where(Product.category == request.category)

    result = await session.execute(stmt)
    products: List[Product] = result.scalars().all()

    candidates: List[Tuple[Product, ProductVariant, PriceRecord, float]] = []

    user_tone = request.skin_depth.lower()
    user_undertone = request.undertone.lower()
    user_skin_type = (request.skin_type or "all").lower()
    budget_limit = request.budget_inr if (request.budget_inr and request.budget_inr > 0) else None

    for prod in products:
        for var in prod.variants:
            # Check price records
            valid_prices = [p for p in var.prices if p.in_stock]
            if not valid_prices:
                continue
            
            # Select lowest current price for this variant
            best_price = min(valid_prices, key=lambda p: p.current_price)

            # Evaluate Match Score
            match_score = 0.0

            # 1. Skin depth match
            if var.depth_level.lower() == user_tone:
                match_score += 40.0
            elif user_tone in [t.lower() for t in prod.skin_tones]:
                match_score += 25.0
            else:
                # Soft penalty for adjacent tone
                match_score += 10.0

            # 2. Undertone match
            if var.undertone.lower() == user_undertone:
                match_score += 35.0
            elif var.undertone.lower() == "neutral" or user_undertone == "neutral":
                match_score += 25.0  # Neutral is versatile
            elif user_undertone in [u.lower() for u in prod.undertones]:
                match_score += 15.0

            # 3. Skin type synergy
            if user_skin_type != "all" and user_skin_type in [st.lower() for st in prod.skin_types]:
                match_score += 15.0
                if user_skin_type == "oily" and prod.finish == "matte":
                    match_score += 5.0
                elif user_skin_type == "dry" and prod.finish in ["dewy", "hydrating"]:
                    match_score += 5.0

            # 4. Rating factor
            match_score += min(prod.rating * 2.0, 10.0)

            candidates.append((prod, var, best_price, match_score))

    # Sort candidates by match score descending
    candidates.sort(key=lambda c: c[3], reverse=True)

    # Filter within budget for budget-constrained categories
    in_budget_candidates = [
        c for c in candidates
        if (budget_limit is None or c[2].current_price <= budget_limit)
    ]

    recommendations: List[RecommendationCategoryResult] = []
    seen_product_ids = set()

    # 1. Best Overall: Top candidate within budget (or highest score)
    if in_budget_candidates:
        top_cand = in_budget_candidates[0]
        seen_product_ids.add(top_cand[0].id)
        prod_info = build_product_info(top_cand[0], top_cand[1], top_cand[2])
        recommendations.append(
            RecommendationCategoryResult(
                tag="best_overall",
                label="Best Overall Match",
                reason=f"Top formulation match ({round(top_cand[3], 1)}% fit). Shade {top_cand[1].shade_name} is specifically balanced for {request.skin_depth} skin with {request.undertone} undertones.",
                product=prod_info
            )
        )

    # 2. Budget-Friendly Pick: Lowest price with high fit in budget
    eligible_budget = [
        c for c in in_budget_candidates
        if c[0].id not in seen_product_ids
    ]
    if eligible_budget:
        # Sort by price ascending, secondary by match score descending
        eligible_budget.sort(key=lambda c: (c[2].current_price, -c[3]))
        budget_cand = eligible_budget[0]
        seen_product_ids.add(budget_cand[0].id)
        prod_info = build_product_info(budget_cand[0], budget_cand[1], budget_cand[2])
        recommendations.append(
            RecommendationCategoryResult(
                tag="budget_friendly",
                label="Best Budget Pick",
                reason=f"Most wallet-friendly option at ₹{int(budget_cand[2].current_price):,} ({int(budget_cand[2].discount_percent)}% off MRP) without compromising on shade accuracy.",
                product=prod_info
            )
        )

    # 3. Best Value: Best quality-to-price ratio
    eligible_value = [
        c for c in in_budget_candidates
        if c[0].id not in seen_product_ids
    ]
    if eligible_value:
        # Value ratio: (rating * 100) / current_price
        eligible_value.sort(key=lambda c: (c[0].rating * 1000.0) / max(c[2].current_price, 100.0), reverse=True)
        value_cand = eligible_value[0]
        seen_product_ids.add(value_cand[0].id)
        prod_info = build_product_info(value_cand[0], value_cand[1], value_cand[2])
        recommendations.append(
            RecommendationCategoryResult(
                tag="best_value",
                label="Best Value & Performance",
                reason=f"Outstanding price-to-performance ratio. Rated {value_cand[0].rating}★ by {value_cand[0].review_count:,}+ buyers with verified shade wear.",
                product=prod_info
            )
        )

    # 4. Premium Alternative: Higher-end formulation
    # If budget is tight, this can be an aspirational higher-tier formulation
    eligible_premium = [
        c for c in candidates
        if c[0].id not in seen_product_ids
    ]
    if eligible_premium:
        # Sort by current price descending (high end) among top match scores
        eligible_premium.sort(key=lambda c: (c[2].current_price, c[3]), reverse=True)
        prem_cand = eligible_premium[0]
        seen_product_ids.add(prem_cand[0].id)
        prod_info = build_product_info(prem_cand[0], prem_cand[1], prem_cand[2])
        
        is_above_budget = budget_limit is not None and prem_cand[2].current_price > budget_limit
        budget_note = f" (Aspirational tier exceeding ₹{budget_limit:,.0f} budget)" if is_above_budget else ""
        
        recommendations.append(
            RecommendationCategoryResult(
                tag="premium",
                label="Luxury & Premium Upgrade",
                reason=f"High-end luxury formulation featuring professional wear and high-pigment purity{budget_note}.",
                product=prod_info
            )
        )

    # Remaining candidates as alternatives
    alternative_picks: List[ProductInfo] = []
    for c in in_budget_candidates:
        if c[0].id not in seen_product_ids:
            seen_product_ids.add(c[0].id)
            alternative_picks.append(build_product_info(c[0], c[1], c[2]))
            if len(alternative_picks) >= 6:
                break

    return RecommendationResponse(
        query_undertone=request.undertone,
        query_skin_depth=request.skin_depth,
        query_skin_type=request.skin_type or "all",
        query_category=request.category or "foundation",
        budget_limit_inr=budget_limit,
        total_candidates_found=len(candidates),
        recommendations=recommendations,
        alternative_picks=alternative_picks
    )

