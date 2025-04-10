import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    # Get MongoDB URI and add SSL bypass parameter if not already present
    mongodb_uri = os.environ.get("MONGODB_URI", "")
    if "?" in mongodb_uri:
        if "tlsAllowInvalidCertificates=true" not in mongodb_uri:
            mongodb_uri += "&tlsAllowInvalidCertificates=true"
    else:
        mongodb_uri += "?tlsAllowInvalidCertificates=true"
    
    db_name = os.environ.get("DB_NAME", "banpo")
    
    print(f"Connecting to database {db_name}...")
    client = AsyncIOMotorClient(mongodb_uri)
    db = client[db_name]
    
    # Check if menu collection exists and has documents
    count = await db.menu.count_documents({})
    print(f"Current document count in menu collection: {count}")
    
    if count == 0:
        print("Adding sample cocktails to the database...")
        
        # Sample cocktail data
        cocktails = [
            {
                "name": "Margarita",
                "korean_name": "마가리타",
                "abv": "13%",
                "base": "Tequila",
                "ingredients": ["Tequila", "Lime Juice", "Triple Sec"],
                "description": "A classic cocktail made with tequila, lime juice, and triple sec."
            },
            {
                "name": "Mojito",
                "korean_name": "모히토",
                "abv": "12%",
                "base": "Rum",
                "ingredients": ["White Rum", "Lime Juice", "Mint", "Sugar", "Soda Water"],
                "description": "A refreshing cocktail with rum, lime, mint, and soda water."
            },
            {
                "name": "Old Fashioned",
                "korean_name": "올드 패션드",
                "abv": "32%",
                "base": "Whiskey",
                "ingredients": ["Bourbon", "Angostura Bitters", "Sugar", "Water"],
                "description": "A classic whiskey cocktail with bitters and sugar."
            },
            {
                "name": "Negroni",
                "korean_name": "네그로니",
                "abv": "24%",
                "base": "Gin",
                "ingredients": ["Gin", "Campari", "Sweet Vermouth"],
                "description": "A bitter and complex cocktail with equal parts gin, Campari, and sweet vermouth."
            },
            {
                "name": "Moscow Mule",
                "korean_name": "모스코 뮬",
                "abv": "10%",
                "base": "Vodka",
                "ingredients": ["Vodka", "Lime Juice", "Ginger Beer"],
                "description": "A refreshing cocktail with vodka, lime juice, and ginger beer."
            }
        ]
        
        # Insert the cocktails
        result = await db.menu.insert_many(cocktails)
        print(f"Added {len(result.inserted_ids)} sample cocktails to the database")
        
        # Print the inserted IDs
        for i, cocktail_id in enumerate(result.inserted_ids):
            print(f"Inserted {cocktails[i]['name']} with ID: {cocktail_id}")
    else:
        print(f"Database already has {count} documents. Skipping sample data insertion.")
        
        # Show a sample document
        sample = await db.menu.find_one()
        print(f"Sample document: {sample}")

if __name__ == "__main__":
    asyncio.run(main()) 