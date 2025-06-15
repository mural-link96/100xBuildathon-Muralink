import datetime
from typing import List, Optional
from bson import ObjectId
from pydantic import BaseModel, Field
from fast_api_server.db.mongodb import PyObjectId

class ImageInfo(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = None
    b64: str
    time: datetime.datetime

class Project(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    project_name: str
    description: Optional[str] = None
    uploaded_images: List[ImageInfo] = Field(default_factory=list)
    generated_images: List[ImageInfo] = Field(default_factory=list)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "project_name": "Default Project",
                "description": "A default project for new users.",
                "uploaded_images": [],
                "generated_images": [],
                "created_at": "2023-01-01T00:00:00Z"
            }
        } 