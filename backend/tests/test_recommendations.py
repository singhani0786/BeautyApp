import pytest
from app.services.recommendation import get_makeup_recommendations
from app.schemas.product import RecommendationRequest

@pytest.mark.asyncio
async def test_recommendations_with_strict_budget(test_db):
    # Request for warm medium skin with a strict ₹500 budget
    req = RecommendationRequest(
        undertone="warm",
        skin_depth="medium",
        skin_type="oily",
        category="foundation",
        budget_inr=500.0
    )
    res = await get_makeup_recommendations(req, test_db)

    assert res.budget_limit_inr == 500.0
    assert len(res.recommendations) > 0

    # Ensure in-budget picks adhere to budget limit
    for rec in res.recommendations:
        if rec.tag in ["budget_friendly", "best_value", "best_overall"]:
            assert rec.product.best_price.current_price <= 500.0, f"{rec.tag} exceeded budget: {rec.product.best_price.current_price}"

@pytest.mark.asyncio
async def test_recommendations_without_budget_limit(test_db):
    req = RecommendationRequest(
        undertone="warm",
        skin_depth="medium",
        skin_type="all",
        category="foundation",
        budget_inr=None
    )
    res = await get_makeup_recommendations(req, test_db)

    assert res.budget_limit_inr is None
    tags = [r.tag for r in res.recommendations]
    assert "best_overall" in tags
    assert "budget_friendly" in tags

@pytest.mark.asyncio
async def test_shade_and_undertone_matching(test_db):
    req = RecommendationRequest(
        undertone="olive",
        skin_depth="light",
        skin_type="normal",
        category="foundation",
        budget_inr=None
    )
    res = await get_makeup_recommendations(req, test_db)
    
    # M.A.C NC25 is olive light; should be surfaced
    matched_shades = [r.product.matched_variant.shade_name for r in res.recommendations]
    has_olive_match = any("NC25" in s or "olive" in s.lower() for s in matched_shades)
    assert has_olive_match, f"Expected olive shade match, got {matched_shades}"

