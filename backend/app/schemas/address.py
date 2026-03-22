from pydantic import BaseModel, ConfigDict, Field


class AddressResponse(BaseModel):
    id: int
    address: str = Field(
        ...,
        json_schema_extra={"example": "ул. Пушкина, д. Колотушкина"},
    )
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class AddressCreate(BaseModel):
    address: str = Field(
        ...,
        json_schema_extra={"example": "ул. Ленина, д. 10"},
    )
