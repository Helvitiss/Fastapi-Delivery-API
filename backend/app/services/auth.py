from logging import getLogger
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserModel
from app.repositories.user import UserRepository
from app.core.security import hash_password, verify_password,  create_access_token
from app.schemas.user import UserCreate



class AuthService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)


    async def register(self, user: UserCreate) -> str:
        existing = await self.user_repo.get_by_email(user.email)
        if existing is not None:

            raise ValueError("User already exists")

        user = UserModel(name=user.name, email=user.email, hashed_password=hash_password(user.password))

        result = await self.user_repo.create(user)


        return create_access_token(str(result.id))



    async def login(self, email: str, password: str) -> str:
        user_model = await self.user_repo.get_by_email(email)

        if not user_model or not  verify_password(plain_password=password, hashed_password=user_model.hashed_password):
            raise ValueError("Invalid credentials")

        if not user_model.is_active:
            raise ValueError("User is not active")

        return create_access_token(str(user_model.id))


