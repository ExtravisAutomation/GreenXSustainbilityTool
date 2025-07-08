from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel, validator, EmailStr, constr
from typing import Generic, TypeVar, Optional, List, Dict
from pydantic.generics import GenericModel

from datetime import datetime, date

DataT = TypeVar('DataT')

class CustomResponse(GenericModel, Generic[DataT]):
    message: str
    data: Optional[DataT]
    status_code: int

class comparisonPayload(BaseModel):
    site_id: int
    duration: Optional[str] = "24 hours"
    pue: Optional[float]=None
    co_em_factor: Optional[float]=None
    input_power: Optional[float]=None
    output_power:Optional[float]=None
    cost_factor:Optional[float]=None




