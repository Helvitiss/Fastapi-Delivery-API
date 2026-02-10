import enum
from datetime import datetime

from sqlalchemy import ForeignKey, String, Integer, Enum, DateTime, func

from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class OrderStatus(enum.Enum):
    new = "new"
    confirmed = "confirmed"
    cooking = "cooking"
    delivering = "delivering"
    completed = "completed"
    cancelled = "cancelled"





class OrderModel(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(String(100))
    total_price: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(String(255))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.new
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("UserModel", back_populates="orders")
    items = relationship("OrderItemModel", back_populates="order")



class OrderItemModel(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))


    dish_id: Mapped[int] = mapped_column(ForeignKey("dish.id"))
    dish_name: Mapped[str] = mapped_column(String(50))
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[int] = mapped_column(Integer)

    dish = relationship("DishModel")
    order = relationship("OrderModel", back_populates="items")