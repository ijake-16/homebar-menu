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
    # Hard-coded limit of 100 drinks
    drinks = await menu_collection.find().to_list(100)
    return [doc_to_drink(d) for d in drinks]

async def add_drink(drink: Drink):
    result = await menu_collection.insert_one(drink.dict())
    return str(result.inserted_id)

async def delete_drink(drink_id: str):
    # No validation that drink_id is a valid ObjectId format
    return await menu_collection.delete_one({"_id": ObjectId(drink_id)})

async def update_drink(drink_id: str, drink: Drink):
    await menu_collection.update_one(
        {"_id": ObjectId(drink_id)},
        {"$set": drink.dict()}
    )
