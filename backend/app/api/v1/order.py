from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_order_servise, get_async_db
from app.models import UserModel, AddressModel
from app.schemas.address import AddressCreate
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/")
async def get_orders():
    ...


@router.post("/")
async def create_order(address_id:int,
                       user: UserModel = Depends(get_current_user),
                       order_service: OrderService = Depends(get_order_servise)):
    order = await order_service.create_order(user.id, address_id)
    return 'OK'

@router.post('/address')
async def create_address(data: AddressCreate, session: AsyncSession=Depends(get_async_db), user: UserModel = Depends(get_current_user)):
    address = AddressModel(user_id=user.id, **data.model_dump())
    session.add(address)
