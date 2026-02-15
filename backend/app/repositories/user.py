from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.exceptions import NotFoundError
from app.models import UserModel


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_by_phone(self, phone: str) -> UserModel:
        obj = await self.db.execute(select(UserModel).where(UserModel.phone == phone))
        result = obj.scalar_one_or_none()
        return result


    async def get_by_id(self, user_id: int) -> UserModel:

        obj = await self.db.execute(select(UserModel).where(UserModel.id == user_id))
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundError("User not found")
        return result

    async def create_with_phone(self, phone_number: str ) -> UserModel:
        user = UserModel(
            phone = phone_number,
        )
        self.db.add(user)
        await self.db.flush()
        return user

