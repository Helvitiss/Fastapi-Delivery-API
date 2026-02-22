from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import OTPCodeModel


class AuthRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_otp(self, phone_number: str, code: str, expires_at: datetime) -> OTPCodeModel:
        otp = OTPCodeModel(
            phone_number=phone_number,
            code=code,
            expires_at=expires_at,
        )
        self.session.add(otp)
        await self.session.flush()
        return otp

    async def delete_old_otps(self, phone_number: str) -> None:
        stmt = delete(OTPCodeModel).where(OTPCodeModel.phone_number == phone_number)
        await self.session.execute(stmt)
        await self.session.flush()

    async def get_valid_otp(self, phone_number: str, code: str, now: datetime) -> OTPCodeModel | None:
        stmt = select(OTPCodeModel).where(
            OTPCodeModel.phone_number == phone_number,
            OTPCodeModel.expires_at > now,
            OTPCodeModel.code == code
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
