from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import UserModel
from app.core.exceptions import NotFoundError


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: int) -> UserModel:
        stmt = select(UserModel).where(UserModel.id == user_id)
        result = await self.session.execute(stmt)
        user = result.scalar_one_or_none()
        if user is None:
            raise NotFoundError(f"User with id {user_id} not found")
        return user

    async def get_by_phone(self, phone: str) -> UserModel | None:
        stmt = select(UserModel).where(UserModel.phone == phone)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_with_phone(self, phone_number: str) -> UserModel:
        user = UserModel(phone=phone_number)
        self.session.add(user)
        await self.session.flush()
        return user

