from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.exceptions import NotFoundException
from app.models import UserModel
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_by_phone(self, phone: str) -> UserModel:
        obj = await self.db.execute(select(UserModel).where(UserModel.phone == phone))
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundException("User not found")
        return result


    async def get_by_id(self, user_id: int) -> UserModel:

        obj = await self.db.execute(select(UserModel).where(UserModel.id == user_id))
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundException("User not found")
        return result

    async def create(self, user_data: dict) -> UserModel:
        user = UserModel(**user_data)
        self.db.add(user)
        await self.db.flush()
        return user

