# -----------------------------------------------------------
# routers/image_processing.py 

from fastapi import APIRouter
from fast_api_server.models.design_agent_request import ChatRequest, DesignAgentImageGenerate

from fast_api_server.services.design_agent_service import design_assistant, design_assistant_image_generation


router = APIRouter(
    prefix="/api/v1",  # Optional: add a prefix
    tags=["Image Processing"],
    responses={404: {"description": "Not found"}},
)

@router.post("/design-agent")
async def design_agent(req: ChatRequest):
    try:
        response = await design_assistant(req.context, req.user_prompt, req.user_image)
        return response
    except Exception as e:
        return {"error": str(e)}
    

@router.post("/design-agent/generate-image")
async def design_agent_image_gen(req: DesignAgentImageGenerate):
    try:
        response = await design_assistant_image_generation(req.context, req.user_image, req.product_image_urls)
        return response
    except Exception as e:
        return {"error": str(e)}