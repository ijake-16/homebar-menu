# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

# Default to None if connection fails
menu_collection = None

try:
    # The format should be: mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
    MONGODB_URI = os.environ.get("MONGODB_URI")
    DB_NAME = os.environ.get("DB_NAME", "homebar")
    
    print("Environment variables after loading .env:")
    print(f"MONGODB_URI found: {'Yes' if MONGODB_URI else 'No'}")
    
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")
        
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    menu_collection = db["menu"]
    print("Successfully connected to MongoDB")
    
except Exception as e:
    print(f"Database connection error: {e}")
    # You might want to handle this differently depending on your application
    # For example, setting a flag to indicate database is unavailable
