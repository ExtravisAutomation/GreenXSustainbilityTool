from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel, validator, constr
from typing import Generic, TypeVar, Optional, List, Dict
from pydantic.generics import GenericModel

from datetime import datetime, date

DataT = TypeVar('DataT')

class CustomResponse(GenericModel, Generic[DataT]):
    message: str
    data: Optional[DataT]
    status_code: int


class RoleBase(BaseModel):
    role_name: str
class DashboardModule(BaseModel):
    modules_name: str
class UserModulesAccess(BaseModel):
    module_id: int
    user_id: int

class DashboardModuleCreate(DashboardModule):
    pass
class DashboardModuleUpdate(DashboardModule):
    modules_name: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleDetails(RoleBase):
    id: int

class DashboardModuleDetails(DashboardModule):
    id: int

class RoleUpdate(BaseModel):
    role_name: Optional[str] = None



class UserRead(BaseModel):
    id: int
    email: str
    name: str
    name: str
    username: str
    role_id: int
    module_ids: List[int]

    class Config:
        orm_mode = True
class UserCreate(BaseModel):
    email: str
    password: constr(min_length=8)
    name: str
    username: str
    role_id: int
    module_ids: List[int]                  # ← renamed for clarity
    status: Optional[str] = "active"

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[constr(min_length=8)] = None
    name: Optional[str] = None
    username: Optional[str] = None
    role_id: Optional[int] = None
    status: Optional[str] = None
    module_ids: Optional[List[int]] = None
class UserWithModulesRead(BaseModel):
    id: int
    email: Optional[str] = None
    name: Optional[str] = None
    username: Optional[str] = None
    role_id: Optional[int] = None
    status: Optional[str] = None
    role_id: Optional[int] = None
    module_names: Optional[List[str]]=None

    class Config:
        orm_mode = True

