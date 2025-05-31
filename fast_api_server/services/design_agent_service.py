from services.image_utils import resize_all_images
from utils.openai_client import client
from utils.logger import logger
from utils.prompt import DESIGN_AGENT_SYS_PROMPT

async def design_assistant(context, user_prompt, user_image=None, reference_images=None):
    # Resize images before processing
    resized_user_image = None
    resized_reference_images = []
    
    # Resize user image if provided
    if user_image:
        resized_user_images = await resize_all_images([user_image])
        resized_user_image = resized_user_images[0] if resized_user_images else None
    
    # Resize reference images if provided
    if reference_images:
        resized_reference_images = await resize_all_images(reference_images)
    
    # Build the content for the new message
    message_content = []
    
    # Add text content
    if user_prompt:
        message_content.append({
            "type": "input_text",
            "text": user_prompt
        })
    
    # Add resized user image if provided
    if resized_user_image:
        message_content.append({
            "type": "input_image",
            "image_url": f"data:image/jpeg;base64,{resized_user_image}"
        })
    
    # Add resized reference images if provided
    if resized_reference_images:
        for ref_image in resized_reference_images:
            message_content.append({
                "type": "input_image",
                "image_url": f"data:image/jpeg;base64,{ref_image}"
            })
    
    # Build the complete message array
    message = [{
            "role": "system",
            "content": DESIGN_AGENT_SYS_PROMPT
        }
    ] + context + [
        {
            "role": "user",
            "content": message_content if len(message_content) > 1 else user_prompt
        }
    ]

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=message
        )

        return [
            {
                "role": "user",
                "content": message_content if len(message_content) > 1 else user_prompt
            },
            {
                "role": response.output[0].role,
                "content": response.output[0].content[0].text
            }
        ]
    
    except Exception as e:
        logger.error(f"Error in design_assistant: {str(e)}")
        raise