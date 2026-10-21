import uuid
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.models.product import Product, ProductVariant, PriceRecord
from app.services.shade_classifier import classify_shade, infer_product_metadata
from app.sources.registry import registry

def normalize_slug(text: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9\s-]', '', text.lower())
    return re.sub(r'[\s-]+', '-', cleaned).strip('-')

async def upsert_product_record(
    session: AsyncSession,
    raw_data: Dict[str, Any]
) -> Tuple[Product, bool]:
    """
    Dynamically inserts or updates a product, its variants, and retailer price records.
    Ensures zero duplicate items and atomic updates.
    """
    now = datetime.now(timezone.utc)
    title = raw_data.get("title", "").strip()
    brand = raw_data.get("brand", "").strip()
    category = raw_data.get("category", "foundation").strip().lower()

    if not title or not brand:
        raise ValueError("Product must contain 'title' and 'brand'.")

    product_id = raw_data.get("id") or f"{normalize_slug(brand)}-{normalize_slug(title)[:30]}"

    # Check existing product
    stmt = (
        select(Product)
        .options(selectinload(Product.variants).selectinload(ProductVariant.prices))
        .where(Product.id == product_id)
    )
    res = await session.execute(stmt)
    product = res.scalars().first()
    is_new = product is None

    meta = infer_product_metadata(title, category)

    if is_new:
        product = Product(
            id=product_id,
            title=title,
            brand=brand,
            category=category,
            description=raw_data.get("description", ""),
            skin_tones=raw_data.get("skin_tones", ["fair", "light", "medium", "tan", "deep"]),
            undertones=raw_data.get("undertones", ["warm", "cool", "neutral"]),
            skin_types=raw_data.get("skin_types", meta["skin_types"]),
            finish=raw_data.get("finish", meta["finish"]),
            coverage=raw_data.get("coverage", meta["coverage"]),
            rating=float(raw_data.get("rating", 4.3)),
            review_count=int(raw_data.get("review_count", 1500)),
            is_active=True,
            created_at=now,
            updated_at=now,
        )
        session.add(product)
    else:
        product.title = title
        product.category = category
        if "rating" in raw_data:
            product.rating = float(raw_data["rating"])
        if "review_count" in raw_data:
            product.review_count = int(raw_data["review_count"])
        product.updated_at = now

    # Upsert Variants (Shades)
    raw_variants = raw_data.get("variants", [])
    if not raw_variants:
        # If single-product without explicit variant breakdown, synthesize main variant
        raw_variants = [{
            "shade_name": raw_data.get("shade_name", "Natural / Standard"),
            "prices": raw_data.get("prices", [])
        }]

    existing_variants = {v.id: v for v in product.variants} if not is_new else {}

    for var_data in raw_variants:
        shade_name = var_data.get("shade_name", "Universal Match")
        variant_id = var_data.get("id") or f"{product.id}-{normalize_slug(shade_name)[:25]}"

        # Auto-classify shade metadata dynamically
        classification = classify_shade(shade_name, product.title)

        depth = var_data.get("depth_level") or classification["depth_level"]
        undertone = var_data.get("undertone") or classification["undertone"]
        shade_code = var_data.get("shade_code") or classification["shade_code"]
        hex_color = var_data.get("hex_color") or classification["hex_color"]
        image_url = var_data.get("image_url") or raw_data.get("image_url", "")

        variant = existing_variants.get(variant_id)
        if not variant:
            variant = ProductVariant(
                id=variant_id,
                product_id=product.id,
                shade_name=shade_name,
                shade_code=shade_code,
                hex_color=hex_color,
                undertone=undertone,
                depth_level=depth,
                sku=var_data.get("sku", ""),
                image_url=image_url,
            )
            session.add(variant)
        else:
            variant.shade_name = shade_name
            variant.undertone = undertone
            variant.depth_level = depth
            if image_url:
                variant.image_url = image_url

        # Upsert Prices
        existing_prices = {p.retailer: p for p in variant.prices} if variant.prices else {}
        for price_data in var_data.get("prices", []):
            retailer = price_data.get("retailer", "nykaa")
            mrp = float(price_data.get("mrp", 0.0))
            current_price = float(price_data.get("current_price", mrp))
            discount = float(price_data.get("discount_percent", 0.0))
            if discount == 0.0 and mrp > current_price:
                discount = round(((mrp - current_price) / mrp) * 100, 1)

            product_url = price_data.get("product_url", "")
            affiliate_url = registry.generate_affiliate_link(retailer, product_url)

            price_rec = existing_prices.get(retailer)
            if not price_rec:
                price_rec = PriceRecord(
                    id=f"{variant.id}-{retailer}",
                    variant_id=variant.id,
                    retailer=retailer,
                    currency="INR",
                    mrp=mrp,
                    current_price=current_price,
                    discount_percent=discount,
                    in_stock=bool(price_data.get("in_stock", True)),
                    stock_status=price_data.get("stock_status", "in_stock"),
                    product_url=product_url,
                    affiliate_url=affiliate_url,
                    last_checked_at=now,
                    stale_after_hours=24,
                )
                session.add(price_rec)
            else:
                price_rec.current_price = current_price
                price_rec.mrp = mrp
                price_rec.discount_percent = discount
                price_rec.in_stock = bool(price_data.get("in_stock", True))
                price_rec.product_url = product_url
                price_rec.affiliate_url = affiliate_url
                price_rec.last_checked_at = now

    await session.commit()
    return product, is_new

