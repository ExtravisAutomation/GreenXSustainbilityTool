from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class FabricNodeBase(BaseModel):
    name: Optional[str]
    role: Optional[str]
    adStatus: Optional[str]
    address: Optional[str]
    model: Optional[str]
    serial: Optional[str]
    version: Optional[str]
    pod: Optional[int]
    node: Optional[int]
    mod_ts: Optional[datetime]
    status: Optional[str]
    vendor: Optional[str]
    last_state_mod_ts: Optional[datetime]
    delayed_heartbeat: Optional[str]
    fabric_status: Optional[str]
    apic_controller_id: Optional[int]


class FabricNodeCreate(FabricNodeBase):
    pass


class FabricNode(FabricNodeBase):
    id: int

    class Config:
        orm_mode = True


class ExtendedFabricNode(FabricNode):
    power_utilization: float = Field(None, description="The power utilization calculated from InfluxDB data")

    class Config:
        orm_mode = True


class FabricNodeResponse(BaseModel):
    message: str
    data: List[FabricNode]
    status_code: int


class FabricNode(BaseModel):
    id: int
    name: str
    role: Optional[str] = None
    adStatus: Optional[str] = None
    address: Optional[str] = None
    model: Optional[str] = None
    serial: Optional[str] = None
    version: Optional[str] = None
    pod: Optional[int] = None
    node: Optional[int] = None
    mod_ts: Optional[datetime] = None
    status: Optional[str] = None
    vendor: Optional[str] = None
    last_state_mod_ts: Optional[datetime] = None
    delayed_heartbeat: Optional[str] = None
    fabric_status: Optional[str] = None
    apic_controller_id: int

    class Config:
        orm_mode = True


class FabricNodeDetails(BaseModel):
    id: int
    name: str
    role: Optional[str] = None
    adStatus: Optional[str] = None
    address: Optional[str] = None
    model: Optional[str] = None
    serial: Optional[str] = None
    version: Optional[str] = None
    pod: Optional[int] = None
    node: Optional[int] = None
    mod_ts: Optional[datetime] = None
    status: Optional[str] = None
    vendor: Optional[str] = None
    last_state_mod_ts: Optional[datetime] = None
    delayed_heartbeat: Optional[str] = None
    fabric_status: Optional[str] = None
    apic_controller_id: int
    apic_controller_ip: Optional[str] = None

    class Config:
        orm_mode = True