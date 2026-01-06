# Property Listing Portal – Backend (FastAPI)

FastAPI + SQLAlchemy + PostgreSQL backend with JWT auth, RBAC (admin/staff), clean architecture layout, and Alembic migrations.

## Stack
- Python 3.12, FastAPI, Uvicorn
- SQLAlchemy ORM, Alembic migrations
- PostgreSQL
- Auth: JWT (HS256), bcrypt via passlib

## Project layout (backend/)
```
backend/
  app/
    main.py              # FastAPI app
    core/                # config, security, deps, exceptions
    db/                  # engine/session, Base
    models/              # SQLAlchemy models
    schemas/             # Pydantic schemas
    api/
      routes.py          # aggregates routers
      v1/                # versioned endpoints (auth, properties, portfolio, inquiries)
    services/, repositories/ (place for business logic, data access)
  migrations/            # Alembic env + versions
  alembic.ini            # Alembic config
```

## Setup
```bash
cd property-listing-portal
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env` (optional, overrides defaults in `core/config.py`):
```
SECRET_KEY=change_me
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=property_portal
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Database
Ensure PostgreSQL is running and create the database:
```bash
createdb property_portal
```

Run migrations:
```bash
cd backend
alembic upgrade head
```

## Run the API
```bash
cd property-listing-portal
source venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```
Server: http://127.0.0.1:8000  
API base: `http://127.0.0.1:8000/api/v1`

## Seed an admin/staff user
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/users \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","phone":"1234567890","user_type":"admin","password":"AdminPass123!"}'
```

## Auth & RBAC
- JWT bearer tokens (HS256), 24h expiry by default.
- Roles: `admin`, `staff`.
- Only admin/staff can mutate resources; public can browse and submit inquiries.

Login to obtain a token:
```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=AdminPass123!" | jq -r .access_token)
echo "$TOKEN"
```
Pass the token:
```
Authorization: Bearer $TOKEN
```

## Key APIs (v1)

### Properties (`/properties`)
- `GET /properties` — public list, supports `page`, `page_size`, `type`, `location`, `status`, `min_price`, `max_price`.
- `GET /properties/{id}` — public detail.
- `POST /properties` — admin/staff, create (with images).
- `PUT /properties/{id}` — admin/staff, update (replace images if provided).
- `DELETE /properties/{id}` — admin/staff.

Example create:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/properties \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"property_name":"Lakeview Apt","type":"Apartment","price":250000,"location":"Seattle","status":"Available","images":[{"url":"https://pics/1.jpg"}]}'
```

### Portfolio & Services (`/portfolio`)
- `GET /portfolio/projects` — public, paginated.
- `POST/PUT/DELETE /portfolio/projects/{id}` — admin/staff.
- `GET /portfolio/services` — public list of all service projects.
- `POST/PUT/DELETE /portfolio/services/{id}` — admin/staff (images supported).

List services:
```bash
curl http://127.0.0.1:8000/api/v1/portfolio/services
```

### Inquiries (`/inquiries`)
- `POST /inquiries` — public submit (optionally includes `property_id`).
- `GET /inquiries` — admin/staff, paginated.

Submit inquiry:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/inquiries \
  -H "Content-Type: application/json" \
  -d '{"property_id":1,"name":"Jane Buyer","phone":"555-1212","inquiry_text":"Interested in a tour"}'
```

## Clean architecture notes
- `api/` holds routers only.
- `schemas/` define request/response DTOs.
- `models/` hold persistence models.
- `core/` holds cross-cutting concerns (config, security, deps, exceptions).
- `services/` and `repositories/` folders are for business logic/data layers.

## Testing 
1) Seed admin (above).
2) Login → get JWT.
3) Create property (POST /properties).
4) List properties (GET /properties).
5) Submit inquiry (POST /inquiries).
6) List inquiries as admin (GET /inquiries with token).
