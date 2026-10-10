import urllib.parse
from typing import Optional, List, Dict, Any
import httpx
from app.sources.base import ProductSourceAdapter
from app.schemas.product import SourceCapabilities
from app.core.config import settings

class CuelinksAdapter(ProductSourceAdapter):
    """
    Cuelinks Developer API v3 Integration.
    Crucial Capability Distinction:
    - Provides: Link monetization transformation (clnk.in / redirected merchant URLs), subid attribution, EPC & campaign tracking.
    - DOES NOT PROVIDE: Product catalogue search, shade variant database, or live inventory pricing.
    """
    name = "cuelinks"
    display_name = "Cuelinks Monetization Network (API v3)"
    BASE_API_URL = "https://developers.cuelinks.com/pub_api/v3"

    def is_configured(self) -> bool:
        return bool(settings.CUELINKS_PUB_ID and settings.CUELINKS_API_TOKEN)

    def get_capabilities(self) -> SourceCapabilities:
        return SourceCapabilities(
            has_catalogue_search=False,  # Cuelinks has no product search
            has_live_prices=False,       # Cuelinks does not track real-time variant stock/price
            has_affiliate_links=True,    # Converts raw URLs to tracked links
            has_conversion_tracking=True # Transactions and reporting API
        )

    def get_required_credentials(self) -> List[str]:
        return ["CUELINKS_PUB_ID", "CUELINKS_API_TOKEN"]

    def get_missing_credentials(self) -> List[str]:
        missing = []
        if not settings.CUELINKS_PUB_ID:
            missing.append("CUELINKS_PUB_ID")
        if not settings.CUELINKS_API_TOKEN:
            missing.append("CUELINKS_API_TOKEN")
        return missing

    def generate_affiliate_link(self, original_url: str, sub_id: Optional[str] = None) -> str:
        """
        Transform merchant product URL into Cuelinks monetized redirect URL.
        Format: https://links.cuelinks.com?pub_id={pub_id}&url={encoded_url}&subid={sub_id}
        """
        if not settings.CUELINKS_PUB_ID:
            return original_url

        try:
            params = {
                "pub_id": settings.CUELINKS_PUB_ID,
                "url": original_url,
            }
            if settings.CUELINKS_CHANNEL_ID:
                params["channel_id"] = settings.CUELINKS_CHANNEL_ID
            if sub_id:
                params["subid"] = sub_id

            return f"https://links.cuelinks.com?{urllib.parse.urlencode(params)}"
        except Exception:
            return original_url

    async def fetch_live_price(self, identifier: str) -> Optional[Dict[str, Any]]:
        # Explicitly unsupported by Cuelinks
        return None

