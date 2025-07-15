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
