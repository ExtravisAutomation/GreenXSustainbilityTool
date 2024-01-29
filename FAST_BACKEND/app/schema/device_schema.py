from datetime import datetime

from pydantic import BaseModel


class MonitorDeviceRequest(BaseModel):
    ip: str
    username: str
    password: str
    command: str


class PowerUsageData(BaseModel):
    ip: str
    output: int



class PowerUsageRecord(BaseModel):
    ip: str
    time: datetime
    #output: int
    power_capacity: int
    power_input_cumulative: int
    power_output: int
    power_input: int
    power_allocated: int
    power_available_for_add_module: int


class DeviceDataResponse(BaseModel):
    data: list[PowerUsageRecord]


