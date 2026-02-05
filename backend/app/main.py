import uvicorn
from app.api.v1 import *
from fastapi import FastAPI

app = FastAPI()

app.include_router(dish_router)
app.include_router(category_router)



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
