from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

from fast_api_server.db.schemas.user import UserCreate, UserUpdate
from fast_api_server.db.mongodb import get_database

class UserCRUD: 
    def __init__(self):
        self.collection_name = "users"
    
    def _get_collection(self):
        db = get_database()
        return db[self.collection_name]
    
    def _user_helper(self, user: dict) -> dict:
        if not user:
            return None
        return {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "bio": user.get("bio"),
            "email": user["email"],
            "phone": user.get("phone"),
            "interested_in": user.get("interested_in", []),
            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
            "credit": int(user.get("credit", 0)),
            "role": user.get("role", "user"),
            "default_project": str(user["default_project"]) if user.get("default_project") else None
        }

    async def create_user(self, user_data: UserCreate) -> dict:
        collection = self._get_collection()
        user_dict = user_data.dict()
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        result = await collection.insert_one(user_dict)
        new_user = await collection.find_one({"_id": result.inserted_id})
        return self._user_helper(new_user)

    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        collection = self._get_collection()
        user = await collection.find_one({"_id": ObjectId(user_id)})
        return self._user_helper(user)

    async def get_user_by_email(self, email: str) -> Optional[dict]:
        collection = self._get_collection()
        user = await collection.find_one({"email": email})
        return self._user_helper(user)

    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[dict]:
        collection = self._get_collection()
        users = []
        cursor = collection.find().skip(skip).limit(limit)
        async for user in cursor:
            users.append(self._user_helper(user))
        return users

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        collection = self._get_collection()
        update_data = {k: v for k, v in user_data.dict().items() if v is not None}
        if not update_data:
            return None
        update_data["updated_at"] = datetime.utcnow()
        existing_user = await collection.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            return None
        await collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        updated_user = await collection.find_one({"_id": ObjectId(user_id)})
        return self._user_helper(updated_user)

    async def delete_user(self, user_id: str) -> bool:
        if not ObjectId.is_valid(user_id):
            return False
        collection = self._get_collection()
        existing_user = await collection.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            return False
        result = await collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def count_users(self) -> int:
        collection = self._get_collection()
        return await collection.count_documents({})

    async def add_credit(self, user_id: str, amount: int) -> Optional[dict]:
        if amount <= 0:
            raise ValueError("Amount to add must be positive.")
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user ID.")
        collection = self._get_collection()
        result = await collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$inc": {"credit": amount}, "$set": {"updated_at": datetime.utcnow()}},
            return_document=True
        )
        if not result:
            raise ValueError("User not found.")
        return self._user_helper(result)

    async def deduct_credit(self, user_id: str, amount: int) -> Optional[dict]:
        if amount <= 0:
            raise ValueError("Amount to deduct must be positive.")
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user ID.")
        collection = self._get_collection()
        # Atomically decrement only if enough credit
        result = await collection.find_one_and_update(
            {"_id": ObjectId(user_id), "credit": {"$gte": amount}},
            {"$inc": {"credit": -amount}, "$set": {"updated_at": datetime.utcnow()}},
            return_document=True
        )
        if not result:
            raise ValueError("User not found or insufficient credit.")
        return self._user_helper(result)

user_crud = UserCRUD() 