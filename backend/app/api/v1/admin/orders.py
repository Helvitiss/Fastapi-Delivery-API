from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_order_service, get_async_db
from app.models import UserModel, AddressModel
from app.schemas.address import AddressCreate
from app.schemas.order import OrderStatusSchema
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["admin: orders"])


@router.get("/")
async def list_orders(user: UserModel = Depends(get_current_user),
                      order_service: OrderService = Depends(get_order_service)):
    return await order_service.get_all_orders()


@router.get("/{order_id}")
async def get_order(order_id: int,
                    user: UserModel = Depends(get_current_user),
                    order_service: OrderService = Depends(get_order_service)):
    return await order_service.get_order_by_id(order_id)


@router.patch("/{order_id}")
async def update_order_status(order_id: int,
                              status: OrderStatusSchema,
                              user: UserModel = Depends(get_current_user),
                              order_service: OrderService = Depends(get_order_service)):
    return await order_service.update_status(order_id, status)