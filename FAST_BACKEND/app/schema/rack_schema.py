from pydantic import BaseModel
from datetime import date
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')


class RackBase(BaseModel):
    rack_name: str
    site_id: int
    manufacture_date: Optional[date] = None
    rack_model: Optional[str] = None
    RFS: Optional[str] = None
    Height: Optional[int] = None
    Width: Optional[int] = None
    Depth: Optional[int] = None
    status: Optional[str] = None


class RackCreate(RackBase):
    pass


class RackDetails(RackBase):
    id: int

    class Config:
        orm_mode = True


# class RackCreate(RackBase):
#     pass


class RackUpdate(BaseModel):
    site_id: int
    rack_name: str
    manufacture_date: Optional[date] = None
    rack_model: Optional[str] = None
    RFS: Optional[str] = None
    Height: Optional[int] = None
    Width: Optional[int] = None
    Depth: Optional[int] = None
    status: Optional[str] = None


# class RackDetails(RackBase):
#     id: int


class GetRacksResponse(BaseModel):
    racks: List[RackDetails]


class CustomResponse_rack(BaseModel, Generic[T]):
    message: str
    data: Optional[T]
    status_code: int


from pydantic import BaseModel


class RackUpdateResponse(BaseModel):
    message: str
    data: RackDetails
    status_code: int
