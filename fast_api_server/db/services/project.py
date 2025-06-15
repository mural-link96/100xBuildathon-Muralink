from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from fast_api_server.db.models.project import Project
from fast_api_server.db.mongodb import get_database

class ProjectCRUD:
    def __init__(self):
        self.collection_name = "projects"

    def _get_collection(self):
        db = get_database()
        return db[self.collection_name]

    def _project_helper(self, project: dict) -> dict:
        if not project:
            return None
        return {
            "project_id": str(project["_id"]),
            "user_id": str(project["user_id"]),
            "project_name": project["project_name"],
            "description": project.get("description"),
            "uploaded_images": project.get("uploaded_images", []),
            "generated_images": project.get("generated_images", []),
            "created_at": project["created_at"],
        }

    async def create_project(self, project_data: Project) -> dict:
        collection = self._get_collection()
        project_dict = project_data.dict(by_alias=True)
        project_dict["created_at"] = datetime.utcnow()
        result = await collection.insert_one(project_dict)
        new_project = await collection.find_one({"_id": result.inserted_id})
        return self._project_helper(new_project)

    async def get_project_by_id(self, project_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(project_id):
            return None
        collection = self._get_collection()
        project = await collection.find_one({"_id": ObjectId(project_id)})
        return self._project_helper(project)

    async def get_projects_by_user_id(self, user_id: str) -> List[dict]:
        if not ObjectId.is_valid(user_id):
            return []
        collection = self._get_collection()
        projects = []
        cursor = collection.find({"user_id": ObjectId(user_id)})
        async for project in cursor:
            projects.append(self._project_helper(project))
        return projects

project_crud = ProjectCRUD() 