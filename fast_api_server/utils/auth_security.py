# app/core/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, List
from jose import JWTError, jwt 
from passlib.context import CryptContext
from fast_api_server.config import AppSettings
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fast_api_server.db.services.user import user_crud

# For password hashing if you add traditional auth later
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app_settings = AppSettings()

bearer_scheme = HTTPBearer()

def create_access_token(user_id: str, email: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=app_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(user_id), "email": email, "role": role}
    encoded_jwt = jwt.encode(to_encode, app_settings.JWT_SECRET_KEY, algorithm=app_settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(user_id: str, email: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=30)  # 30 days expiry for refresh token
    to_encode = {"exp": expire, "sub": str(user_id), "email": email, "role": role}
    encoded_jwt = jwt.encode(to_encode, app_settings.JWT_SECRET_KEY, algorithm=app_settings.ALGORITHM)
    return encoded_jwt

async def verify_google_id_token(google_token: str) -> Optional[dict]:
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(google_token, google_requests.Request(), app_settings.GOOGLE_CLIENT_ID)
        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, ...]:
        #    raise ValueError('Could not verify audience.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # userid = idinfo['sub'] # This is Google's unique ID for the user
        return idinfo
    except ValueError as e:
        # Invalid token
        print(e)
        print(f"Google ID token verification failed: {e}")
        return None

def get_current_user_id(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, app_settings.JWT_SECRET_KEY, algorithms=[app_settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

    # Add any "is_active" check if you have such a field in your user model
    # if not current_user.is_active:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def authenticate_user_with_credit_factory(required_credit: int):
    async def dependency(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
        user_id = get_current_user_id(token)
        user = await user_crud.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        current_credit = int(user.get("credit", 0))
        if current_credit < required_credit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient credit. You need "+ str(required_credit - current_credit) +" more credits to proceed.")
        return user_id
    return dependency