from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BuildingBase(BaseModel):
    building_name: str

class BuildingCreate(BuildingBase):
    pass

class BuildingUpdate(BaseModel):
    building_name: Optional[str] = None

class BuildingDetails(BuildingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class GetBuildingsResponse(BaseModel):
    buildings: List[BuildingDetails]

class CustomResponse_building(BaseModel):
    message: str
    data: Optional[BuildingDetails] = None
    status_code: int

class MultiDeleteResponse(BaseModel):
    message: str
    deleted_ids: List[int]
    status_code: int