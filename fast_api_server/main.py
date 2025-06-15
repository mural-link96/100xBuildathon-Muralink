# main.py
from fastapi import FastAPI
from fast_api_server.routers import google_auth, image_processing
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Muralink Image Processing API",
    description="This API does awesome stuff and is deployed on Azure.",
    version="1.0.0",
    contact={
        "name": "Agnibha Chandra",
        "url": "https://www.linkedin.com/in/agnibha-chandra/",
        "email": "agnibhachandra97@gmail.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# Allow requests from your frontend (e.g., localhost:3000 during development)
origins = [
    "http://localhost:3000",      # React or Next.js dev server
    "http://127.0.0.1:3000",
    "*"      # Just in case you're accessing via this
    # Add your production frontend domain here too when needed
]

# Add CORS middleware before defining your routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Exact origins allowed
    allow_credentials=True,        # Allow cookies/auth headers
    allow_methods=["*"],           # Allow all HTTP methods
    allow_headers=["*"],           # Allow all headers
)

# Include the router
app.include_router(image_processing.router)
app.include_router(google_auth.router)