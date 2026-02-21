from pydantic import BaseModel







class AddressResponse(BaseModel):
    id: int
    address: str
    user_id: int




class AddressCreate(BaseModel):
    address: str
    user_id: int
