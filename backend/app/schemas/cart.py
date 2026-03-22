from pydantic import BaseModel, ConfigDict, Field

from app.schemas.dish import DishRead


class CartRead(BaseModel):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class CartUpdate(BaseModel): ...


class CartItemCreate(BaseModel):
    dish_id: int = Field(
        ...,
        gt=0,
        description="ID блюда",
        json_schema_extra={"example": 1},
    )
    quantity: int = Field(
        default=1,
        ge=1,
        description="Количество порций",
        json_schema_extra={"example": 2},
    )


class CartItemRead(BaseModel):
    id: int
    dish_id: int
    quantity: int

    model_config = ConfigDict(from_attributes=True)


class CartItemWithDish(BaseModel):
    dish: DishRead
    quantity: int
    total_dish_price: int = Field(..., description="Цена * количество")


class CartWithItemsResponse(BaseModel):
    cart_id: int = Field(..., description="ID корзины")
    total_price: int = Field(..., description="Общая стоимость всей корзины")
    items: list[CartItemWithDish] = Field(..., description="Список товаров в корзине")
