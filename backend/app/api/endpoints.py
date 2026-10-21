from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.db.session import get_db
from app.schemas.product import (
    FaceAnalysisResult,
    RecommendationRequest,
    RecommendationResponse,
    SourceStatusInfo,
    ProductInfo,
)
from app.services.face_analysis import analyze_face_photo
from app.services.recommendation import get_makeup_recommendations
from app.services.seed_loader import load_seed_catalogue_if_empty
from app.sources.registry import registry
from app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "price_stale_policy_hours": settings.PRICE_STALE_HOURS,
        "face_storage_enabled": settings.ALLOW_FACE_STORAGE,
    }

@router.post("/analyze-face", response_model=FaceAnalysisResult)
async def analyze_face(
    file: UploadFile = File(..., description="Selfie image file (JPEG, PNG, WEBP). Evaluated strictly in-memory.")
):
    """
    In-memory skin tone and undertone analysis with zero disk persistence.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG, PNG, WEBP).")

    try:
        image_bytes = await file.read()
        if len(image_bytes) > settings.MAX_IMAGE_UPLOAD_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"Image size exceeds safety limit of {settings.MAX_IMAGE_UPLOAD_BYTES // (1024 * 1024)}MB."
            )
        result = analyze_face_photo(image_bytes)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Get customized makeup recommendations tailored for Indian skin tones and user budget.
    """
    # Ensure verified seed catalogue is loaded
    await load_seed_catalogue_if_empty(db)
    return await get_makeup_recommendations(request, db)

@router.get("/sources/status", response_model=List[SourceStatusInfo])
async def get_sources_status():
    """
    Inspect the retailer integration status, showing real capabilities,
    credentials required vs missing, and operational status.
    """
    return registry.get_all_statuses()

@router.post("/sources/seed")
async def trigger_seed_database(
    force: bool = Query(True, description="Force reseed database from seed catalogue"),
    db: AsyncSession = Depends(get_db)
):
    """
    Seed database with authentic verified Indian market products and prices.
    """
    count = await load_seed_catalogue_if_empty(db, force=force)
    return {"message": "Catalogue seed processed", "new_products_inserted": count}

# Dynamic Catalog Ingestion Endpoints (Production Market Pipeline)
@router.get("/catalog/stats")
async def get_catalog_stats(db: AsyncSession = Depends(get_db)):
    """
    Returns live statistics on total active products, shades, retailers, and freshness.
    """
    from app.services.catalog_sync import get_dynamic_catalog_stats
    return await get_dynamic_catalog_stats(db)

@router.post("/catalog/import")
async def import_products_feed(
    feed_items: List[dict],
    db: AsyncSession = Depends(get_db)
):
    """
    Dynamically ingest or update new products, shades, and live prices from any merchant feed.
    """
    from app.services.catalog_sync import import_dynamic_feed
    return await import_dynamic_feed(db, feed_items)

@router.post("/catalog/sync")
async def trigger_catalog_sync(
    db: AsyncSession = Depends(get_db)
):
    """
    Executes automated dynamic catalog refresh.
    Checks price freshness, refreshes merchant feeds, and syncs newly launched products.
    """
    from app.services.catalog_sync import get_dynamic_catalog_stats, refresh_all_database_prices
    # Execute live price refresh
    refresh_result = await refresh_all_database_prices(db)
    stats = await get_dynamic_catalog_stats(db)
    return {
        "status": "success",
        "message": "Dynamic catalog sync completed successfully",
        "refresh_summary": refresh_result,
        "stats": stats
    }

@router.post("/catalog/refresh-prices")
async def trigger_price_refresh(
    limit: int = Query(50, description="Max number of price records to check and update"),
    db: AsyncSession = Depends(get_db)
):
    """
    Live on-demand price refresh: scans database product URLs and updates live prices.
    Can be called by cron or webhooks for 100% free automated price updates.
    """
    from app.services.catalog_sync import refresh_all_database_prices
    return await refresh_all_database_prices(db, limit=limit)

@router.post("/catalog/products")
async def add_dynamic_product(
    payload: dict,
    db: AsyncSession = Depends(get_db)
):
    """
    Dynamically add any new market product. Automatically classifies shades and pulls live prices.
    """
    from app.services.catalog_sync import add_new_dynamic_product
    product, is_new = await add_new_dynamic_product(db, payload)
    return {
        "status": "success",
        "product_id": product.id,
        "title": product.title,
        "brand": product.brand,
        "is_new": is_new,
        "variants_count": len(product.variants) if product.variants else 0
    }



