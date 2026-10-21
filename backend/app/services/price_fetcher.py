import re
import json
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
]

def _clean_price_val(raw: Any) -> Optional[float]:
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        val = float(raw)
        # Shopify stores prices in paise (e.g., 59415 = ₹594.15)
        if val >= 10000.0:
            val = round(val / 100.0, 2)
        return val if 40.0 <= val <= 25000.0 else None

    raw_str = str(raw).replace(",", "").replace("₹", "").replace("Rs.", "").replace("INR", "").strip()
    match = re.search(r"(\d+(?:\.\d+)?)", raw_str)
    if match:
        try:
            val = float(match.group(1))
            if val >= 10000.0:
                val = round(val / 100.0, 2)
            return val if 40.0 <= val <= 25000.0 else None
        except ValueError:
            return None
    return None

async def fetch_live_product_price(product_url: str) -> Optional[Dict[str, Any]]:
    """
    Live asynchronous price and stock fetcher for Indian e-commerce sites (Amazon, Nykaa, Lakme).
    Uses lightweight schema parsing (JSON-LD, OpenGraph, DOM regex) with zero third-party paid scraping dependencies.
    """
    if not product_url or not product_url.startswith("http"):
        return None

    headers = {
        "User-Agent": USER_AGENTS[0],
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Cache-Control": "no-cache",
    }

    try:
        async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=8.0) as client:
            resp = await client.get(product_url)
            if resp.status_code != 200:
                logger.warning(f"Live fetch returned status {resp.status_code} for {product_url}")
                return None
            html = resp.text
    except Exception as e:
        logger.warning(f"Live price fetch failed for {product_url}: {e}")
        return None

    extracted_price: Optional[float] = None
    extracted_mrp: Optional[float] = None
    in_stock: bool = True

    # 1. Strategy: Structured Schema JSON-LD
    json_ld_matches = re.findall(r'<script[^>]*type=[\'"]application/ld\+json[\'"][^>]*>(.*?)</script>', html, re.DOTALL | re.IGNORECASE)
    for block in json_ld_matches:
        try:
            data = json.loads(block.strip())
            # Sometimes JSON-LD is a list
            items = data if isinstance(data, list) else [data]
            for item in items:
                offers = item.get("offers")
                if isinstance(offers, list) and offers:
                    offers = offers[0]
                if isinstance(offers, dict):
                    p = _clean_price_val(offers.get("price") or offers.get("lowPrice"))
                    if p:
                        extracted_price = p
                    if "availability" in offers:
                        in_stock = "OutOfStock" not in str(offers.get("availability"))
                    m = _clean_price_val(offers.get("highPrice") or item.get("mrp"))
                    if m:
                        extracted_mrp = m
                    break
            if extracted_price:
                break
        except Exception:
            continue

    # 2. Strategy: Meta & OpenGraph Price Tags
    if not extracted_price:
        og_price = re.search(r'<meta[^>]+(?:property|name)=[\'"](?:product:price:amount|og:price:amount)[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
        if og_price:
            extracted_price = _clean_price_val(og_price.group(1))

    # 3. Strategy: Retailer Specific HTML Parsing
    if not extracted_price:
        # Amazon India
        if "amazon.in" in product_url:
            amz_p = re.search(r'class=[\'"][^\'"]*a-price-whole[^\'"]*[\'"]>([^<]+)<', html)
            if amz_p:
                extracted_price = _clean_price_val(amz_p.group(1))
            amz_mrp = re.search(r'class=[\'"][^\'"]*a-text-price[^\'"]*[\'"][^>]*>.*?₹\s*([^<]+)<', html, re.DOTALL)
            if amz_mrp:
                extracted_mrp = _clean_price_val(amz_mrp.group(1))

        # Nykaa
        elif "nykaa.com" in product_url:
            nykaa_p = re.search(r'class=[\'"][^\'"]*css-1jczs19[^\'"]*[\'"]>₹?([^<]+)<', html)
            if nykaa_p:
                extracted_price = _clean_price_val(nykaa_p.group(1))
            nykaa_m = re.search(r'class=[\'"][^\'"]*css-u05rr[^\'"]*[\'"]>₹?([^<]+)<', html)
            if nykaa_m:
                extracted_mrp = _clean_price_val(nykaa_m.group(1))

        # Lakme Official / Shopify
        elif "lakmeindia.com" in product_url:
            lakme_p = re.search(r'[\'"]price[\'"]\s*:\s*(\d+)', html)
            if lakme_p:
                extracted_price = _clean_price_val(lakme_p.group(1))
            lakme_m = re.search(r'[\'"]compare_at_price[\'"]\s*:\s*(\d+)', html)
            if lakme_m:
                extracted_mrp = _clean_price_val(lakme_m.group(1))

    # If MRP not found in JSON-LD, look for compare_at_price or strike price
    if not extracted_mrp or extracted_mrp <= extracted_price:
        compare_matches = re.findall(r'[\'\"\,]compare_at_price[\'\"]?\s*:\s*(\d+)', html)
        candidates = [_clean_price_val(c) for c in compare_matches]
        valid_mrps = [v for v in candidates if v and v > extracted_price]
        if valid_mrps:
            extracted_mrp = max(valid_mrps)

    if not extracted_price:
        return None

    # Calculate discount percent
    mrp = extracted_mrp or extracted_price
    if mrp < extracted_price:
        mrp = extracted_price
    discount = round(((mrp - extracted_price) / mrp) * 100, 1) if mrp > extracted_price else 0.0

    return {
        "current_price": float(extracted_price),
        "mrp": float(mrp),
        "discount_percent": float(discount),
        "in_stock": in_stock,
        "is_stale": False,
    }
