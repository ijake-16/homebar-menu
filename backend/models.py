# models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class Ingredient(BaseModel):
    item: str
    amount: str

class Drink(BaseModel):
    name: str
    abv: int
    description: str
    base: str
    glass: str
    ingredients: List[Ingredient]
    ice: str
    shake_or_stir: str
    available: bool = True
    instructions: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    image_url: Optional[str] = ""

class DrinkInDB(Drink):
    id: str = Field(default_factory=str, alias="_id")
