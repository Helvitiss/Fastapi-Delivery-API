from pydantic import BaseModel, ConfigDict, Field


class DishBase(BaseModel):
    name: str
    price: int = Field(..., gt=0)
    weight: int | None = Field(None, gt=0, description="Вес в граммах")
    description: str | None = None
    is_available: bool = True
    category_id: int


class DishCreate(DishBase):
    pass


class DishRead(DishBase):
    id: int
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class DishUpdate(BaseModel):
    name: str | None = Field(None, description="Название блюда")
    price: int | None = Field(None, gt=0, description="Цена блюда")
    weight: int | None = Field(None, gt=0, description="Вес блюда в граммах")
    description: str | None = Field(None, description="Описание блюда")
    is_available: bool | None = Field(None, description="Доступность блюда")
    category_id: int | None = Field(None, gt=0, description="ID категории блюда")
