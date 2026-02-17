
from pydantic import BaseModel, Field, ConfigDict


class DishBase(BaseModel):
    name: str = Field(..., description="Название блюда")
    price: int = Field(..., gt=0, description="Цена блюда")
    weight: int | None = Field(gt=0, description="Вес блюда в граммах")
    description: str | None = Field(None, description="Описание блюда")
    is_available: bool = Field(..., description="Доступность блюда")
    category_id: int = Field(..., gt=0, description="ID категории блюда")

class DishCreate(DishBase):
    pass


class DishRead(DishBase):
    id: int = Field(..., description="ID блюда")
    image_url: str | None = Field(None,description='Путь к фото блюда')

    model_config = ConfigDict(from_attributes=True)


class DishUpdate(BaseModel):
    name: str | None = Field(None, description="Название блюда")
    price: int | None = Field(None, gt=0, description="Цена блюда")
    weight: int | None = Field(None, gt=0, description="Вес блюда в граммах")
    description: str | None = Field(None, description="Описание блюда")
    is_available: bool | None = Field(None, description="Доступность блюда")
    category_id: int | None = Field(None,gt=0, description="ID категории блюда")