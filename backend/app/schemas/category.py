
from pydantic import BaseModel, Field, ConfigDict


class CategoryBase(BaseModel):
    name: str = Field(..., description="Название категории")
    description: str | None = Field(None, description="Описание категории")


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, description="Название категории")
    description: str | None = Field(None, description="Описание категории")


class CategoryRead(CategoryBase):
    id: int = Field(..., description="ID категории")

    model_config = ConfigDict(from_attributes=True)
