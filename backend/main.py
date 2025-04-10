from fastapi import FastAPI
from routes.menu import menu_router
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from database import MONGODB_URI, DB_NAME, menu_collection

app = FastAPI()

# Get the frontend URL from environment or use default values
frontend_urls = os.environ.get("FRONTEND_URLS", "http://localhost,http://localhost:5173,http://frontend").split(",")
print(f"Allowed CORS origins: {frontend_urls}")

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Homebar API. Go to /docs for documentation."}

# Add a debug endpoint
@app.get("/debug")
async def debug():
    # Gather debug information
    debug_info = {
        "mongodb_uri_exists": MONGODB_URI is not None,
        "mongodb_uri_masked": MONGODB_URI[:20] + "..." if MONGODB_URI else None,
        "db_name": DB_NAME,
        "menu_collection_exists": menu_collection is not None,
        "environment": {k: v for k, v in os.environ.items() if k in ["MONGODB_URI", "DB_NAME", "FRONTEND_URLS"]},
        "CORS_allowed_origins": frontend_urls
    }
    
    # Try to connect to the database
    db_status = "Unknown"
    try:
        if menu_collection is not None:
            # Try to actually connect and perform a simple operation
            count = await menu_collection.count_documents({})
            debug_info["drink_count"] = count
            
            # Try to get server info for version info
            server_info = await menu_collection.database.client.admin.command("serverStatus")
            debug_info["mongodb_version"] = server_info.get("version", "unknown")
            debug_info["mongodb_uptime_hours"] = round(server_info.get("uptime", 0) / 3600, 2)
            
            db_status = "Connected"
        else:
            db_status = "Collection not initialized"
    except Exception as e:
        db_status = f"Error: {str(e)}"
        debug_info["error_type"] = type(e).__name__
        debug_info["error_details"] = str(e)
    
    debug_info["db_status"] = db_status
        
    return debug_info

app.include_router(menu_router, prefix="/menu")
