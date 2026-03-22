from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import AddressModel


class AddressRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, address_model: AddressModel) -> AddressModel:
        self.session.add(address_model)
        await self.session.flush()
        return address_model

    async def get_by_user_id(self, user_id: int) -> list[AddressModel]:
        stmt = select(AddressModel).where(AddressModel.user_id == user_id)
        result = await self.session.scalars(stmt)
        return result.all()

    async def delete(self, address_id: int, user_id: int) -> None:
        stmt = select(AddressModel).where(
            AddressModel.id == address_id, AddressModel.user_id == user_id
        )
        result = await self.session.execute(stmt)
        address = result.scalar_one_or_none()
        if address is None:
            raise NotFoundError("Address not found")
        await self.session.delete(address)
        await self.session.flush()
