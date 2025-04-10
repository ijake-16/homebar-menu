# models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class Ingredient(BaseModel):
    item: str
    amount: str

class Drink(BaseModel):
    name: Optional[str] = Field(None, description="English drink name, optional")
    korean_name: str = Field(..., description="Korean drink name, required")
    abv: int
    description: str = Field(..., description="Drink description, supports Unicode characters")
    base: str
    glass: str
    ingredients: List[Ingredient]
    ice: str
    shake_or_stir: str
    available: bool = True
    instructions: Optional[List[str]] = Field(default=[], description="Instructions, supports Unicode characters")
    tags: Optional[List[str]] = []
    image_url: Optional[str] = ""

    class Config:
        json_encoders = {
            str: lambda v: v  # Ensures strings are passed through as-is
        }

class DrinkInDB(Drink):
    id: str = Field(default_factory=str, alias="_id")
