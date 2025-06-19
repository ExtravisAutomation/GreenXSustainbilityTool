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

class RoleCreate(RoleBase):
    pass
class DashboardModuleCreate(DashboardModule):
    pass
class RoleDetails(RoleBase):
    id: int
