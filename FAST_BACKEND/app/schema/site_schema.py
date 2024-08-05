from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel, validator
from typing import Generic, TypeVar, Optional, List, Dict
from pydantic.generics import GenericModel
from datetime import datetime

DataT = TypeVar('DataT')


class SiteBase(BaseModel):
    site_name: str
    site_type: str
    region: str
    city: str
    latitude: str
    longitude: str
    status: str
    total_devices: Optional[str] = None


class SiteDetails(SiteBase):
    id: int


class GetSitesResponse(BaseModel):
    sites: List[SiteDetails]


class SiteCreate(SiteBase):
    pass


class SiteDetails_get(SiteBase):
    id: int
    power_utilization: Optional[float] = None
    power_input: Optional[float] = None
    pue: Optional[float] = None
    datatraffic: Optional[float] = None
    num_racks: Optional[int] = None
    num_devices: Optional[int] = None


class SiteUpdate(BaseModel):
    site_name: Optional[str] = None
    site_type: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    status: Optional[str] = None
    total_devices: Optional[str] = None


class Site(ModelBaseInfo, SiteBase):
    pass


class FindSite(FindBase, SiteBase):
    pass


class UpsertSite(SiteBase):
    pass


class FindSiteResult(FindResult):
    founds: Optional[List[Site]]
    search_options: Optional[SearchOptions]


class CustomResponse(GenericModel, Generic[DataT]):
    message: str
    data: Optional[DataT]
    status_code: int


T = TypeVar("T")


class CustomResponse1(BaseModel, Generic[T]):
    message: str
    data: T
    status_code: int


class PCRMetricsDetails(BaseModel):
    time: Optional[str]
    PCR: Optional[float]


class SiteDetails1(BaseModel):
    site_name: Optional[str] = None
    site_type: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    status: Optional[str] = None
    total_devices: Optional[str] = None


class SitePowerConsumptionResponse(BaseModel):
    total_power: Optional[float]
    average_power: Optional[float]
    total_cost: Optional[float]
    max_power: Optional[float]
    total_power_duration: Optional[str]


class EnergyConsumptionMetricsDetails(BaseModel):
    time: str
    energy_efficiency: Optional[float] = None
    total_POut: Optional[float] = None
    total_PIn: Optional[float] = None
    average_energy_consumed: Optional[float] = None
    power_efficiency: Optional[float] = None


class DeviceEnergyMetric(BaseModel):
    device_name: Optional[str] = None
    hardware_version: Optional[str] = None
    manufacturer: Optional[str] = None
    pn_code: Optional[str] = None
    serial_number: Optional[str] = None
    software_version: Optional[str] = None
    status: Optional[str] = None
    site_name: Optional[str] = None
    apic_controller_ip: Optional[str] = None
    PE: Optional[float] = None
    PUE: Optional[float] = None
    current_power: Optional[float] = None
    time: Optional[datetime] = None


class HourlyEnergyMetricsResponse(BaseModel):
    metrics: List[DeviceEnergyMetric]


class DevicePowerMetric(BaseModel):
    device_name: Optional[str] = None
    hardware_version: Optional[str] = None
    manufacturer: Optional[str] = None
    pn_code: Optional[str] = None
    serial_number: Optional[str] = None
    software_version: Optional[str] = None
    status: Optional[str] = None
    site_name: Optional[str] = None
    apic_controller_ip: Optional[str] = None
    total_power: Optional[float] = None
    max_power: Optional[float] = None
    current_power: Optional[float] = None
    time: Optional[datetime] = None


class HourlyDevicePowerMetricsResponse(BaseModel):
    metrics: List[DevicePowerMetric]


class DevicePowerConsumption(BaseModel):
    id: Optional[int] = None
    device_name: Optional[str] = None
    total_power: Optional[float] = None
    average_power: Optional[float] = None
    cost_of_power: Optional[float] = None
    ip_address: Optional[str] = None


