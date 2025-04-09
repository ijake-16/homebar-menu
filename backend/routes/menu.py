# routes/menu.py
from fastapi import APIRouter, HTTPException
from models import Drink
import crud

menu_router = APIRouter()

@menu_router.get("/")
async def get_menu():
    drinks = await crud.get_all_drinks()
    return drinks

@menu_router.post("/")
async def create_drink(drink: Drink):
    result = await crud.add_drink(drink)
    return {"message": "Created", "id": str(result)}

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

@menu_router.get("/{drink_id}")
async def get_drink(drink_id: str):
    drink = await crud.get_drink_by_id(drink_id)
    if not drink:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drink
