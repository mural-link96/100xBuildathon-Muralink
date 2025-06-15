from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: Optional[str] = Field(None, max_length=100, description="User's Name")
    bio: Optional[str] = Field(None, max_length=500, description="User's bio")
    email: EmailStr = Field(..., description="User's email address")
    phone: Optional[str] = Field(None, min_length=0, max_length=20, description="User's phone number")
    interested_in: Optional[List[str]] = Field(default_factory=list, description="User's interests")
    credit: int = Field(0, description="User's credit balance")
    role: str = Field("user", description="Role of the user, e.g., 'user', 'admin', etc.")
    default_project: Optional[str] = Field(None, description="Default project ID for the user")

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="User's full name")
    bio: Optional[str] = Field(None, max_length=500, description="User's bio")
    phone: Optional[str] = Field(None, min_length=0, max_length=20, description="User's phone number")
    interested_in: Optional[List[str]] = Field(None, description="User's interests")
    default_project: Optional[str] = Field(None, description="Default project ID for the user")

class UserResponse(UserBase):
    user_id: str = Field(..., description="User's unique identifier")
    created_at: datetime = Field(..., description="User creation timestamp")
    updated_at: datetime = Field(..., description="User last update timestamp")
    credit: int = Field(..., description="User's credit balance")
    default_project: Optional[str] = Field(None, description="Default project ID for the user")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "name": "Jane Doe",
                "bio": "A passionate developer.",
                "email": "jane@example.com",
                "phone": "+1234567890",
                "interested_in": ["AI", "Art"],
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z",
                "credit": 0,
                "role": "user",
                "default_project": "project123"
            }
        }

class UserInDB(UserBase):
    created_at: datetime
    updated_at: datetime
    credit: int
    role: str
    default_project: Optional[str] = Field(None, description="Default project ID for the user") 