import json
import os
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product, ProductVariant, PriceRecord
from app.sources.registry import registry

FIXTURE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "fixtures", "seed_catalogue.json")

async def load_seed_catalogue_if_empty(session: AsyncSession) -> int:
    """
    Checks if products exist. If empty, loads authentic verified seed catalogue.
    """
    existing_result = await session.execute(select(Product))
    if existing_result.scalars().first() is not None:
        return 0  # Already seeded

    if not os.path.exists(FIXTURE_PATH):
        return 0

    with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
        products_data = json.load(f)

    inserted_count = 0
    now = datetime.now(timezone.utc)

    for p_data in products_data:
        product = Product(
            id=p_data["id"],
            title=p_data["title"],
            brand=p_data["brand"],
            category=p_data["category"],
            description=p_data.get("description", ""),
            skin_tones=p_data.get("skin_tones", []),
            undertones=p_data.get("undertones", []),
            skin_types=p_data.get("skin_types", []),
            finish=p_data.get("finish", "natural"),
            coverage=p_data.get("coverage", "medium"),
            rating=float(p_data.get("rating", 4.0)),
            review_count=int(p_data.get("review_count", 0)),
            is_active=True,
            created_at=now,
            updated_at=now,
        )
        session.add(product)

        for v_data in p_data.get("variants", []):
            variant = ProductVariant(
                id=v_data["id"],
                product_id=product.id,
                shade_name=v_data["shade_name"],
                shade_code=v_data.get("shade_code", ""),
                hex_color=v_data.get("hex_color", "#E5A882"),
                undertone=v_data.get("undertone", "neutral"),
                depth_level=v_data.get("depth_level", "medium"),
                sku=v_data.get("sku", ""),
                image_url=v_data.get("image_url", ""),
            )
            session.add(variant)

            for pr_data in v_data.get("prices", []):
                retailer = pr_data["retailer"]
                canonical_url = pr_data["product_url"]
                # Resolve monetized link via registry
                affiliate_url = registry.generate_affiliate_link(retailer, canonical_url)

                price_rec = PriceRecord(
                    id=f"{variant.id}-{retailer}",
                    variant_id=variant.id,
                    retailer=retailer,
                    currency="INR",
                    mrp=float(pr_data["mrp"]),
                    current_price=float(pr_data["current_price"]),
                    discount_percent=float(pr_data.get("discount_percent", 0.0)),
                    in_stock=bool(pr_data.get("in_stock", True)),
                    stock_status=pr_data.get("stock_status", "in_stock"),
                    product_url=canonical_url,
                    affiliate_url=affiliate_url,
                    last_checked_at=now,
                    stale_after_hours=24,
                )
                session.add(price_rec)

        inserted_count += 1

    await session.commit()
    return inserted_count

