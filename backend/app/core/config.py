from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PROJECT_NAME: str = "Property Listing Portal"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "CHANGE_ME_SECRET_KEY"  # override in env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ALGORITHM: str = "HS256"

    # Frontend URL for CORS
    FRONTEND_URL: str = ""

    # Auto-run migrations on startup (set to False to skip)
    RUN_MIGRATIONS_ON_STARTUP: bool = True

    # Database
    # Preferred in production (Render, Fly, etc.): single DATABASE_URL env
    DATABASE_URL: str | None = None

    # Optional granular settings (used only if DATABASE_URL is not set)
    POSTGRES_SERVER: str = "dpg-d5eheua4d50c73c2mqag-a"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "arun"
    POSTGRES_PASSWORD: str = "E9TgRPGBv7O8QVzNHuX2dBfzMZtOnWwH"
    POSTGRES_DB: str = "property_portal_n5t0"


    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        """
        Use DATABASE_URL if provided (e.g. from Render), otherwise build from individual components.
        Expect DATABASE_URL like:
          postgres://USER:PASSWORD@HOST:PORT/DBNAME
        or:
          postgresql://USER:PASSWORD@HOST:PORT/DBNAME
        """
        if self.DATABASE_URL:
            # SQLAlchemy prefers the postgresql+psycopg2 scheme
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+psycopg2://", 1)
            elif url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
            return url

        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
