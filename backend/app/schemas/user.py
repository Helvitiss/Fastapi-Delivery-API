from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    phone: str

class UserRead(BaseModel):
    id: int
    name: str
    phone: str

    model_config = {
        "from_attributes": True,
    }

class UserUpdate(UserCreate):
    name: str