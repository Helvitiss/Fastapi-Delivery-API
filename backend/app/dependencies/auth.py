from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.main import get_async_db
from app.models import UserModel
from app.services.auth import AuthService
from app.core.security import decode_token
from app.repositories.user import UserRepository
http_bearer = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

async def get_auth_service(db: AsyncSession = Depends(get_async_db)) -> AuthService:
    return AuthService(db)


async def get_current_user(bearer = Depends(http_bearer), db = Depends(get_async_db)) -> UserModel:
    user_repository = UserRepository(db)
    user_id = decode_token(bearer.credentials).get('sub')
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = await user_repository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


