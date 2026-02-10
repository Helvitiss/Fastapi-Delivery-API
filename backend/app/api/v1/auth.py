from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies.auth import get_auth_service, http_bearer, oauth2_scheme, get_current_user
from app.core.security import decode_token
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead
from app.services.auth import AuthService
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/register", response_model=Token)
async def register(data: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    try:
        token = await auth_service.register(data)
        return Token(access_token=token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    username = form_data.username
    password = form_data.password
    try:
        token = await auth_service.login(username, password)
        return Token(access_token=token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/me", response_model=UserRead)
async def get_me(me: dict = Depends(get_current_user)):
    return me


