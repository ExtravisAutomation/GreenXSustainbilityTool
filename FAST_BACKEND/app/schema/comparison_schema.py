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
    comparison:bool=False



class comparisonDetail(BaseModel):
    site_id: int=None
    duration: Optional[str]=None
    pue: float=0.0
    eer_per:float=0.0
    input_power_kw: float=0.0
    output_power_kw:float=0.0
    co_em_factor: float=0.0
    co2_em_kg:float=0.0
    co2_em_tons:float=0.0
    cost_factor:float=0.0
    cost_unit: str=None
    cost_estimation:float=0.0
    cost_estimation_daily:float=0.0
    cost_estimation_monthly: float=0.0
    cost_estimation_yearly: float=0.0
    datatraffic_allocated_gb:float=0.0
    datatraffic_consumed_gb:float=0.0
    datautilization_per:float=0.0
    pcr_kw_per_gb:float=0.0
    traffic_throughput_gb_per_watt:float=0.0
    pue_evaluation: str=None
    eer_evaluation:str=None



