from fastapi import FastAPI
from routes.menu import menu_router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Get the frontend URL from environment or use default values
frontend_urls = os.environ.get("FRONTEND_URLS", "http://localhost,http://localhost:5173,http://frontend").split(",")

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Homebar API. Go to /docs for documentation."}

app.include_router(menu_router, prefix="/menu")
