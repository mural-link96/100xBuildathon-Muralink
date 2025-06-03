import base64
import os
import asyncio
from typing import Dict, List
import requests
from serpapi import GoogleSearch
from fast_api_server.services.image_utils import resize_all_images
from fast_api_server.services.text_utils import parse_product_list
from fast_api_server.utils.openai_client import client
from fast_api_server.utils.logger import logger
from fast_api_server.utils.prompt import DESIGN_AGENT_SYS_PROMPT, DESIGN_AGENT_IMG_SYS_PROMPT

async def search_product_on_google_shopping(product_name, properties=None):
    """
    Search for a product on Google Shopping using SerpAPI
    
    Args:
        product_name (str): The name of the product to search
        properties (list): List of product properties to enhance search
        
    Returns:
        dict: Search results from Google Shopping or None if error
    """
    try:
        # Build search query - combine product name with key properties
        search_query = product_name
        if properties:
            # Add relevant properties to search query (limit to avoid too long queries)
            relevant_props = []
            for prop in properties[:2]:  # Take first 2 properties
                if any(keyword in prop.lower() for keyword in ['color', 'material', 'style', 'size']):
                    relevant_props.append(prop)
            if relevant_props:
                search_query += " " + " ".join(relevant_props)
        
        # Configure SerpAPI search
        params = {
            "engine": "google_shopping",
            "q": search_query,
            "api_key": os.getenv("SERP_API_KEY"),  # Make sure to set this in your environment
            "num": 5,  # Limit to top 5 results
            "hl": "en",
            "gl": "us"
        }
        
        search = GoogleSearch(params)
        results = search.get_dict()
        
        # Extract shopping results
        shopping_results = results.get("shopping_results", [])
        
        # Format the results for easier consumption
        formatted_results = []
        for item in shopping_results:
            formatted_item = {
                "title": item.get("title", ""),
                "price": item.get("price", ""),
                "source": item.get("source", ""),
                "link": item.get("product_link", ""),
                "thumbnail": item.get("thumbnail", ""),
                "rating": item.get("rating", 0),
                "reviews": item.get("reviews", 0),
                "delivery": item.get("delivery", "")
            }
            formatted_results.append(formatted_item)
        
        return {
            "search_query": search_query,
            "results_count": len(formatted_results),
            "shopping_results": formatted_results
        }
        
    except Exception as e:
        logger.error(f"Error searching for product '{product_name}': {str(e)}")
        return {
            "search_query": search_query if 'search_query' in locals() else product_name,
            "results_count": 0,
            "shopping_results": [],
            "error": str(e)
        }

async def search_all_products(product_list):
    """
    Search for all products in the list concurrently
    
    Args:
        product_list (list): List of product dictionaries
        
    Returns:
        list: Enhanced product list with search results
    """
    if not product_list:
        return []
    
    # Create tasks for concurrent searching
    search_tasks = []
    for product in product_list:
        task = search_product_on_google_shopping(
            product["name"], 
            product.get("properties", [])
        )
        search_tasks.append(task)
    
    # Execute all searches concurrently
    search_results = await asyncio.gather(*search_tasks, return_exceptions=True)
    
    # Combine products with their search results
    enhanced_products = []
    for i, product in enumerate(product_list):
        enhanced_product = {
            "id": i + 1,
            "name": product["name"],
            "properties": product.get("properties", []),
            "shopping_search": search_results[i] if i < len(search_results) and not isinstance(search_results[i], Exception) else {
                "search_query": product["name"],
                "results_count": 0,
                "shopping_results": [],
                "error": "Search failed"
            }
        }
        enhanced_products.append(enhanced_product)
    
    return enhanced_products

async def design_assistant(context, user_prompt, user_image=None):
    # Resize images before processing
    resized_user_image = None
    resized_reference_images = []
    
    # Resize user image if provided
    if user_image:
        resized_user_images = await resize_all_images([user_image])
        resized_user_image = resized_user_images[0] if resized_user_images else None
    
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

        # Parse product list from response
        product_list = parse_product_list(response.output[0].content[0].text)
        
        # Search for products if list is not empty
        enhanced_product_list = []
        if product_list:
            logger.info(f"Found {len(product_list)} products, starting Google Shopping search...")
            enhanced_product_list = await search_all_products(product_list)
            logger.info(f"Completed product searches for {len(enhanced_product_list)} products")
        
        # Return the response with enhanced product information
        return {
            "conversation": [
                {
                    "role": response.output[0].role,
                    "content": response.output[0].content[0].text
                }
            ],
            "products": enhanced_product_list,
            "products_found": len(enhanced_product_list) > 0
        }
    
    except Exception as e:
        logger.error(f"Error in design_assistant: {str(e)}")
        raise

# Sync function to fetch and convert image to base64
def sync_image_to_base64(url: str) -> str:
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch image from {url}")

    content_type = response.headers.get("Content-Type", "image/jpeg")
    encoded = base64.b64encode(response.content).decode("utf-8")
    return f"data:{content_type};base64,{encoded}"

# Async wrapper around the sync function
async def image_to_base64(url: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, sync_image_to_base64, url)

# Your main function that handles image conversion and resizing
async def design_assistant_image_generation(context, user_image: str, product_image_urls: List[str]) -> str:
    # Convert product image URLs to base64
    product_images_base64 = await asyncio.gather(*[image_to_base64(url) for url in product_image_urls])

    # Combine all images
    all_images = [user_image] + product_images_base64

    # Resize all images
    resized_images = await resize_all_images(all_images)

    # Construct user content with input_image format
    user_content = [
        {
            "type": "input_image",
            "image_url": f"data:image/png;base64,{image_base64}"
        } for image_base64 in resized_images
    ]

    # Send API request
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": DESIGN_AGENT_IMG_SYS_PROMPT
            }] + context +
            [{
                "role": "user",
                "content": user_content
            }
        ]
    )

    prompt =  (response.output[0].content[0].text).split("Product list:")[0].strip() + "(Keep geometry, composition, and lcoation of objects exactly same as image1). (Keep windows, doors, ceiling, floors, and everything else exactly the same as image1)"

    # Send API request
    response = client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": prompt
            },
            {
                "role": "user",
                "content": user_content
            }
        ],
        tools=[
            {
                "type": "file_search",
                "vector_store_ids": ["vs_683e3aaf9c14819191c0431640b76174"]
            },
            {
                "type": "image_generation",
                "size": "auto",
                "quality": "medium"
            }
        ]
    )

    # Extract image result
    base64_image = None
    for item in response.output:
        if item.type == "image_generation_call" and item.result:
            base64_image = item.result
            break

    return base64_image