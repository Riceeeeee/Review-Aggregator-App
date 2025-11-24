# Minimal Product Catalog – Full-Stack Teaching App

Production-ready starter for teaching modern full-stack development: Node.js/Express + React (Vite) + MySQL, with review aggregation, analytics, admin workflows, theming, and Docker/Dev Container support.

---

## What’s inside
- REST API (Express 5), validation, logging, healthcheck, CORS.
- React SPA (Vite): product list, detail page with filters/charts, analytics dashboard, admin panel.
- MySQL schema with reviews (verified_purchase, moderation fields).
- **New:** Walmart structured reviews fetch via ScraperAPI; frontend button to trigger it.
- Light/Dark theme toggle; Docker Compose; Dev Containers.

---

## Architecture
```
Frontend (React + Vite)  <--HTTP/JSON-->  Backend (Express)  <--SQL-->  MySQL
                                               |
                                               | (optional) Scraper service
```

Key flows:
- Product catalog: search, category filter, pagination, avg rating/review count.
- Product detail: reviews, filters (source/rating/verified), search, sort, pagination, summary, charts, fetch triggers.
- Admin: product CRUD, review moderation (flag/approve/reject/delete).
- Analytics: overview dashboards.
- Fetchers: legacy scraper fetch + **new Walmart ScraperAPI fetch**.

---

## Quick start

### Prereqs
- Docker Desktop (recommended) **or** Node.js 22+, MySQL 8.0+.
- VS Code + Dev Containers extension (optional).

### Get the code
```bash
git clone <your-repo-url>
cd fullstack-minimal-app-develop
```

### One command (Docker)
```bash
docker compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

### Dev Containers
1) Open folder in VS Code → Reopen in Container.  
2) Inside container:
```bash
npm install   # installs workspaces
npm run dev   # starts backend + frontend
```
3) Open frontend at http://localhost:5173 (backend health: http://localhost:4000/health).

### Local (manual)
```bash
npm install          # at repo root (installs workspaces)
npm run dev          # runs backend + frontend
# API: http://localhost:4000/api
# Frontend: http://localhost:5173
```
Make sure MySQL is running and .env points to your DB.

---

## Project structure
```
backend/
  src/
    index.js              # App wiring, middleware, routes
    db.js                 # MySQL pool
    database/
      queries.js          # Product queries (avg_rating/review_count)
      reviews.js          # Reviews helpers (verified_purchase, moderation)
    routes/
      products.js         # Product CRUD + pagination
      categories.js       # Category list
      reviews.js          # Fetch/store/get reviews, aggregate
      analytics.js        # /api/analytics/overview
      admin.js            # Review moderation
    services/
      scraperService.js   # Legacy scraper fetch + NEW Walmart ScraperAPI fetch
frontend/
  src/
    App.jsx               # Routing, layout, theme toggle
    components/
      ProductList.jsx     # List, search, filter, avg stars
      ProductDetail.jsx   # Reviews, filters, charts, fetch buttons
      AnalyticsDashboard.jsx
      AdminPanel.jsx
      reviews/ReviewFetcher.jsx
scraper-service/          # Mock scraper
docker-compose.yml
```

---

## API endpoints

**Products**
- GET `/api/products` (page, per_page, category_id)
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

**Categories**
- GET `/api/categories`

**Reviews**
- POST `/api/products/:id/fetch` (legacy scraper fetch & store)
- **POST `/api/products/:id/fetch-walmart` (new ScraperAPI Walmart fetch)**
- GET `/api/products/:id/reviews`
- GET `/api/products/:id/aggregate`

**Analytics**
- GET `/api/analytics/overview`

**Admin (moderation)**
- GET `/api/admin/reviews` (status, flagged, productId, limit/offset)
- PATCH `/api/admin/reviews/:id` (flagged, moderationStatus)
- DELETE `/api/admin/reviews/:id`

**Health**
- GET `/health`

---

## Frontend highlights
- Product list: search, category filter, pagination, avg rating/review count when available.
- Product detail: filters (source, rating, verified-only), search, sort, pagination; summary; charts (timeline, source mix, histogram).
- Review fetch controls: existing “Fetch Reviews” button (legacy scraper) plus **“Fetch Reviews from API”** to hit ScraperAPI Walmart endpoint.
- Admin panel: product CRUD, review moderation (flag/approve/reject/delete).
- Theming: Light/Dark toggle persisted in localStorage.

---

## Configuration (.env)

Backend (`backend/.env`):
```
PORT=4000
DB_HOST=localhost
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
FRONTEND_ORIGIN=http://localhost:5173
# Scraper/Walmart structured API
SCRAPERAPI_KEY=...
SCRAPERAPI_WALMART_IDS=...
SCRAPER_SERVICE_HOST=localhost # for mock scarper service
SCRAPER_SERVICE_PORT=3001
```

Frontend (`frontend/.env`):
```
VITE_API_BASE=http://localhost:4000/api
```

---

## Dev commands (root)
```bash
npm run dev          # start backend + frontend
npm run dev:backend  # backend only
npm run dev:frontend # frontend only
npm run lint         # lint workspaces
npm run build        # build frontend
```

---

## Troubleshooting
- Empty products/categories: ensure MySQL is up and VITE_API_BASE ends with `/api`.
- Cannot fetch reviews: check backend logs; set valid `SCRAPERAPI_KEY`; ensure network access to ScraperAPI; DB UNIQUE constraint may count duplicates.
- Vite not reachable from host in container: run `npm run dev -- --host 0.0.0.0`.
- Port conflicts: adjust `docker-compose.yml` or stop services on 5173/4000/3306.

---

## Tech stack

| Layer    | Technology      | Version          |
| -------- | --------------- | ---------------- |
| Frontend | React           | 19.x             |
| Frontend | Vite            | 7.x              |
| Frontend | React Router    | 7.x              |
| Frontend | Recharts        | 3.x              |
| Backend  | Node.js         | 22.x             |
| Backend  | Express         | 5.x              |
| DB       | MySQL           | 8.0              |

---

## License

MIT (educational use encouraged).
