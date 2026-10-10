from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import init_db, async_session_maker
from app.services.seed_loader import load_seed_catalogue_if_empty
from app.api.endpoints import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed data exist
    await init_db()
    async with async_session_maker() as session:
        await load_seed_catalogue_if_empty(session)
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Production-Ready AI Makeup Recommendation Platform with Indian Retailer & Shade Adaptation",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Serve built frontend if dist exists (enables single-URL full-stack hosting on Render/Railway/Fly)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {
            "app": settings.PROJECT_NAME,
            "status": "online",
            "docs_url": "/docs",
            "api_prefix": settings.API_V1_PREFIX
        }

