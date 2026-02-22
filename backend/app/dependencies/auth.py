from fastapi import Depends
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.main import (
    get_async_db, get_user_repository, get_auth_repository
)
from app.models import UserModel
from app.services.auth import AuthService
from app.core.security import decode_token
from app.repositories.user import UserRepository
from app.repositories.auth import AuthRepository
from app.models.enums import UserRole
from app.core.exceptions import (
    UnauthorizedError, ForbiddenError
)

http_bearer = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/otp_login")

async def get_auth_service(
    db: AsyncSession = Depends(get_async_db),
    user_repo: UserRepository = Depends(get_user_repository),
    auth_repo: AuthRepository = Depends(get_auth_repository)
) -> AuthService:
    return AuthService(db, user_repo, auth_repo)


async def get_current_user(
    bearer = Depends(http_bearer), 
    user_repository: UserRepository = Depends(get_user_repository)
) -> UserModel:
    try:
        payload = decode_token(bearer.credentials)
        user_id = int(payload.get('sub'))
    except (JWTError, ValueError, TypeError):
        raise UnauthorizedError("Could not validate credentials.")

    if not user_id:
        raise UnauthorizedError("Invalid credentials")

    # get_by_id уже выбрасывает NotFoundError, который перехватывается глобально
    user = await user_repository.get_by_id(user_id)
    return user


async def is_admin(user: UserModel = Depends(get_current_user)):
    if user.role != UserRole.ADMIN:
        raise ForbiddenError("Forbidden")