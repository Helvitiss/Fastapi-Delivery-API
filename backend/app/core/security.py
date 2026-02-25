from datetime import datetime, timedelta, UTC

from fastapi import HTTPException
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings
from random import randint



def create_otp_code():
    return f"{randint(0, 999999):06d}"



def create_access_token(subject: str, role: str) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload ={
        'sub': subject,
        'role': role,
        'exp': expire,

    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

def decode_token(token: str) -> dict:

    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    return decoded

