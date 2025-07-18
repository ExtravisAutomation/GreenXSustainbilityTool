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
class MetricesPayload(BaseModel):
    site_id: int
    duration: Optional[str] = "24 hours"



class MetricsDetail(BaseModel):
    site_id: int=None

    duration: Optional[str]=None
    total_devices: Optional[int]=None
    total_up_links:Optional[int]=None
    total_down_links:Optional[int]=None
    total_interface:Optional[int]=None
    up_link_percentage:Optional[float]=None
    down_link_percentage:Optional[float]=None
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
    total_input_bytes_gb:float=0.0
    total_output_bytes_gb:float=0.0
    datatraffic_allocated_gb:float=0.0
    datatraffic_consumed_gb:float=0.0
    datautilization_per:float=0.0
    pcr_kw_per_gb:float=0.0
    traffic_throughput_gb_per_watt:float=0.0
    co2_car_trip_km:float=0.0
    co2_flights_avoided:float=0.0




