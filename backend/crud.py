# crud.py
from models import Drink
from database import menu_collection
from bson import ObjectId

def doc_to_drink(doc):
    doc["_id"] = str(doc["_id"])
    return doc

async def get_all_drinks():
    if menu_collection is None:
        raise ValueError("Database connection not available")
    drinks = await menu_collection.find().to_list(100)
    # Convert ObjectId to string for JSON serialization
    for drink in drinks:
        drink["id"] = str(drink.pop("_id"))
    return drinks

async def add_drink(drink: Drink):
    result = await menu_collection.insert_one(drink.dict())
    return result.inserted_id

async def delete_drink(drink_id: str):
    # No validation that drink_id is a valid ObjectId format
    return await menu_collection.delete_one({"_id": ObjectId(drink_id)})

async def update_drink(drink_id: str, drink: Drink):
    await menu_collection.update_one(
        {"_id": ObjectId(drink_id)},
        {"$set": drink.dict()}
    )

async def get_drink_by_id(drink_id: str):
    try:
        drink = await menu_collection.find_one({"_id": ObjectId(drink_id)})
        if drink:
            drink["id"] = str(drink.pop("_id"))
            return drink
        return None
    except Exception as e:
        print(f"Error fetching drink: {e}")
        return None
