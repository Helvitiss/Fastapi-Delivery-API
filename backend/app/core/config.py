import logging
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"


BASE_DIR = Path(__file__).resolve().parent.parent.parent
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media"

DISHES_FOLDER = MEDIA_ROOT / "dishes"


class Settings(BaseSettings):
    SECRET_KEY: str
    DB_URL: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    OTP_EXPIRE_MINUTES: int = 5

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
    )


logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)


settings = Settings()

if __name__ == "__main__":
    print(settings.DB_URL)