class TopDevicesPowerResponse(BaseModel):
    top_devices: List[DevicePowerConsumption]


class TrafficThroughputMetricsDetails(BaseModel):
    time: str
    total_bytes_rate_last: Optional[float]
    energy_consumption: Optional[float]


from pydantic import BaseModel
from typing import List, Optional


class DeviceTrafficThroughputMetric1(BaseModel):
    device_name: Optional[str] = None
    hardware_version: Optional[str] = None
    manufacturer: Optional[str] = None
    pn_code: Optional[str] = None
    serial_number: Optional[str] = None
    software_version: Optional[str] = None
    status: Optional[str] = None
    site_name: Optional[str] = None
    apic_controller_ip: Optional[str] = None
    traffic_throughput: Optional[float] = None
    time: Optional[datetime] = None
    current_power: Optional[float] = None
    PE: Optional[float] = None


class TrafficThroughputMetricsResponse(BaseModel):
    metrics: List[DeviceTrafficThroughputMetric1]


class ComparisonDeviceMetricsDetails(BaseModel):
    device_name: Optional[str]
    time: Optional[str]
    total_power: Optional[float]


class ComparisonTrafficMetricsDetails(BaseModel):
    device_name: Optional[str]
    time: Optional[str]
    total_bytes_rate_last_gb: Optional[float]


class DevicePowerComparisonPercentage(BaseModel):
    device_name: Optional[str]
    average_power_percentage: Optional[float]


class CustomResponse100(BaseModel):
    message: str
    data: Dict[str, List[ComparisonDeviceMetricsDetails]]
    status_code: int


class PasswordGroupCreate(BaseModel):
    password_group_name: str
    password_group_type: str
    username: str
    password: str


class PasswordGroupResponse(BaseModel):
    id: int
    password_group_name: str
    password_group_type: str
    username: str
    password: str

    class Config:
        orm_mode = True


class PasswordGroupUpdate(BaseModel):
    password_group_name: str = None
    password_group_type: str = None
    username: str = None
    password: str = None


class APICControllersCreate(BaseModel):
    ip_address: str
    device_type: Optional[str]
    device_name: Optional[str]
    site_id: Optional[int]
    rack_id: Optional[int]
    rack_unit: Optional[int]
    password_group_id: Optional[int]


class APICControllersUpdate(BaseModel):
    ip_address: Optional[str]
    device_type: Optional[str]
    device_name: Optional[str]
    site_id: Optional[int]
    rack_id: Optional[int]
    rack_unit: Optional[int]
    password_group_id: Optional[int]


class APICControllersResponse(BaseModel):
    id: int
    ip_address: str
    device_type: Optional[str]
    device_name: Optional[str]
    site_name: Optional[str]
    rack_name: Optional[str]
    rack_unit: Optional[int]
    password_group_id: Optional[int]
    password_group_name: Optional[str]
    OnBoardingStatus: Optional[bool]

    class Config:
        orm_mode = True


class RackResponse(BaseModel):
    id: int
    rack_name: str

    class Config:
        orm_mode = True


class GetRacksResponse(BaseModel):
    racks: List[RackResponse]


class EnergyConsumptionMetricsDetails1(BaseModel):
    time: Optional[str] = None
    energy_consumption: Optional[float] = None
    total_POut: Optional[float] = None
    total_PIn: Optional[float] = None
    power_efficiency: Optional[float] = None


class DeviceEnergyDetailResponse123(BaseModel):
    device_name: Optional[str] = None
    hardware_version: Optional[str] = None
    manufacturer: Optional[str] = None
    pn_code: Optional[str] = None
    serial_number: Optional[str] = None
    software_version: Optional[str] = None
    status: Optional[str] = None
    site_name: Optional[str] = None
    apic_controller_ip: Optional[str] = None
    PE: Optional[float] = None
    PUE: Optional[float] = None
    current_power: Optional[float] = None
    time: Optional[datetime] = None
