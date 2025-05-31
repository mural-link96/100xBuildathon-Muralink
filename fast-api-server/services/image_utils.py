from typing import List, Optional
import numpy as np
from io import BytesIO
import base64
from PIL import Image


async def reference_resize_base64(image_base64):
    """
    Resize a base64 encoded image to 512x512 resolution using outer fit method.
    
    Args:
        image_base64: Base64 encoded string of the image
        
    Returns:
        Base64 encoded string of the resized image
    """
    # Decode base64 to binary data
    if image_base64.startswith('data:image'):
        # Remove data URL prefix if present
        image_base64 = image_base64.split(',', 1)[1]
    
    image_data = base64.b64decode(image_base64)
    
    # Convert binary data to PIL Image
    image_pil = Image.open(BytesIO(image_data))
    
    # Get original dimensions
    original_width, original_height = image_pil.size
    
    # Set fixed target dimensions to 512x512
    target_width, target_height = 512, 512
    
    # Calculate the scaling factor to maintain aspect ratio
    scale = min(target_width / original_width, target_height / original_height)
    new_width = int(original_width * scale)
    new_height = int(original_height * scale)
    
    # Resize the image while preserving aspect ratio
    # Using LANCZOS for better quality
    resized_image = image_pil.resize((new_width, new_height), Image.LANCZOS)
    
    # Create a new image with the target dimensions
    # Sample the border pixels to determine background color
    img_array = np.array(image_pil)
    border_color = None
    
    if len(img_array.shape) == 3:  # RGB or RGBA
        # Calculate border color from edges
        edges = []
        
        # Top and bottom rows
        if img_array.shape[0] > 0:
            edges.append(img_array[0])
            edges.append(img_array[-1])
        
        # Left and right columns
        if img_array.shape[1] > 0 and img_array.shape[0] > 2:
            edges.append(img_array[1:-1, 0])
            edges.append(img_array[1:-1, -1])
        
        if edges:
            # Flatten the edges and calculate median color
            edges_flat = np.vstack(edges)
            border_color = tuple(map(int, np.median(edges_flat, axis=0)))
    
    # Default to light gray if calculation fails
    if not border_color:
        if image_pil.mode == 'RGBA':
            border_color = (240, 240, 240, 255)  # Light gray with full opacity
        else:
            border_color = (240, 240, 240)  # Light gray
    
    # Create the final image with background color
    final_image = Image.new(image_pil.mode, (target_width, target_height), border_color)
    
    # Calculate position to paste the resized image (centered)
    paste_x = (target_width - new_width) // 2
    paste_y = (target_height - new_height) // 2
    
    # Paste the resized image onto the background
    if image_pil.mode == 'RGBA':
        final_image.paste(resized_image, (paste_x, paste_y), resized_image)
    else:
        final_image.paste(resized_image, (paste_x, paste_y))
    
    # Convert the resized image back to base64
    buffered = BytesIO()
    # Preserve original format if possible, otherwise default to PNG
    format = image_pil.format if image_pil.format else 'PNG'
    final_image.save(buffered, format=format)
    img_str = base64.b64encode(buffered.getvalue())
    
    # Return as base64 string
    return img_str.decode('utf-8')


async def resize_all_images(reference_images: Optional[List[str]] = None) -> List[str]:
    if not reference_images:
        return []

    resized_images = []
    for image in reference_images:
        print(f"Processing input images....")
        resized_image = await reference_resize_base64(image)
        resized_images.append(resized_image)
    print(f"Image processing successful....")
    return resized_images