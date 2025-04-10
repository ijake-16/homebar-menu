# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import sys
import traceback
import asyncio

load_dotenv()

# Default to None if connection fails
menu_collection = None
MONGODB_URI = None
DB_NAME = None

try:
    # The format should be: mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
    MONGODB_URI = os.environ.get("MONGODB_URI")
    DB_NAME = os.environ.get("DB_NAME", "homebar")
    
    print("Environment variables after loading .env:")
    print(f"MONGODB_URI found: {'Yes' if MONGODB_URI else 'No'}")
    print(f"DB_NAME: {DB_NAME}")
    
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    print("Attempting MongoDB connection...")
    client = AsyncIOMotorClient(MONGODB_URI)
    
    # Don't try to get server_info here since it's async
    # Instead just directly connect to the DB and collection
    # The connection will be verified when we actually use it
    
    db = client[DB_NAME]
    menu_collection = db["menu"]
    print(f"MongoDB client initialized: database={DB_NAME}, collection=menu")
    print("Note: Actual connection will be verified on first request")
    
except Exception as e:
    print(f"DATABASE ERROR: {type(e).__name__}: {e}")
    print("Traceback:")
    traceback.print_exc(file=sys.stdout)
    print("This will cause the application to fall back to static data")
    # You might want to handle this differently depending on your application
    # For example, setting a flag to indicate database is unavailable
