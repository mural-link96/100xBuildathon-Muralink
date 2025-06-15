from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class AppSettings(BaseSettings):
    # Application
    app_name: str = "MURALINK FastAPI"
    app_version: str = "1.0.0"
    debug: bool = False

    #Authentication
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 365 # 365 days
    JWT_SECRET_KEY: Optional[str] = os.getenv("JWT_SECRET_KEY")
    ALGORITHM: str = "HS256"
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID")

    # Credits Configuration
    DEFAULT_CREDIT: int = os.getenv("DEFAULT_CREDIT")  # Default credit for new users

    # Environment
    environment: Optional[str] = os.getenv("ENVIRONMENT")

    # Your missing expected fields
    openai_api_key: str
    mongodb_uri: str
    db_name: str

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"  # or "forbid" if you want to enforce strict fields

# Create settings instance
app_settings = AppSettings()
