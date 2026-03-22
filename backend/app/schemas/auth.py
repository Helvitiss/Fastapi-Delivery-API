from pydantic import BaseModel, Field


class OTPRequest(BaseModel):
    phone_number: str = Field(
        ...,
        min_length=8,
        max_length=20,
        description="Номер телефона для получения кода",
        json_schema_extra={"example": "79998887766"},
    )


class OTPVerifyRequest(OTPRequest):
    code: str = Field(
        ...,
        min_length=6,
        max_length=6,
        description="6-значный код из SMS",
        json_schema_extra={"example": "123456"},
    )


class OTPSentResponse(OTPRequest):
    expires_in_seconds: int = Field(..., description="Время жизни кода в секундах")


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT токен доступа")
    token_type: str = Field(default="bearer", description="Тип токена")
