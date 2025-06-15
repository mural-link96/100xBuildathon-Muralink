from typing import List, Optional, Dict, Any
from fast_api_server.db.models.project import Project
from fast_api_server.db.schemas.user import UserCreate, UserResponse, UserUpdate
from fastapi import HTTPException, status
import logging

from fast_api_server.db.services.user import user_crud
from fast_api_server.db.services.project import project_crud

logger = logging.getLogger(__name__)

class UserService:
    """
    User service layer that handles business logic and coordinates with CRUD operations
    """
    
    def __init__(self):
        self.user_crud = user_crud
    
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        try:
            existing_user = await self.user_crud.get_user_by_email(user_data.email)
            if existing_user:
                logger.warning(f"Attempt to create user with existing email: {user_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this email already exists"
                )
            logger.info(f"Creating new user with email: {user_data.email}")
            new_user = await self.user_crud.create_user(user_data)
            logger.info(f"Successfully created user with ID: {new_user['user_id']}")
            return UserResponse(**new_user)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            if "duplicate key error" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this email already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the user"
            )
    
    async def get_user_by_id(self, user_id: str) -> UserResponse:
        try:
            logger.info(f"Fetching user with ID: {user_id}")
            user = await self.user_crud.get_user_by_id(user_id)
            if not user:
                logger.warning(f"User not found with ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found"
                )
            return UserResponse(**user)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching user {user_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching the user"
            )
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[UserResponse]:
        try:
            logger.info(f"Fetching users with skip={skip}, limit={limit}")
            if skip < 0:
                skip = 0
            if limit > 1000:
                limit = 1000
            if limit <= 0:
                limit = 10
            users = await self.user_crud.get_all_users(skip=skip, limit=limit)
            logger.info(f"Successfully fetched {len(users)} users")
            return [UserResponse(**user) for user in users]
        except Exception as e:
            logger.error(f"Error fetching users: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching users"
            )
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> UserResponse:
        try:
            logger.info(f"Updating user with ID: {user_id}")
            existing_user = await self.user_crud.get_user_by_id(user_id)
            if not existing_user:
                logger.warning(f"Attempt to update non-existent user: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found"
                )
            
            updated_user = await self.user_crud.update_user(user_id, user_data)
            if not updated_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found"
                )
            logger.info(f"Successfully updated user with ID: {user_id}")
            return UserResponse(**updated_user)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating user {user_id}: {str(e)}")
            if "duplicate key error" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this email already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the user"
            )
    
    async def delete_user(self, user_id: str) -> bool:
        try:
            logger.info(f"Deleting user with ID: {user_id}")
            deleted = await self.user_crud.delete_user(user_id)
            if not deleted:
                logger.warning(f"User not found or could not be deleted: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found"
                )
            logger.info(f"Successfully deleted user with ID: {user_id}")
            return True
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting user {user_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the user"
            )
    
    async def create_user_with_default_project(self, user_data: UserCreate) -> dict:
        # Step 1: Create user with default_project=None
        user_data.default_project = None
        user = await self.user_crud.create_user(user_data)
        user_id = user["user_id"]
        try:
            # Step 2: Create default project
            project = Project(
                user_id=user_id,
                project_name="Default Project",
                description="",
                uploaded_images=[],
                generated_images=[]
            )
            new_project = await project_crud.create_project(project)
            project_id = new_project["project_id"]
            # Step 3: Update user with default_project
            await self.user_crud.update_user(user_id, UserUpdate(default_project=project_id))
            # Step 4: Return user and project
            user = await self.user_crud.get_user_by_id(user_id)
            return {"user": user, "project": new_project}
        except Exception as e:
            # Rollback: delete user if project creation fails
            await self.user_crud.delete_user(user_id)
            raise HTTPException(status_code=500, detail=f"Failed to create user and default project: {str(e)}") 