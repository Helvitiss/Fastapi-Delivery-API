from pydantic import BaseModel, Field

from app.schemas.dish import DishRead


class CartRead(BaseModel):
    id: int
    user_id: int




class CartUpdate(BaseModel):
    ...

class CartItemCreate(BaseModel):
    dish_id: int = Field(gt=0)
    quantity: int | None = Field(default=1,ge=0)

class CartItemRead(CartItemCreate):
    id: int


class CartItemWithDish(BaseModel):
    dish: DishRead
    quantity: int
    total_dish_price: int


class CartWithItemsResponse(BaseModel):
    cart_id: int
    total_price: int
    items: list['CartItemWithDish']