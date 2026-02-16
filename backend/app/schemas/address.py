from pydantic import BaseModel







class Address(BaseModel):
    id: int
    address: str
    user_id: int




class AddressCreate(BaseModel):
    address: str
    user_id: int
