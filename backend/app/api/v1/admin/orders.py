from fastapi import APIRouter, Depends
from app.dependencies.auth import is_admin
from app.dependencies.main import get_order_service
from app.models import UserModel
from app.schemas.order import OrderRead, OrderStatusSchema
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["Админ: Заказы"], dependencies=[Depends(is_admin)])


@router.get(
    "/", 
    response_model=list[OrderRead],
    summary="Все заказы"
)
async def list_all_orders(
    order_service: OrderService = Depends(get_order_service)
):
    return await order_service.get_all_orders()


@router.get(
    "/{order_id}", 
    response_model=OrderRead,
    summary="Детали заказа"
)
async def get_order_details(
    order_id: int,
    order_service: OrderService = Depends(get_order_service)
):
    return await order_service.get_order_by_id(order_id)


@router.patch(
    "/{order_id}/status", 
    response_model=OrderRead,
    summary="Изменить статус"
)
async def update_order_status(
    order_id: int,
    status_data: OrderStatusSchema,
    order_service: OrderService = Depends(get_order_service)
):
    return await order_service.update_status(order_id, status_data)