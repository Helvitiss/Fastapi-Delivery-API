from fastapi import APIRouter, Body, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_order_service
from app.models import UserModel
from app.schemas.order import OrderRead
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["Заказы"])


@router.get("/", response_model=list[OrderRead], summary="Мои заказы")
async def get_my_orders(
    order_service: OrderService = Depends(get_order_service),
    user: UserModel = Depends(get_current_user),
):
    return await order_service.get_all_user_orders(user_id=user.id)


@router.get("/{order_id}", response_model=OrderRead, summary="Детали заказа")
async def get_order_by_id(
    order_id: int,
    order_service: OrderService = Depends(get_order_service),
    user: UserModel = Depends(get_current_user),
):
    return await order_service.get_order_by_id_and_user(order_id, user.id)


@router.post("/", status_code=201, response_model=OrderRead, summary="Оформить заказ")
async def create_order(
    address_id: int = Body(..., embed=True),
    order_service: OrderService = Depends(get_order_service),
    user: UserModel = Depends(get_current_user),
):
    return await order_service.create_order(user.id, address_id)
