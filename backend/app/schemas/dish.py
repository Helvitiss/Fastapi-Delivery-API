from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class DishBase(BaseModel):
    name: str = Field(..., description="Название блюда")
    price: int = Field(..., gt=0, description="Цена блюда")
    weight: int | None = Field(gt=0, description="Вес блюда в граммах")
    description: Optional[str] = Field(None, description="Описание блюда")
    is_available: bool = Field(..., description="Доступность блюда")
    category_id: int = Field(..., gt=0, description="ID категории блюда")


class DishCreate(DishBase):
    pass


class DishUpdate(BaseModel):
    name: Optional[str] = Field(None, description="Название блюда")
    price: Optional[int] = Field(None, gt=0, description="Цена блюда")
    weight: Optional[int] = Field(None, gt=0, description="Вес блюда в граммах")
    description: Optional[str] = Field(None, description="Описание блюда")
    is_available: Optional[bool] = Field(None, description="Доступность блюда")
    category_id: Optional[int] = Field(None,gt=0, description="ID категории блюда")


class Dish(DishBase):
    id: int = Field(..., description="ID блюда")

    model_config = ConfigDict(from_attributes=True)