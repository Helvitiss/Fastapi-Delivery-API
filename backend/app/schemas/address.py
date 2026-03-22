from pydantic import BaseModel, ConfigDict, Field


class AddressResponse(BaseModel):
    id: int
    address: str = Field(..., example="ул. Пушкина, д. Колотушкина")
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class AddressCreate(BaseModel):
    address: str = Field(..., example="ул. Ленина, д. 10")
