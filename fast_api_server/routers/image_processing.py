# -----------------------------------------------------------
# routers/image_processing.py 

from fastapi import APIRouter
from models.design_agent_request import ChatRequest

from services.design_agent_service import design_assistant


router = APIRouter(
    prefix="/api/v1",  # Optional: add a prefix
    tags=["Image Processing"],
    responses={404: {"description": "Not found"}},
)

@router.post("/design-agent")
async def design_agent(req: ChatRequest):
    try:
        response = await design_assistant(req.context, req.user_prompt, req.user_image, req.reference_images)
        return response
    except Exception as e:
        return {"error": str(e)}