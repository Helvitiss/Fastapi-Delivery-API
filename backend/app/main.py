from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.staticfiles import StaticFiles

from app.api.v1 import base_router
from app.core.config import MEDIA_ROOT
from app.core.exceptions import (
    BadRequestError,
    BaseAppError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
)

app = FastAPI(title="Доставка еды API")


# Глобальный обработчик для всех исключений приложения
@app.exception_handler(BaseAppError)
async def app_exception_handler(request: Request, exc: BaseAppError):
    status_code = 500
    if isinstance(exc, NotFoundError):
        status_code = 404
    elif isinstance(exc, BadRequestError):
        status_code = 400
    elif isinstance(exc, UnauthorizedError):
        status_code = 401
    elif isinstance(exc, ForbiddenError):
        status_code = 403
    elif isinstance(exc, ConflictError):
        status_code = 409

    return JSONResponse(
        status_code=status_code,
        content={"detail": exc.message},
    )


app.mount("/media", StaticFiles(directory=MEDIA_ROOT), name="media")
app.include_router(base_router)
