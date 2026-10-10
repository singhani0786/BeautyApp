from typing import Dict, List, Optional
from app.sources.base import ProductSourceAdapter
from app.sources.amazon import AmazonAdapter
from app.sources.cuelinks import CuelinksAdapter
from app.sources.nykaa import NykaaAdapter
from app.sources.feed import AuthorizedFeedAdapter
from app.schemas.product import SourceStatusInfo

class AdapterRegistry:
    def __init__(self):
        self._adapters: Dict[str, ProductSourceAdapter] = {
            "amazon_in": AmazonAdapter(),
            "cuelinks": CuelinksAdapter(),
            "nykaa": NykaaAdapter(),
            "authorized_feed": AuthorizedFeedAdapter(),
        }

    def get_adapter(self, source_name: str) -> Optional[ProductSourceAdapter]:
        return self._adapters.get(source_name)

    def get_all_statuses(self) -> List[SourceStatusInfo]:
        return [adapter.get_status_info() for adapter in self._adapters.values()]

    def generate_affiliate_link(
        self,
        retailer: str,
        original_url: str,
        sub_id: Optional[str] = None
    ) -> str:
        # 1. If direct adapter exists and is configured, use it
        adapter = self.get_adapter(retailer)
        if adapter and adapter.is_configured():
            return adapter.generate_affiliate_link(original_url, sub_id)

        # 2. If Cuelinks is configured, it can wrap URLs for any Indian merchant (including Nykaa, Flipkart, etc.)
        cuelinks = self.get_adapter("cuelinks")
        if cuelinks and cuelinks.is_configured():
            return cuelinks.generate_affiliate_link(original_url, sub_id)

        # 3. If no monetized adapter is configured, return clean original URL
        return original_url

registry = AdapterRegistry()

