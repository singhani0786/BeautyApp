import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    String, Float, Integer, Boolean, DateTime, ForeignKey, JSON, Text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base
from app.core.config import settings

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    brand: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # foundation, concealer, lipstick, blush, compact, bb_cream
    description: Mapped[str] = mapped_column(Text, default="")
    
    # Matching Attributes
    skin_tones: Mapped[list[str]] = mapped_column(JSON, default=list)  # ["fair", "medium", "tan", "deep"]
    undertones: Mapped[list[str]] = mapped_column(JSON, default=list)  # ["warm", "cool", "neutral", "olive"]
    skin_types: Mapped[list[str]] = mapped_column(JSON, default=list)  # ["oily", "dry", "combination", "sensitive", "normal"]
    finish: Mapped[str] = mapped_column(String(64), default="natural")  # matte, dewy, natural, satin
    coverage: Mapped[str] = mapped_column(String(64), default="medium")  # sheer, light, medium, full
    
    # Social proof & credibility
    rating: Mapped[float] = mapped_column(Float, default=4.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # State
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    variants: Mapped[list["ProductVariant"]] = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(64), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    
    shade_name: Mapped[str] = mapped_column(String(128), nullable=False)  # e.g. "128 Warm Nude", "NC40"
    shade_code: Mapped[str] = mapped_column(String(64), default="")
    hex_color: Mapped[str] = mapped_column(String(16), default="#E5A882")  # Approximate swatch color
    undertone: Mapped[str] = mapped_column(String(32), default="neutral")  # warm, cool, neutral, olive
    depth_level: Mapped[str] = mapped_column(String(32), default="medium")  # fair, light, medium, tan, deep
    sku: Mapped[str] = mapped_column(String(128), index=True, default="")
    image_url: Mapped[str] = mapped_column(String(512), default="")

    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    prices: Mapped[list["PriceRecord"]] = relationship("PriceRecord", back_populates="variant", cascade="all, delete-orphan")


class PriceRecord(Base):
    __tablename__ = "price_records"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    variant_id: Mapped[str] = mapped_column(String(64), ForeignKey("product_variants.id", ondelete="CASCADE"), index=True, nullable=False)
    
    retailer: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # amazon_in, nykaa, cuelinks_merchant, authorized_feed
    currency: Mapped[str] = mapped_column(String(8), default="INR")
    mrp: Mapped[float] = mapped_column(Float, nullable=False)  # Original Maximum Retail Price
    current_price: Mapped[float] = mapped_column(Float, nullable=False)  # Current selling price in INR
    discount_percent: Mapped[float] = mapped_column(Float, default=0.0)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    stock_status: Mapped[str] = mapped_column(String(32), default="in_stock")
    
    product_url: Mapped[str] = mapped_column(String(1024), nullable=False)  # Direct canonical merchant link
    affiliate_url: Mapped[str] = mapped_column(String(1024), default="")    # Monetized link
    
    last_checked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    stale_after_hours: Mapped[int] = mapped_column(Integer, default=settings.PRICE_STALE_HOURS)

    variant: Mapped["ProductVariant"] = relationship("ProductVariant", back_populates="prices")

    @property
    def is_stale(self) -> bool:
        delta = datetime.now(timezone.utc) - self.last_checked_at.replace(tzinfo=timezone.utc)
        return delta.total_seconds() > (self.stale_after_hours * 3600)

