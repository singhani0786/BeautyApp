from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from app.schemas.product import SourceCapabilities, SourceStatusInfo

class ProductSourceAdapter(ABC):
    name: str
    display_name: str

    @abstractmethod
    def is_configured(self) -> bool:
        """Check if all required production credentials and environment variables are present."""
        pass

    @abstractmethod
    def get_capabilities(self) -> SourceCapabilities:
        """Explicitly declare what this source can and cannot do."""
        pass

    @abstractmethod
    def get_required_credentials(self) -> List[str]:
        """List of env variable names or keys required for live operation."""
        pass

    @abstractmethod
    def get_missing_credentials(self) -> List[str]:
        """List of required credentials currently missing."""
        pass

    @abstractmethod
    def generate_affiliate_link(self, original_url: str, sub_id: Optional[str] = None) -> str:
        """Generate a tracked monetization affiliate link, or return canonical URL with explanation if unconfigured."""
        pass

    @abstractmethod
    async def fetch_live_price(self, identifier: str) -> Optional[Dict[str, Any]]:
        """Fetch real-time price & stock from authorized API. Returns None if unconfigured or unsupported."""
        pass

    def get_status_info(self) -> SourceStatusInfo:
        configured = self.is_configured()
        missing = self.get_missing_credentials()
        caps = self.get_capabilities()
        
        if configured:
            status_reason = "Fully configured with active credentials."
        else:
            status_reason = f"Unconfigured. Missing credentials: {', '.join(missing)}."

        return SourceStatusInfo(
            source_name=self.name,
            display_name=self.display_name,
            is_configured=configured,
            status_reason=status_reason,
            capabilities=caps,
            required_credentials=self.get_required_credentials(),
            missing_credentials=missing
        )

