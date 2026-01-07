import subprocess
import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.routes import api_router


settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration - allow frontend origin from environment or default to all
allowed_origins = [settings.FRONTEND_URL] if settings.FRONTEND_URL else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Basic centralized error handler (can be expanded with logging, Sentry, etc.)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


app.include_router(api_router, prefix=settings.API_V1_STR)


def run_migrations_if_enabled():
    """
    Run Alembic migrations once on startup if enabled.
    Safe to run repeatedly; Alembic is idempotent.
    """
    if not settings.RUN_MIGRATIONS_ON_STARTUP:
        return

    project_root = Path(__file__).resolve().parent.parent  # backend/
    alembic_ini = project_root / "alembic.ini"

    try:
        subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            cwd=project_root,
            env={**os.environ},
        )
    except Exception:
        # Avoid breaking startup if migrations fail; prefer to surface later in logs
        pass


@app.on_event("startup")
async def startup_event():
    # Run migrations before handling traffic
    run_migrations_if_enabled()
