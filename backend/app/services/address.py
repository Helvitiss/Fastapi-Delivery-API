from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, BadRequestError
from app.models import AddressModel
from app.repositories.address import AddressRepository
from app.schemas.address import AddressCreate


class AddressService:
    def __init__(self, session: AsyncSession, address_repo: AddressRepository):
        self.session = session
        self.address_repo = address_repo


    async def create(self, user_id: int, address: AddressCreate):
        address_model = AddressModel(user_id=user_id, address=address.address)
        await self.address_repo.create(address_model)
        return address_model


    async def get_by_user_id(self, user_id: int):
        return await self.address_repo.get_by_user_id(user_id)




    async def delete(self, address_id, user_id: int):
        await self.address_repo.delete(address_id, user_id)
