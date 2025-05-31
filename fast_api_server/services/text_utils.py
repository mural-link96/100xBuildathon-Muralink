def parse_product_list(response_text):
    """
    Extract and parse product list from response text.
    
    Args:
        response_text (str): The response text from the AI assistant
        
    Returns:
        List[dict]: List of products with their properties, or empty list if no product list found
    """
    # Check if the response contains "Product list:" (case-insensitive)
    response_lower = response_text.lower()
    if "product list:" not in response_lower:
        return []
    
    # Find the product list section
    product_list_start = response_lower.find("product list:")
    product_section = response_text[product_list_start:]
    
    # Split by lines and filter out empty lines
    lines = [line.strip() for line in product_section.split('\n') if line.strip()]
    
    # Skip the "Product list:" header line
    product_lines = []
    for line in lines[1:]:  # Skip first line which is "Product list:"
        if line.startswith('-') or line.startswith('•'):
            product_lines.append(line[1:].strip())  # Remove bullet point and trim
    
    products = []
    
    for line in product_lines:
        if not line:
            continue
            
        # Split by comma to separate main product name from properties
        parts = [part.strip() for part in line.split(',')]
        
        if not parts:
            continue
            
        # First part is the product name
        product_name = parts[0]
        
        # Remaining parts are properties
        properties = []
        for prop in parts[1:]:
            if prop:
                properties.append(prop)
        
        # Create product dictionary
        product = {
            "name": product_name,
            "properties": properties
        }
        
        products.append(product)
    
    return products


# Example usage and test function
def test_parse_product_list():
    """Test function to demonstrate usage"""
    sample_response = """In image1,

Step1: Add a mid-century modern style plush sofa in a neutral shade at the wider side of the room for comfortable seating.
Step2: Add a low-profile wooden coffee table with clean lines centered in front of the sofa to place books, decor, or beverages.
Step3: Add a Scandinavian style fabric armchair next to the sofa for additional seating and visual balance.
Step4: Add a tall potted plant in a ceramic planter near the staircase to bring in natural greenness.
Step5: Add a soft area rug with subtle geometric patterns to anchor the seating area and add warmth.
Step6: Add a floor lamp with a warm light next to the armchair for ambient lighting and reading.
Step7: Change the flooring aesthetic by adding light wood laminate to enhance the cozy and natural feel.

Product list:
- Mid-century modern style sofa in light grey fabric, approx. 80"x35", wooden legs
- Wooden coffee table in natural walnut finish, rectangular 48"x24", minimalist style
- Scandinavian style armchair in soft beige fabric, approx. 30"x30", wooden frame
- Tall potted plant in white ceramic planter, approx. 5ft height
- Area rug with subtle grey geometric patterns, 6'x9', low pile fabric
- Floor lamp with black metal stand, white fabric shade, adjustable height, warm LED bulb
- Light wood laminate flooring panels, width 6 inches, length 36 inches, matte finish"""
    
    result = parse_product_list(sample_response)
    
    print("Parsed Products:")
    for i, product in enumerate(result, 1):
        print(f"\n{i}. Product: {product['name']}")
        print(f"   Properties: {product['properties']}")
    
    return result

# Uncomment to test:
#test_parse_product_list()