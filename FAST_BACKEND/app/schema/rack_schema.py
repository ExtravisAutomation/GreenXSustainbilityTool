from pydantic import BaseModel
from typing import Optional, List
from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank


class RackDetails(BaseModel):
    id: int
    name: Optional[str] = None
    location: Optional[str] = None
    height: Optional[str] = None
    space: Optional[str] = None
    power: Optional[str] = None
    devices: Optional[str] = None
    role: Optional[str] = None
    site_id: Optional[int] = None
    site_name: Optional[str] = None


class GetRackResponse(BaseModel):
    racks: List[RackDetails]


class RackBase(BaseModel):
    name: str
    location: Optional[str] = None
    height: Optional[str] = None
    space: Optional[str] = None
    power: Optional[str] = None
    devices: Optional[str] = None
    role: Optional[str] = None


class RackCreate(RackBase):
    site_id: int


class RackUpdate(RackBase):
    pass


class RackInDB(RackBase):
    pass


class Rack(ModelBaseInfo, RackBase):
    pass
