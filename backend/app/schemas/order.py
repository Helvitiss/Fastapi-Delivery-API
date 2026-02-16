from pydantic import BaseModel

from app.models.enums import OrderStatus


class OrderStatusSchema(BaseModel):
    status: OrderStatus
