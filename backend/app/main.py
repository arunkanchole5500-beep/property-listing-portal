import logging
import os
import subprocess
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.routes import api_router


settings = get_settings()
logger = logging.getLogger("uvicorn.error")

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
    logger.exception("Unhandled exception in request", exc_info=exc)
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
        logger.info("RUN_MIGRATIONS_ON_STARTUP is False; skipping migrations.")
        return

    project_root = Path(__file__).resolve().parent.parent  # backend/
    alembic_ini = project_root / "alembic.ini"

    if not alembic_ini.exists():
        logger.warning("alembic.ini not found at %s; skipping migrations.", alembic_ini)
        return

    logger.info("Running Alembic migrations from %s", project_root)
    try:
        subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            cwd=project_root,
            env={**os.environ},
        )
        logger.info("Alembic migrations completed successfully.")
    except Exception as exc:  # pragma: no cover - log-only path
        logger.exception("Alembic migrations failed", exc_info=exc)


@app.on_event("startup")
async def startup_event():
    # Run migrations before handling traffic
    run_migrations_if_enabled()
