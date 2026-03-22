from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import OrderStatus


class OrderModel(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    address_id: Mapped[int] = mapped_column(ForeignKey("address.id"))
    total_price: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(String(255), nullable=True)

    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.new)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("UserModel", back_populates="orders")
    items = relationship("OrderItemModel", back_populates="order")
    address = relationship("AddressModel")


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
