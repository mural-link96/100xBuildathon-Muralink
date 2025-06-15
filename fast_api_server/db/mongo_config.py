# db/mongo_config.py
import os
from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):

    MONGODB_URL: str = os.getenv("MONGODB_URI")
    MONGO_DATABASE_NAME: str = os.getenv("DB_NAME")


    # Your missing expected fields
    openai_api_key: str
    mongodb_uri: str
    db_name: str


    class Config:
        env_file= ".env",
        case_sensitive= False
        extra="allow"

settings = Settings()



