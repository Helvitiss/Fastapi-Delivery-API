import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import UnauthorizedError
from app.core.security import create_access_token, create_otp_code
from app.repositories.auth import AuthRepository
from app.repositories.user import UserRepository
from app.tasks.auth import send_otp_code_task

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, session: AsyncSession, user_repo: UserRepository, auth_repo: AuthRepository):
        self.session = session
        self.user_repo = user_repo
        self.auth_repo = auth_repo

    async def request_otp(self, phone_number: str) -> int:
        code = create_otp_code()
        expires_at = datetime.now(UTC) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

        await self.auth_repo.delete_old_otps(phone_number)
        await self.auth_repo.create_otp(phone_number=phone_number, code=code, expires_at=expires_at)

        send_otp_code_task.delay(phone_number, code)

        return int(settings.OTP_EXPIRE_MINUTES)

    async def verify_otp_and_issue_token(self, phone_number: str, code: str) -> str:
        now = datetime.now(UTC)
        otp = await self.auth_repo.get_valid_otp(phone_number, code, now)
        if otp is None:
            raise UnauthorizedError("Invalid OTP or expired")

        await self.auth_repo.delete_old_otps(phone_number)
        user = await self.user_repo.get_by_phone(phone_number)
        if user is None:
            user = await self.user_repo.create_with_phone(phone_number)

        return create_access_token(subject=str(user.id))
