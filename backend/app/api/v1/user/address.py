from fastapi import APIRouter
from fastapi.params import Depends

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_address_service
from app.models import UserModel
from app.schemas.address import AddressCreate, AddressResponse
from app.services.address import AddressService




router = APIRouter(prefix="/address", tags=["Адреса"])

@router.post(
    '/', 
    status_code=201, 
    response_model=AddressResponse,
    summary="Создать адрес"
)
async def create_address(
    data: AddressCreate, 
    address_service: AddressService = Depends(get_address_service),
    user: UserModel = Depends(get_current_user)
):
    return await address_service.create(user.id, data)

@router.get(
    '/', 
    response_model=list[AddressResponse],
    summary="Список адресов"
)
async def get_addresses(
    address_service: AddressService = Depends(get_address_service),
    user: UserModel = Depends(get_current_user)
):
    return await address_service.get_by_user_id(user.id)

@router.delete(
    '/{address_id}', 
    status_code=204,
    summary="Удалить адрес"
)
async def delete_address(
    address_id: int, 
    address_service: AddressService = Depends(get_address_service),
    user: UserModel = Depends(get_current_user)
):
    await address_service.delete(address_id, user.id)