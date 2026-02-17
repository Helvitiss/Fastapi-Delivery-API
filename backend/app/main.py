import uvicorn
from starlette.staticfiles import StaticFiles

from app.api.v1 import base_router
from fastapi import FastAPI

from app.core.config import MEDIA_ROOT

app = FastAPI()

app.mount("/media", StaticFiles(directory=MEDIA_ROOT), name="media")
app.include_router(base_router)
