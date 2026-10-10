export interface PriceInfo {
  retailer: string;
  currency: string;
  mrp: number;
  current_price: number;
  discount_percent: number;
  in_stock: boolean;
  stock_status: string;
  product_url: string;
  affiliate_url: string;
  is_stale: boolean;
  last_checked_at: string;
}

export interface VariantInfo {
  id: string;
  shade_name: string;
  shade_code: string;
  hex_color: string;
  undertone: string;
  depth_level: string;
  sku: string;
  image_url: string;
  prices: PriceInfo[];
}

export interface ProductInfo {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  finish: string;
  coverage: string;
  rating: number;
  review_count: number;
  matched_variant?: VariantInfo;
  best_price?: PriceInfo;
  all_variants: VariantInfo[];
}

export interface RecommendationCategoryResult {
  tag: 'budget_friendly' | 'best_value' | 'premium' | 'best_overall';
  label: string;
  reason: string;
  product: ProductInfo;
}

export interface RecommendationResponse {
  query_undertone: string;
  query_skin_depth: string;
  query_skin_type: string;
  query_category: string;
  budget_limit_inr: number | null;
  total_candidates_found: number;
  recommendations: RecommendationCategoryResult[];
  alternative_picks: ProductInfo[];
}

export interface FaceAnalysisResult {
  undertone: string;
  skin_depth: string;
  confidence: number;
  estimated_ita: number;
  dominant_hex: string;
  privacy_notice: string;
  recommended_categories: string[];
}

export interface SourceCapabilities {
  has_catalogue_search: boolean;
  has_live_prices: boolean;
  has_affiliate_links: boolean;
  has_conversion_tracking: boolean;
}

export interface SourceStatusInfo {
  source_name: string;
  display_name: string;
  is_configured: boolean;
  status_reason: string;
  capabilities: SourceCapabilities;
  required_credentials: string[];
  missing_credentials: string[];
}

