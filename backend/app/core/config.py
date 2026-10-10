from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "GlowGuide AI Makeup"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./beauty_makeup.db",
        description="Async database connection string (e.g. postgresql+psycopg://user:pass@localhost:5432/beauty_makeup or sqlite+aiosqlite:///...)"
    )
    
    # Retailer Credentials & Keys (Strict backend isolation)
    # Amazon India PA-API / Creators API
    AMAZON_ACCESS_KEY_ID: Optional[str] = None
    AMAZON_SECRET_KEY: Optional[str] = None
    AMAZON_ASSOCIATE_TAG: Optional[str] = None  # e.g. "glowguide-21"
    AMAZON_HOST: str = "webservices.amazon.in"
    AMAZON_REGION: str = "eu-west-1" # standard PA-API region for in marketplace
    
    # Cuelinks Developer Pub API v3
    CUELINKS_API_TOKEN: Optional[str] = None
    CUELINKS_PUB_ID: Optional[str] = None
    CUELINKS_CHANNEL_ID: Optional[str] = None
    
    # Nykaa Affiliate
    NYKAA_AFFILIATE_ID: Optional[str] = None
    NYKAA_TRACKING_PREFIX: Optional[str] = None
    
    # Price Freshness Policy
    PRICE_STALE_HOURS: int = 24
    
    # Privacy & Safety Policy
    ALLOW_FACE_STORAGE: bool = False
    FACE_PROCESSING_IN_MEMORY_ONLY: bool = True
    MAX_IMAGE_UPLOAD_BYTES: int = 5 * 1024 * 1024  # 5 MB max
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

