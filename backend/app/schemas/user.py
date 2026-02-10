from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = {
        "from_attributes": True,
    }

class UserUpdate(UserCreate):
    email: str | None
    password: str | None