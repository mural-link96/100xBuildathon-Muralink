# app/routers/google_autj.py
from fast_api_server.models.google_auth_request import GoogleToken
from fast_api_server.services.google_auth_service import google_login
from fastapi import APIRouter, Body
from fast_api_server.config import AppSettings
from pydantic import BaseModel
from datetime import timedelta


router = APIRouter(
    prefix="/api/v1/auth", 
    tags=["Auth API"],
    responses={404: {"description": "Not found"}},
)

app_settings = AppSettings()

class GoogleLoginRequest(BaseModel):
    token: str # This is the Google ID Token
    role: str # Role to assign if user is new

@router.post("/google", response_model=GoogleToken)
async def login_with_google(request_body: GoogleLoginRequest = Body(...)):
    return await google_login(request_body.token, request_body.role)

