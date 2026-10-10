import urllib.parse
from typing import Optional, List, Dict, Any
from app.sources.base import ProductSourceAdapter
from app.schemas.product import SourceCapabilities
from app.core.config import settings

class NykaaAdapter(ProductSourceAdapter):
    """
    Nykaa Affiliate Adapter.
    Crucial Capability Distinction:
    - Official Nykaa Affiliate Program operates via creator dashboard (affiliate.nykaa.com) with 5k follower threshold.
    - DOES NOT PROVIDE a public open REST API for product catalogue search or live inventory queries for standard developers.
    - Affiliate link generation is done either directly via partner affiliate query parameters or by routing through Cuelinks.
    """
    name = "nykaa"
    display_name = "Nykaa Affiliate Program"

    def is_configured(self) -> bool:
        return bool(settings.NYKAA_AFFILIATE_ID)

    def get_capabilities(self) -> SourceCapabilities:
        return SourceCapabilities(
            has_catalogue_search=False,  # No open developer REST API for Nykaa catalog
            has_live_prices=False,       # Scraping prohibited by ToS; no open pricing API
            has_affiliate_links=True,    # Direct affiliate parameter or Cuelinks routing
            has_conversion_tracking=True # Tracked via Nykaa affiliate portal / Cuelinks
        )

    def get_required_credentials(self) -> List[str]:
        return ["NYKAA_AFFILIATE_ID"]

    def get_missing_credentials(self) -> List[str]:
        missing = []
        if not settings.NYKAA_AFFILIATE_ID:
            missing.append("NYKAA_AFFILIATE_ID")
        return missing

    def generate_affiliate_link(self, original_url: str, sub_id: Optional[str] = None) -> str:
        """
        Append Nykaa affiliate tracking parameter if configured.
        Otherwise returns clean URL without fake tracking.
        """
        if not settings.NYKAA_AFFILIATE_ID:
            return original_url

        try:
            parsed = urllib.parse.urlparse(original_url)
            query_params = urllib.parse.parse_qs(parsed.query)
            query_params["affiliate_id"] = [settings.NYKAA_AFFILIATE_ID]
            if sub_id:
                query_params["sub_id"] = [sub_id]
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            return urllib.parse.urlunparse(parsed._replace(query=new_query))
        except Exception:
            return original_url

    async def fetch_live_price(self, identifier: str) -> Optional[Dict[str, Any]]:
        # Not supported by public Nykaa affiliate tools
        return None

