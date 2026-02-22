
from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import BadRequestError
from app.dependencies.auth import get_auth_service
from app.schemas.auth import OTPSentResponse, TokenResponse, OTPVerifyRequest, OTPRequest

from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["user: auth"])


@router.post("/request_code", response_model=OTPSentResponse)
async def get_token(phone_number: OTPRequest, auth_service: AuthService = Depends(get_auth_service)):
    expires = await auth_service.request_otp(phone_number.phone_number)
    return OTPSentResponse(phone_number=phone_number.phone_number, expires_in_seconds=expires)




@router.post('/otp_login', response_model=TokenResponse)
async def otp_login(data: OTPVerifyRequest, auth_service: AuthService = Depends(get_auth_service)):
    try:
        token = await auth_service.verify_otp_and_issue_token(phone_number=data.phone_number,code=data.code)
    except BadRequestError:
        raise HTTPException(status_code=401, detail="Invalid number or code")
    return TokenResponse(access_token=token)
