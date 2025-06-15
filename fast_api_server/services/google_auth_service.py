from fast_api_server.db.schemas.user import UserCreate
from fast_api_server.services.user_service import UserService
from fast_api_server.utils.auth_security import create_access_token, create_refresh_token, verify_google_id_token
from fastapi import HTTPException, status
from datetime import timedelta
from fast_api_server.config import app_settings


user_service = UserService()

async def google_login(token: str, role: str):
    google_user_info = await verify_google_id_token(token)
    if not google_user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token",
        )

    email = google_user_info.get("email")
    google_id = google_user_info.get("sub")
    name = google_user_info.get("name")

    if not email or not google_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or Google ID missing from token",
        )

    user = await user_service.user_crud.get_user_by_email(email)
    if user:
        role_to_use = user.get("role", "user")
    else:
        user_create = UserCreate(
            name="",  # Empty name
            bio=None,
            email=email,
            phone=None,
            interested_in=[],
            credit=app_settings.DEFAULT_CREDIT,
            role=role
        )
        try:
            result = await user_service.create_user_with_default_project(user_create)
            user = result["user"]
            role_to_use = user["role"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create user and default project: {str(e)}")

    access_token_expires = timedelta(minutes=app_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    fastapi_jwt = create_access_token(
        user_id=user["user_id"],
        email=user["email"],
        role=role_to_use,
        expires_delta=access_token_expires,
    )

    refresh_token = create_refresh_token(
        user_id=user["user_id"],
        email=user["email"],
        role=role_to_use
    )

    return {
        "access_token": fastapi_jwt,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    } 