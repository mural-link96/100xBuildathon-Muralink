# app/models/token_model.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class GoogleToken(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class GoogleTokenPayload(BaseModel):
    sub: Optional[str] = None # User ID (from MongoDB _id)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    exp: Optional[int] = None # Expiry timestamp

