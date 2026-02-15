from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_auth_service, get_current_user
from app.schemas.auth import OTPSentResponse, TokenResponse, OTPVerifySchema
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead
from app.services.auth import AuthService
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/request_code", response_model=OTPSentResponse)
async def get_token(phone_number: str, auth_service: AuthService = Depends(get_auth_service)):
    expires = await auth_service.request_otp(phone_number)
    return OTPSentResponse(phone_number=phone_number, expires_in_seconds=expires)




@router.post('/otp_login', response_model=TokenResponse)
async def otp_login(data: OTPVerifySchema, auth_service: AuthService = Depends(get_auth_service)):
    token = await auth_service.verify_otp_and_issue_token(phone_number=data.phone_number,code=data.code)
    return TokenResponse(access_token=token)