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
    output: int


class DeviceDataResponse(BaseModel):
    data: list[PowerUsageRecord]


