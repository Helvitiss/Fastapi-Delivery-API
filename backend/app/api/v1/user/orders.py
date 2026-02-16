from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError
from app.dependencies.auth import get_current_user
from app.dependencies.main import get_order_service, get_async_db
from app.models import UserModel, AddressModel
from app.schemas.address import AddressCreate
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["user: orders"])



@router.get("/")
async def get_order(user: UserModel = Depends(get_current_user),
                    order_service: OrderService = Depends(get_order_service)):
    return await order_service.get_all_user_orders(user_id=user.id)

@router.get("/{order_id}")
async def get_user_order(order_id: int,
                         user: UserModel = Depends(get_current_user),
                         order_service: OrderService = Depends(get_order_service)):
    return await order_service.get_order_by_id_and_user(order_id, user.id)


@router.post("/", status_code=201)
async def create_order(address_id: int,
                       user: UserModel = Depends(get_current_user),
                       order_service: OrderService = Depends(get_order_service)):
    try:
        await order_service.create_order(user.id, address_id)
    except BadRequestError as e:
        raise HTTPException(status_code=400, detail=e.__str__())

@router.post('/address')
async def create_address(data: AddressCreate, session: AsyncSession = Depends(get_async_db),
                         user: UserModel = Depends(get_current_user)):
    address = AddressModel(user_id=user.id, **data.model_dump())
    session.add(address)