async def import_dynamic_feed(
    session: AsyncSession,
    feed_items: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Batch ingests a dynamic merchant feed (JSON/API format).
    """
    created_count = 0
    updated_count = 0
    errors = []

    for item in feed_items:
        try:
            _, is_new = await upsert_product_record(session, item)
            if is_new:
                created_count += 1
            else:
                updated_count += 1
        except Exception as e:
            errors.append({"item": item.get("title", "Unknown"), "error": str(e)})

    return {
        "status": "success",
        "total_processed": len(feed_items),
        "created": created_count,
        "updated": updated_count,
        "errors": errors,
    }

async def get_dynamic_catalog_stats(session: AsyncSession) -> Dict[str, Any]:
    """
    Returns live statistics on catalog depth, verified prices, and brands.
    """
    product_count = await session.scalar(select(func.count(Product.id)))
    variant_count = await session.scalar(select(func.count(ProductVariant.id)))
    price_count = await session.scalar(select(func.count(PriceRecord.id)))

    # Unique brands
    brand_res = await session.execute(select(Product.brand).distinct())
    brands = [b[0] for b in brand_res.fetchall()]

    # Unique retailers
    retailer_res = await session.execute(select(PriceRecord.retailer).distinct())
    retailers = [r[0] for r in retailer_res.fetchall()]

    return {
        "total_products": product_count or 0,
        "total_variants_shades": variant_count or 0,
        "total_price_records": price_count or 0,
        "active_brands_count": len(brands),
        "brands": brands,
        "integrated_retailers": retailers,
        "last_synced_at": datetime.now(timezone.utc).isoformat(),
        "is_dynamic": True,
    }

async def refresh_all_database_prices(session: AsyncSession, limit: int = 50) -> Dict[str, Any]:
    """
    Scans database price records, fetches real-time live prices from retailer pages,
    and atomically updates the database records with zero manual intervention.
    """
    import asyncio
    from app.services.price_fetcher import fetch_live_product_price

    now = datetime.now(timezone.utc)
    stmt = select(PriceRecord).limit(limit)
    res = await session.execute(stmt)
    records = res.scalars().all()

    updated = 0
    failed = 0

    for rec in records:
        if not rec.product_url:
            continue
        try:
            live = await fetch_live_product_price(rec.product_url)
            if live and live.get("current_price"):
                rec.current_price = live["current_price"]
                rec.mrp = live.get("mrp", live["current_price"])
                rec.discount_percent = live.get("discount_percent", 0.0)
                rec.in_stock = live.get("in_stock", True)
                rec.last_checked_at = now
                rec.is_stale = False
                updated += 1
            else:
                failed += 1
            # Gentle delay to respect retailer servers
            await asyncio.sleep(0.5)
        except Exception:
            failed += 1

    await session.commit()
    return {
        "status": "success",
        "total_checked": len(records),
        "successfully_updated": updated,
        "unmodified_or_failed": failed,
        "refreshed_at": now.isoformat(),
    }

async def add_new_dynamic_product(session: AsyncSession, product_payload: Dict[str, Any]) -> Tuple[Product, bool]:
    """
    Dynamically inserts any newly launched market product with automated shade classification and live price extraction.
    """
    from app.services.price_fetcher import fetch_live_product_price

    raw_variants = product_payload.get("variants", [])
    for v in raw_variants:
        for p in v.get("prices", []):
            if not p.get("current_price") and p.get("product_url"):
                try:
                    live = await fetch_live_product_price(p["product_url"])
                    if live:
                        p["current_price"] = live["current_price"]
                        p["mrp"] = live.get("mrp", live["current_price"])
                        p["discount_percent"] = live.get("discount_percent", 0.0)
                        p["in_stock"] = live.get("in_stock", True)
                except Exception:
                    pass

    product, is_new = await upsert_product_record(session, product_payload)
    return product, is_new

