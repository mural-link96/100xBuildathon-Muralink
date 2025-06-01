
from typing import List, Literal, Optional, Union
from pydantic import BaseModel

class Message(BaseModel):
    role: Literal["user", "assistant"]  # Exclude 'system' from frontend
    content: Union[str, List[dict]]  # Can be string or multimodal content array

class ChatRequest(BaseModel):
    context: List[Message]
    user_prompt: str
    user_image: Optional[str] = None  # Base64 string or URL

class DesignAgentImageGenerate(BaseModel):
    context: List[Message]
    user_image: str
    product_image_urls: List[str]