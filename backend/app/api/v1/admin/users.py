from fastapi import APIRouter, Depends

from app.dependencies.auth import is_admin
from app.dependencies.main import get_user_repository
from app.repositories.user import UserRepository
from app.schemas.user import AdminUserRead

router = APIRouter(prefix="/users", tags=["Админ: Пользователи"], dependencies=[Depends(is_admin)])


@router.get(
    "/",
    response_model=list[AdminUserRead],
    summary="Список пользователей"
)
async def list_users(user_repo: UserRepository = Depends(get_user_repository)):
    users = await user_repo.get_all()
    return [
        {
            "id": user.id,
            "phone_number": user.phone,
            "role": str(user.role).lower(),
            "created_at": None,
        }
        for user in users
    ]
