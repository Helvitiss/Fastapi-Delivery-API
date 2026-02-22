
from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import BadRequestError
from app.dependencies.auth import get_auth_service
from app.schemas.auth import OTPSentResponse, TokenResponse, OTPVerifyRequest, OTPRequest

from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Авторизация"])


@router.post(
    "/request-code", 
    response_model=OTPSentResponse,
    summary="Запросить код"
)
async def request_otp_code(
    phone_data: OTPRequest, 
    auth_service: AuthService = Depends(get_auth_service)
):
    expires = await auth_service.request_otp(phone_data.phone_number)
    return OTPSentResponse(phone_number=phone_data.phone_number, expires_in_seconds=expires)


@router.post(
    '/login', 
    response_model=TokenResponse,
    summary="Вход по OTP"
)
async def login_by_otp(
    data: OTPVerifyRequest, 
    auth_service: AuthService = Depends(get_auth_service)
):
    token = await auth_service.verify_otp_and_issue_token(phone_number=data.phone_number, code=data.code)
    return TokenResponse(access_token=token)
