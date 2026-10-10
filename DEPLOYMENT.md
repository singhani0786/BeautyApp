# GlowGuide AI Makeup - Deployment Guide

This guide provides beginner-friendly instructions for deploying the **GlowGuide AI Makeup Recommendation Platform** to production or running it locally.

---

## 1. Quick Local Development (Fastest, No Docker Required)

### Prerequisites
- Python 3.10+ (Python 3.14 recommended)
- Node.js 18+ & npm

### Step 1: Start Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run server (automatically initializes SQLite and loads authentic verified cosmetics catalogue)
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### Step 2: Start Frontend (React + Vite)
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 2. Production Deployment with Docker Compose (Recommended)

This setup runs PostgreSQL 16, the FastAPI backend, and Nginx serving the production Vite build with reverse proxying.

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials (or leave retailer keys empty if pending affiliate approval):
```env
ENVIRONMENT=production
PRICE_STALE_HOURS=24
ALLOW_FACE_STORAGE=false
```

### Step 2: Build & Launch
```bash
docker compose up -d --build
```

### Step 3: Verify Running Services
```bash
docker compose ps
docker compose logs -f backend
```
- Frontend: `http://YOUR_SERVER_IP` (Port 80)
- Backend API: `http://YOUR_SERVER_IP:8000/api`

---

## 3. Cloud Deployment (Render / Railway / DigitalOcean)

### Deploying to Render
1. **Database**: Create a new **PostgreSQL** instance on Render. Copy the `Internal Database URL`.
2. **Backend**:
   - Create a **Web Service**, connect your Git repo, and set root directory to `backend`.
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment variables: Set `DATABASE_URL` to your PostgreSQL URL (ensure driver is `postgresql+psycopg://`).
3. **Frontend**:
   - Create a **Static Site**, connect your Git repo, and set root directory to `frontend`.
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add a rewrite rule for SPA: `/* -> /index.html`.

---

## 4. How to Configure Live Retailer Integrations

### A. Amazon India (Amazon Associates & Creators API)
1. Join [Amazon Associates India](https://affiliate-program.amazon.in/).
2. You must achieve **10 qualifying referred purchases within the first 30 days** through standard links.
3. Once approved, navigate to **Tools > Creators API / PA-API** to obtain your `Access Key ID`, `Secret Key`, and `Partner Tag` (e.g., `glowguide-21`).
4. Set these in `.env`:
   ```env
   AMAZON_ACCESS_KEY_ID=your_access_key
   AMAZON_SECRET_KEY=your_secret_key
   AMAZON_ASSOCIATE_TAG=your_tag-21
   ```
5. Restart your backend service.

### B. Cuelinks Developer API v3
1. Sign up at [Cuelinks Publisher Portal](https://www.cuelinks.com/).
2. Once your publisher account is approved and you meet traffic/commission volume requirements, request an API token from [developers.cuelinks.com](https://developers.cuelinks.com/).
3. Add your credentials to `.env`:
   ```env
   CUELINKS_API_TOKEN=your_token
   CUELINKS_PUB_ID=your_pub_id
   CUELINKS_CHANNEL_ID=your_channel_id
   ```
4. Cuelinks will automatically transform merchant URLs (Nykaa, Flipkart, etc.) into monetized `clnk.in` redirect links with sub-ID tracking.

### C. Nykaa Affiliate Program
1. Standard access requires applying via the [Nykaa Affiliate Program](https://affiliate.nykaa.com/) (typically 5,000+ followers for direct creator approval).
2. For programmatic monetization, route Nykaa links through **Cuelinks** (which hosts an approved Nykaa campaign) or add your affiliate ID:
   ```env
   NYKAA_AFFILIATE_ID=your_nykaa_affiliate_id
   ```

---

## 5. Automated Tests & Production Validation

Run backend tests:
```bash
cd backend
PYTHONPATH=. venv/bin/pytest tests -v
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```

