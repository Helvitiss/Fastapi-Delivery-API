from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import UserModel
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_by_email(self, email: str) -> UserModel | None:
        result = await self.db.scalar(select(UserModel).where(UserModel.email == email))
        return result


    async def get_by_id(self, user_id: int) -> UserModel | None:
        result = await self.db.scalar(select(UserModel).where(UserModel.id == user_id))
        return result

    async def create(self, user: UserModel) -> UserModel:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

