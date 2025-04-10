import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    # Connect to MongoDB
    mongodb_uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("DB_NAME", "banpo")
    
    print(f"MONGODB_URI: {mongodb_uri}")
    print(f"DB_NAME: {db_name}")
    
    client = AsyncIOMotorClient(mongodb_uri)
    
    # List all databases
    databases = await client.list_database_names()
    print(f"Available databases: {databases}")
    
    # List all collections in the target database
    db = client[db_name]
    collections = await db.list_collection_names()
    print(f"Collections in {db_name}: {collections}")
    
    # Count documents in the menu collection
    if "menu" in collections:
        count = await db.menu.count_documents({})
        print(f"Documents in menu collection: {count}")
        
        # List a sample document if available
        if count > 0:
            sample = await db.menu.find_one()
            print(f"Sample document: {sample}")
    else:
        print("The 'menu' collection doesn't exist. Creating it with sample data...")
        
        # Create the collection with a sample document
        result = await db.menu.insert_one({
            "name": "Margarita",
            "korean_name": "마가리타",
            "abv": "13%",
            "base": "Tequila",
            "ingredients": ["Tequila", "Lime Juice", "Triple Sec"],
            "description": "A classic cocktail made with tequila, lime juice, and triple sec."
        })
        
        print(f"Inserted sample document with ID: {result.inserted_id}")

if __name__ == "__main__":
    asyncio.run(main()) 