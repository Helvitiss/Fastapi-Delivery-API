# FastAPI Delivery API

Production-oriented backend for a food delivery service.

## TL;DR

Production-ready backend for a food delivery service built with FastAPI and Async SQLAlchemy.
Implements OTP authentication, JWT-based authorization, cart logic, order management, and role-based access (user/admin).
Designed with layered architecture, covered by unit and integration tests, and ready for Docker-based deployment.

## Project Overview

This repository was originally designed as part of a monorepo (backend + frontend).
At this stage, the backend API is the core deliverable and already implements the main food-delivery domain flows:

- authentication and authorization;
- menu/catalog access;
- cart operations;
- address management;
- order placement and tracking;
- admin operations for menu and order management.

Frontend development is planned as the next stage, and the repository structure already supports that roadmap.

## Key Technical Highlights

- Async FastAPI + SQLAlchemy 2.0 stack with clear separation of concerns.
- Layered architecture: routers → services → repositories → models.
- Transactional business flows around cart and order operations.
- Role-based access control with explicit user/admin separation.
- OTP flow with expiration handling and JWT token lifecycle.
- CLI utility for operational tasks (admin bootstrap/promote).
- Structured test suite (unit + integration) for business and API behavior.

## API Capabilities

### User Domain
- `auth`: OTP authentication and JWT token issuance.
- `categories` / `dishes`: menu browsing.
- `cart`: add/update/remove items and calculate totals.
- `addresses`: manage delivery addresses.
- `orders`: create and view user orders.

### Admin Domain
- category management;
- dish management;
- order management;
- admin role provisioning via CLI.

## Architecture

The project follows a layered architecture:

- **API (routers)**: HTTP contracts and request/response validation.
- **Services**: business logic and use-case orchestration.
- **Repositories**: data access abstractions.
- **Models/Schemas**: DB models and DTOs.
- **Core**: settings, exception handling, infrastructure glue.

This design improves maintainability, testability, and long-term extensibility.

## Security Considerations

- JWT-based authentication for stateless API access.
- Short-lived OTP codes with expiration control.
- Role-based access control for privileged operations.
- Environment-based configuration for sensitive settings.
- Separation of admin and public API endpoints.

## Scalability Considerations

- Async I/O at the framework and DB access levels.
- Stateless JWT model suitable for horizontal scaling.
- Layered codebase that supports safe feature growth.
- Docker-first runtime for reproducible deployment environments.
- Clear domain boundaries to simplify future service decomposition.

## Technology Stack

- Python 3.12
- FastAPI
- SQLAlchemy 2.0 (Async)
- PostgreSQL
- Alembic
- JWT + OTP
- Pytest / pytest-asyncio / pytest-cov
- Docker / Docker Compose

## Repository Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── dependencies/
│   │   ├── core/
│   │   └── cli/
│   ├── alembic/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pytest.ini
├── docker-compose.yml
└── README.md
```

## Quick Start

### Option 1: Docker (recommended)

1. Create `backend/.env`.
2. Fill required environment variables (see example below).
3. Run:

```bash
docker compose up -d --build
```

API docs after startup:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Option 2: Local backend run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables (`backend/.env`)

```env
SECRET_KEY=your_secret_key
DB_URL=postgresql+asyncpg://fastapidelivery_user:fastapidelivery@db:5432/fastapidelivery_db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OTP_EXPIRE_MINUTES=5
```

For local non-Docker runs, replace `db` in `DB_URL` with `localhost` (or your actual DB host).

## CLI: Create/Promote Admin

After API container startup:

```bash
docker exec -it fastapidelivery_api python -m app.cli.create_admin +79990001122 --name "Super Admin"
```

## Testing Strategy

The project uses both unit and integration layers:

- **Unit tests (`backend/tests/unit`)**:
  - test service-layer business logic in isolation;
  - use `AsyncMock`/mock repositories and mocked async DB session;
  - validate domain behavior such as cart totals and order flow decisions.
- **Integration tests (`backend/tests/integration`)**:
  - run API-level checks through FastAPI app with `httpx.AsyncClient` + `ASGITransport`;
  - override dependencies for authenticated users/services where required;
  - verify endpoint contracts, statuses, and response payloads.
- **Shared fixtures (`backend/tests/conftest.py`)**:
  - reusable async client and event loop setup.

Run tests from `backend/`:

```bash
pytest -v
```

Coverage report:

```bash
pytest -v --cov=app --cov-report=term-missing
```

## Roadmap

- Deliver frontend application within the planned monorepo structure.
- Add CI pipeline (linters, tests, coverage reports).
- Extend domain logic (promo codes, richer delivery statuses, notifications).
- Harden production setup with observability (structured logs, metrics, healthchecks).

## License

MIT
