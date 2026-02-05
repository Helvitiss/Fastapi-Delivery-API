from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class CategoryBase(BaseModel):
    name: str = Field(..., description="Название категории")
    description: Optional[str] = Field(None, description="Описание категории")


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, description="Название категории")
    description: Optional[str] = Field(None, description="Описание категории")


class Category(CategoryBase):
    id: int = Field(..., description="ID категории")

    model_config = ConfigDict(from_attributes=True)
