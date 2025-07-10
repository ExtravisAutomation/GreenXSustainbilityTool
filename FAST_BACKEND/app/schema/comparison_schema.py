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
    input_power_kw: Optional[float]=None
    output_power_kw:Optional[float]=None
    cost_factor:Optional[float]=None
    cost_unit:Optional[str]=None



class comparisonDetail(BaseModel):
    site_id: Optional[int]=None
    duration: Optional[str]=None
    pue: Optional[float]=None
    eer_per:Optional[float]=None
    input_power_kw: Optional[float]=None
    output_power_kw:Optional[float]=None
    co_em_factor: Optional[float]=None
    co2_em_kg:Optional[float]=None
    co2_em_tons:Optional[float]=None
    cost_factor:Optional[float]=None
    cost_unit: Optional[str] = None
    cost_estimation:Optional[float]=None
    cost_estimation_monthly: Optional[float] = None
    cost_estimation_yearly: Optional[float] = None
    datatraffic_allocated_gb:Optional[float]=None
    datatraffic_consumed_gb:Optional[float]=None
    datautilization_per:Optional[float]=None
    pcr_kw_per_gb:Optional[float]=None
    traffic_throughput_gb_per_watt:Optional[float]=None



