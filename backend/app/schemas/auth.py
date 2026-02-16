from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class OTPSentResponse(BaseModel):
    phone_number: str
    expires_in_seconds: int


class OTPVerifyRead(BaseModel):
    phone_number: str = Field(min_length=8, max_length=20)
    code: str = Field(min_length=6, max_length=6)
