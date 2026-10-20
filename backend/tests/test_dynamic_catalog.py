import pytest
from httpx import AsyncClient
from app.services.shade_classifier import classify_shade, infer_product_metadata

def test_shade_classifier_warm_medium():
    result = classify_shade("332 Golden Caramel", "Fit Me Matte Liquid")
    assert result["depth_level"] in ["tan", "deep", "medium"]
    assert result["undertone"] == "warm" or result["undertone"] == "neutral"
    assert result["hex_color"].startswith("#")

def test_shade_classifier_mac_tones():
    nc_res = classify_shade("NC42", "Studio Fix")
    assert nc_res["undertone"] == "warm"

    nw_res = classify_shade("NW45", "Studio Fix")
    assert nw_res["undertone"] == "cool"

def test_infer_product_metadata():
    meta = infer_product_metadata("Liquid Matte Longwear Foundation", "foundation")
    assert meta["finish"] == "matte"
    assert "oily" in meta["skin_types"]

@pytest.mark.asyncio
async def test_dynamic_catalog_services(test_db):
    from app.services.catalog_sync import get_dynamic_catalog_stats, import_dynamic_feed

    # Test catalog stats
    stats = await get_dynamic_catalog_stats(test_db)
    assert stats["is_dynamic"] is True
    assert stats["total_products"] >= 10
    assert "active_brands_count" in stats

    # Test dynamic import of new product
    test_feed = [
        {
            "title": "Colorbar 24Hrs Weightless Liquid Foundation",
            "brand": "Colorbar",
            "category": "foundation",
            "rating": 4.4,
            "review_count": 8900,
            "variants": [
                {
                    "shade_name": "FW 2.1 Fair Warm",
                    "prices": [
                        {
                            "retailer": "nykaa",
                            "mrp": 995.0,
                            "current_price": 845.0,
                            "product_url": "https://www.nykaa.com/colorbar-foundation/p/12345"
                        }
                    ]
                }
            ]
        }
    ]

    import_data = await import_dynamic_feed(test_db, test_feed)
    assert import_data["status"] == "success"
    assert import_data["total_processed"] == 1
    assert import_data["created"] == 1

    updated_stats = await get_dynamic_catalog_stats(test_db)
    assert "Colorbar" in updated_stats["brands"]

