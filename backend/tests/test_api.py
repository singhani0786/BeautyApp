import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import init_db

@pytest.fixture(autouse=True)
async def ensure_db():
    await init_db()

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["service"] == "GlowGuide AI Makeup"

@pytest.mark.asyncio
async def test_sources_status_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/sources/status")
        assert res.status_code == 200
        data = res.json()
        assert len(data) >= 4
        source_names = [s["source_name"] for s in data]
        assert "amazon_in" in source_names
        assert "cuelinks" in source_names
        assert "nykaa" in source_names
        assert "authorized_feed" in source_names

@pytest.mark.asyncio
async def test_recommendations_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "undertone": "warm",
            "skin_depth": "medium",
            "skin_type": "oily",
            "category": "foundation",
            "budget_inr": 600.0
        }
        res = await client.post("/api/recommendations", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["query_undertone"] == "warm"
        assert data["query_skin_depth"] == "medium"
        assert len(data["recommendations"]) > 0
        
        # Check tags
        tags = [r["tag"] for r in data["recommendations"]]
        assert "budget_friendly" in tags or "best_value" in tags or "best_overall" in tags
