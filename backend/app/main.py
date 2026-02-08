import uvicorn
from app.api.v1 import base_router
from fastapi import FastAPI

app = FastAPI()

app.include_router(base_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
