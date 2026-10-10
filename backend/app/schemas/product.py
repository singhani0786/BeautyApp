from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PriceInfo(BaseModel):
    retailer: str
    currency: str = "INR"
    mrp: float
    current_price: float
    discount_percent: float
    in_stock: bool
    stock_status: str
    product_url: str
    affiliate_url: str
    is_stale: bool
    last_checked_at: datetime

class VariantInfo(BaseModel):
    id: str
    shade_name: str
    shade_code: str
    hex_color: str
    undertone: str
    depth_level: str
    sku: str
    image_url: str
    prices: List[PriceInfo] = []

class ProductInfo(BaseModel):
    id: str
    title: str
    brand: str
    category: str
    description: str
    finish: str
    coverage: str
    rating: float
    review_count: int
    matched_variant: Optional[VariantInfo] = None
    best_price: Optional[PriceInfo] = None
    all_variants: List[VariantInfo] = []

class RecommendationCategoryResult(BaseModel):
    tag: str  # "budget_friendly", "best_value", "premium", "best_overall"
    label: str  # "Best Budget Pick", "Best Value", "Luxury / Premium", "Best Overall"
    reason: str
    product: ProductInfo

class RecommendationRequest(BaseModel):
    undertone: str = Field(..., description="warm, cool, neutral, olive")
    skin_depth: str = Field(..., description="fair, light, medium, tan, deep")
    skin_type: Optional[str] = Field("all", description="oily, dry, combination, sensitive, normal, all")
    category: Optional[str] = Field("foundation", description="foundation, concealer, lipstick, blush, compact, bb_cream, all")
    budget_inr: Optional[float] = Field(None, description="Max budget in INR. None or <=0 means no budget limit.")

class RecommendationResponse(BaseModel):
    query_undertone: str
    query_skin_depth: str
    query_skin_type: str
    query_category: str
    budget_limit_inr: Optional[float]
    total_candidates_found: int
    recommendations: List[RecommendationCategoryResult]
    alternative_picks: List[ProductInfo] = []

class FaceAnalysisResult(BaseModel):
    undertone: str  # warm, cool, neutral, olive
    skin_depth: str  # fair, light, medium, tan, deep
    confidence: float
    estimated_ita: float
    dominant_hex: str
    privacy_notice: str = "Analysis computed entirely in-memory. Raw selfie photo was not persisted to disk."
    recommended_categories: List[str] = ["foundation", "concealer", "lipstick", "blush"]

class SourceCapabilities(BaseModel):
    has_catalogue_search: bool
    has_live_prices: bool
    has_affiliate_links: bool
    has_conversion_tracking: bool

class SourceStatusInfo(BaseModel):
    source_name: str
    display_name: str
    is_configured: bool
    status_reason: str
    capabilities: SourceCapabilities
    required_credentials: List[str]
    missing_credentials: List[str]

