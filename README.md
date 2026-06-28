# Wedding Digital Invitation

Full-stack wedding digital invitation platform — Docker Compose setup.

## Services

| Service  | Port | Description              |
|----------|------|--------------------------|
| Nginx    | 80   | Reverse proxy            |
| Frontend | 3000 | Next.js 14 app           |
| Backend  | 4000 | Node.js / Express API    |
| Postgres | 5432 | PostgreSQL 16 database   |
| Redis    | 6379 | Cache / sessions         |

## Quick Start

> **New instance?** See the full [**Deployment Guide**](DEPLOYMENT.md) — covers prerequisites, step-by-step setup, environment variables, migrations, backups, and troubleshooting.

```bash
# 1. Clone and enter the project
cd wedding-invitation

# 2. Copy and configure env
cp .env.example .env
# Edit .env — set JWT_SECRET and DB passwords

# 3. Build and start all services
docker compose up --build -d

# 4. Check all services are healthy
docker compose ps

# 5. Open in browser
open http://localhost:8081
```

## Useful Commands

```bash
# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (wipes DB)
docker compose down -v

# Rebuild a single service
docker compose up --build backend -d

# Access PostgreSQL
docker compose exec postgres psql -U wedding -d wedding

# Access Redis CLI
docker compose exec redis redis-cli
```

## Project Structure

```
wedding-invitation/
├── frontend/              # Next.js 14 + Tailwind CSS
│   ├── src/app/           # Pages (invitation, dashboard, auth)
│   ├── src/components/    # 18 invitation components + studio
│   ├── src/themes/        # Theme configurations
│   ├── public/            # Static assets (ornaments, images)
│   └── Dockerfile         # Multi-stage: install → build → standalone
├── backend/               # Node.js + Express API
│   ├── src/routes/        # 8 API route modules
│   ├── migrations/        # SQL schema (auto-run on startup)
│   └── Dockerfile         # Single-stage: install → copy src
├── nginx/                 # Nginx reverse proxy config
├── docker-compose.yml     # 5-service orchestration
├── .env.example           # Environment template (safe to commit)
├── .gitignore
├── DEPLOYMENT.md          # Full deployment guide
└── README.md
```

## URL Structure

- `http://localhost` — Landing page
- `http://localhost/[couple-slug]` — Invitation page
- `http://localhost/[couple-slug]?to=GuestName` — Personalized invite
- `http://localhost/dashboard` — Couple admin studio
- `http://localhost/api/health` — API health check
