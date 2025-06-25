from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel, validator
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

class SignUp(BaseModel):
    email: str
    password: str
    name: str
    username:str
    role_id: int
    module_id: List
