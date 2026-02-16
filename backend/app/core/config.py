import logging
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"



class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    OPT_EXPIRE_MINUTES: int = 5


    model_config = SettingsConfigDict(
        env_file= BASE_DIR / ".env",
        env_file_encoding="utf-8",
    )


logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT
)



settings = Settings()