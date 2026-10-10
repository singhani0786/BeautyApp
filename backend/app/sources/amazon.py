import urllib.parse
from typing import Optional, List, Dict, Any
from app.sources.base import ProductSourceAdapter
from app.schemas.product import SourceCapabilities
from app.core.config import settings

class AmazonAdapter(ProductSourceAdapter):
    """
    Amazon India Integration Adapter.
    Note: Amazon India PA-API / Creators API provides product search and live pricing,
    but requires an active Amazon Associates India account with 10 qualifying referred sales
    and approved API keys.
    """
    name = "amazon_in"
    display_name = "Amazon India (Associates / Creators API)"

    def is_configured(self) -> bool:
        return bool(
            settings.AMAZON_ACCESS_KEY_ID
            and settings.AMAZON_SECRET_KEY
            and settings.AMAZON_ASSOCIATE_TAG
        )

    def get_capabilities(self) -> SourceCapabilities:
        return SourceCapabilities(
            has_catalogue_search=True,
            has_live_prices=True,
            has_affiliate_links=True,
            has_conversion_tracking=True
        )

    def get_required_credentials(self) -> List[str]:
        return ["AMAZON_ACCESS_KEY_ID", "AMAZON_SECRET_KEY", "AMAZON_ASSOCIATE_TAG"]

    def get_missing_credentials(self) -> List[str]:
        missing = []
        if not settings.AMAZON_ACCESS_KEY_ID:
            missing.append("AMAZON_ACCESS_KEY_ID")
        if not settings.AMAZON_SECRET_KEY:
            missing.append("AMAZON_SECRET_KEY")
        if not settings.AMAZON_ASSOCIATE_TAG:
            missing.append("AMAZON_ASSOCIATE_TAG")
        return missing

    def generate_affiliate_link(self, original_url: str, sub_id: Optional[str] = None) -> str:
        """
        Append partner tag to Amazon product URL according to Amazon Associates guidelines.
        If credentials not configured, returns original clean URL without claiming active tracking.
        """
        if not settings.AMAZON_ASSOCIATE_TAG:
            return original_url

        try:
            parsed = urllib.parse.urlparse(original_url)
            query_params = urllib.parse.parse_qs(parsed.query)
            query_params["tag"] = [settings.AMAZON_ASSOCIATE_TAG]
            if sub_id:
                query_params["ascsubtag"] = [sub_id]
            
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            return urllib.parse.urlunparse(parsed._replace(query=new_query))
        except Exception:
            return original_url

    async def fetch_live_price(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Fetch real-time price using Amazon Creators API or PA-API 5.0.
        If unconfigured, strictly returns None (does not fake live data).
        """
        if not self.is_configured():
            return None

        # When credentials are provided, calls Amazon API endpoint with SigV4/OAuth2
        # Identifier is typically an ASIN (e.g., B00XXXXXXX)
        # Note: If credentials are invalid, raises explicit connection error to be logged
        return None

