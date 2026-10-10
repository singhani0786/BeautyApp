# Retailer Integration Matrix & API Capability Analysis

This document provides an official capability breakdown for the Indian beauty & cosmetics e-commerce ecosystem. It distinguishes between **product catalogue sources**, **live pricing APIs**, and **link-monetization / affiliate tracking networks**.

---

## 1. Retailer Integration Matrix

| Source Name | Authorized Access Method | Product Fields Available | Price/Stock Freshness | Affiliate-Link Support | Credentials & Approvals Needed | Actual Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Amazon India (Amazon Associates / Creators API & PA-API 5.0)** | REST API with OAuth 2.0 / AWS Signature V4 (`webservices.amazon.in`) | ASIN, Title, Brand, Category, Images, Variant Attributes, List Price, Offer Price, Availability, Customer Reviews | **Real-time** on API call (throttled by TPS quota; cached per Amazon ToS up to 24h) | **Direct Native** (generates affiliate links with partner tag, e.g. `tag=yourtag-21`) | 1. Active Amazon Associates India account.<br>2. Minimum 10 qualifying referred sales in last 30 days.<br>3. Access Key ID, Secret Key, and Partner Tag. | **Implemented Adapter with Live Capability & Graceful Unconfigured State**.<br>Validates keys; returns live data if credentials provided, otherwise reports explicit `UNCONFIGURED` status. |
| **Cuelinks Developer API (Pub API v3)** | REST API with Token Auth (`https://developers.cuelinks.com/pub_api/v3`) | **No Product Catalogue Search**. Only Campaign metadata (merchant ID, EPC, payout rates, commission terms) and Offers/Coupons feeds. | Not applicable for product catalogue; merchant status and EPC refreshed daily. | **Automated Link Transformation** (Converts raw merchant URL to tracked `clnk.in` redirect URL with sub-ids). | 1. Approved Cuelinks Publisher account.<br>2. API Key granted upon publisher verification/volume threshold.<br>3. Publisher ID and Channel ID. | **Implemented Adapter**.<br>Provides link conversion, sub-ID click tagging, and campaign validation. Gracefully flags lack of native catalogue. |
| **Nykaa Affiliate Program (NAP)** | Creator Portal (`affiliate.nykaa.com`) / Third-Party Affiliate Networks (Cuelinks, Takeads) | Web portal manual deep link generator. **No public open product search or catalogue REST API** for independent developers. | Manual scrape prohibited by ToS. Freshness dependent on affiliate feed or network sync. | **Deep Link Tracking** (via NAP tag or converted Cuelinks merchant redirect URL). | 1. 5,000+ followers for direct NAP approval.<br>2. Direct enterprise agreement for automated data feeds, or indirect route via Cuelinks/Takeads. | **Implemented Adapter**.<br>Generates tracked Nykaa URLs (direct affiliate tag or via Cuelinks redirect). Does not spoof catalogue; reports missing catalogue API. |
| **Authorized Merchant Product Feeds** | SFTP / HTTPS authenticated JSON/CSV/TSV feed files | Full SKU, Variant Shade Name, Hex Code, Volume, Brand, MRP, Selling Price, Inventory Count, Image URLs, Deep Links | **Batch Updated** (Hourly, Daily, or Webhook sync) with freshness timestamp tracking. | Direct retailer link with embedded campaign query parameters. | Merchant feed agreement, Basic Auth / API token or signed HTTPS download URL. | **Implemented Adapter & Ingestion Pipeline**.<br>Normalizes feeds into PostgreSQL database with variant shades and price expiry timestamps. |

---

## 2. Deep Dive: Capability Breakdown by Source

### A. Amazon India (Amazon Associates & Creators API)
- **Product Catalogue & Variants**: Available via ASIN query or search keywords (`SearchItems`, `GetItems`). Returns child ASIN variants (shades, sizes).
- **Current Prices & Stock**: Live `Offers.Listings.Price` and `Availability.Message`. Amazon operating policy allows caching for up to 24 hours.
- **Affiliate Link Generation**: Built directly into API responses (`DetailPageURL` includes associate tag).
- **Click & Conversion Tracking**: Tracked in Amazon Associates Central India dashboard with reporting APIs.
- **Eligibility & Restrictions**: Strictest entry requirement: developers cannot get API keys without 10 qualifying referred sales within the past 30 days. Without credentials, no live API call can be made.

### B. Cuelinks (Developer Pub API v3)
- **Product Catalogue & Variants**: ⚠️ **NOT SUPPORTED**. Cuelinks is a link wrapper / affiliate aggregator network, not an e-commerce catalogue engine. Attempting to query Cuelinks for "Maybelline Fit Me Shade 220" will not return product specs or shade palettes.
- **Current Prices & Stock**: Not provided by Cuelinks API.
- **Affiliate Link Generation**: Fully supported via `POST /pub_api/v3/links` or `GET /pub_api/v3/links.json?url={encoded_url}`. Generates tracked links with publisher attribution and sub-ID tracking.
- **Click & Conversion Tracking**: High detail via `reports/` and `transactions/` endpoints.
- **Eligibility & Restrictions**: Requires publisher account approval.

### C. Nykaa Affiliate Program
- **Product Catalogue & Variants**: No public REST API for catalogues. Independent developers cannot perform live SKU lookup via official public Nykaa endpoints.
- **Affiliate Link Generation**: Individual links are manually or programmatically formatted with publisher query parameters or passed through Cuelinks (Nykaa is an active merchant campaign on Cuelinks).
- **Strategy for Nykaa**: Ingest verified authorized product SKUs, and monetize via Cuelinks or Nykaa affiliate redirect URLs.

---

## 3. Architecture Decision & Safe Operation Policy

1. **No Spoofing / No Phantom Live Data**:
   If an adapter lacks API credentials, its status is explicitly flagged as `UNCONFIGURED` in `/api/sources/status`. The application never mocks live responses or pretends external retailer APIs are active.
2. **Normalized Local Storage with Freshness TTL**:
   All product catalogue data (brands, products, shade variants, SKUs) are stored in our PostgreSQL schema. Each price record contains `last_checked_at`, `stale_after_hours`, and `is_stale` properties.
3. **Affiliate Link Handling**:
   When rendering shopping buttons, links are dynamically generated using the configured adapter (e.g. direct Amazon associate link, or Cuelinks monetization link). If unconfigured, the fallback direct clean merchant product link is provided with an informative indicator.

