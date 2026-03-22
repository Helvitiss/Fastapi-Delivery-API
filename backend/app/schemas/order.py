from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OrderStatus


class OrderItemRead(BaseModel):
    id: int = Field(..., description="ID элемента заказа")
    dish_id: int = Field(..., description="ID блюда")
    dish_name: str = Field(..., description="Название блюда на момент заказа")
    price: int = Field(..., description="Размер цены на момент заказа")
    quantity: int = Field(..., description="Количество")

    model_config = ConfigDict(from_attributes=True)


class OrderRead(BaseModel):
    id: int
    user_id: int
    address_id: int
    total_price: int
    status: OrderStatus
    comment: str | None = None
    created_at: datetime
    items: list[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)


class OrderStatusSchema(BaseModel):
    status: OrderStatus
