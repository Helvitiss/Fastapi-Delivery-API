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

class AdminUserRead(BaseModel):
    id: int
    phone_number: str
    role: str
    created_at: str | None = None
