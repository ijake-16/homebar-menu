# routes/menu.py
from fastapi import APIRouter, HTTPException
from models import Drink
import crud

menu_router = APIRouter()

@menu_router.get("/")
async def get_menu():
    return await crud.get_all_drinks()

@menu_router.post("/")
async def create_drink(drink: Drink):
    return {"id": await crud.add_drink(drink)}

@menu_router.delete("/{drink_id}")
async def delete_drink(drink_id: str):
    result = await crud.delete_drink(drink_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}

@menu_router.put("/{drink_id}")
async def update_drink(drink_id: str, drink: Drink):
    await crud.update_drink(drink_id, drink)
    return {"message": "Updated"}
