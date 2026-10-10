# GlowGuide AI: Production-Ready AI Makeup Recommendation Platform

[![Python 3.14](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

A production-engineered AI beauty recommendation platform specialized for **Indian skin complexions, undertones (warm golden, cool rosy, neutral, and olive), INR pricing, and authorized retailer affiliate integration**.

---

## Key Features

1. **In-Memory Facial Undertone & ITA Detection**:
   - Zero-persistence privacy guarantee: uploaded selfies and live webcam captures are evaluated strictly in transient RAM buffers and never stored on disk.
   - Computes Individual Typology Angle (ITA) and calibrated chromatic balance for South Asian skin depths (fair, light, medium, tan, deep) and undertones.

2. **Categorized Recommendation Engine**:
   - **Best Budget Pick**: Lowest-priced product matching the exact shade and formulation within budget.
   - **Best Value & Performance**: Maximizes price-to-rating ratio with high customer review consensus.
   - **Luxury & Premium Upgrade**: High-pigment, 24H longwear formulation for aspirational discovery.
   - **Best Overall Match**: Highest algorithmic synergy score across undertone, shade depth, finish, and customer rating.

3. **User-Entered Budgeting**:
   - Flexible INR (₹) price limits or "No Budget Limit" mode.
   - Quick budget presets: ₹500, ₹1,000, ₹1,500, ₹2,500, ₹4,000.

4. **Authentic Products & Variants**:
   - Real shade names (e.g. *Maybelline 128 Warm Nude*, *220 Natural Beige*, *M.A.C NC25*, *NC40*, *NC42*, *L'Oreal 200 Golden Sand*, *Kay Beauty 120Y Medium Warm*).
   - Real MRP and selling prices in INR with discount tracking.
   - Verified swatch colors in hex.
   - Never fabricates fake products or fictitious URLs.

5. **Retailer Integration & Monetization**:
   - **Amazon India**: Native PA-API / Creators API adapter with Associate Tag tracking.
   - **Cuelinks Pub API v3**: Automatic link conversion and sub-ID click attribution.
   - **Nykaa**: Affiliate deep link formatting and Cuelinks merchant campaign routing.
   - **Authorized Merchant Feeds**: Normalized database ingestion pipeline with price freshness tracking (`PRICE_STALE_HOURS`).
   - **Strict Credentials Isolation**: Never fakes live status. Missing keys clearly report `UNCONFIGURED` in `/api/sources/status`.

---

## Architecture

```
beautyFaceMakup/
├── backend/
│   ├── app/
│   │   ├── api/endpoints.py       # REST API endpoints
│   │   ├── core/config.py         # Settings & credentials
│   │   ├── db/session.py          # SQLAlchemy async session
│   │   ├── models/product.py      # Product, Variant, Price models
│   │   ├── schemas/product.py     # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── face_analysis.py   # In-memory ITA & undertone detection
│   │   │   ├── recommendation.py  # 4-tier recommendation engine
│   │   │   └── seed_loader.py     # Authentic catalogue ingestion
│   │   ├── sources/
│   │   │   ├── amazon.py          # Amazon India adapter
│   │   │   ├── cuelinks.py        # Cuelinks Pub API v3 adapter
│   │   │   ├── nykaa.py           # Nykaa affiliate adapter
│   │   │   ├── feed.py            # Authorized partner feed adapter
│   │   │   └── registry.py        # Adapter registry & link resolution
│   │   └── main.py                # FastAPI entry point
│   ├── fixtures/
│   │   └── seed_catalogue.json    # Authentic Indian cosmetics data
│   ├── tests/                     # Automated pytest suite (13 tests)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Navbar with live source badge
│   │   │   ├── PhotoCapture.tsx   # Webcam & upload with privacy badge
│   │   │   ├── ToneSelector.tsx   # INR budget & tone selectors
│   │   │   ├── RecommendationCard.tsx # Categorized product cards
│   │   │   └── RetailerDrawer.tsx # Live API integration matrix modal
│   │   ├── types/api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/
│   └── RETAILER_INTEGRATION_MATRIX.md # Detailed capability breakdown
├── docker-compose.yml             # PostgreSQL 16 + Backend + Frontend
├── .env.example                   # Complete configuration template
└── DEPLOYMENT.md                  # Beginner-friendly deployment guide
```

---

## Quick Start

### 1. Run Automated Tests
```bash
cd backend
PYTHONPATH=. venv/bin/pytest tests -v
```

### 2. Run Local Development Server
```bash
# Terminal 1: Backend
cd backend
python3 -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Build Production Docker Stack
```bash
docker compose up -d --build
```

---

## Documentation
- [Retailer Integration Matrix & API Capabilities](docs/RETAILER_INTEGRATION_MATRIX.md)
- [Deployment Guide](DEPLOYMENT.md)

