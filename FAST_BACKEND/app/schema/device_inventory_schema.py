from pydantic import BaseModel
from datetime import datetime
from typing import Optional, TypeVar, Generic


class DeviceInventoryBase(BaseModel):
    cisco_domain: Optional[str]
    contract_expiry: Optional[datetime]
    contract_number: Optional[str]
    
    criticality: Optional[str]
    department: Optional[str]
    device_id: Optional[int]
    device_name: Optional[str]
    device_ru: Optional[int]
    domain: Optional[str]
    hardware_version: Optional[str]
    hw_eol_date: Optional[datetime]
    hw_eos_date: Optional[datetime]
    item_code: Optional[str]
    item_desc: Optional[str]
    manufacturer_date: Optional[datetime]
    manufacturer: Optional[str]
    modified_by: Optional[str]
    parent: Optional[str]
    patch_version: Optional[str]
    pn_code: Optional[str]
    site_id: Optional[int]
    rack_id: Optional[int]
    rfs_date: Optional[datetime]
    section: Optional[str]
    serial_number: Optional[str]
    software_version: Optional[str]
    source: Optional[str]
    stack: Optional[int]
    status: Optional[str]
    sw_eol_date: Optional[datetime]
    sw_eos_date: Optional[datetime]
    tag_id: Optional[str]

    
    hw_eol_ad: Optional[datetime]
    hw_eos: Optional[datetime]
    sw_EoSWM: Optional[datetime]
    hw_EoRFA: Optional[datetime]
    sw_EoVSS: Optional[datetime]
    hw_EoSCR: Optional[datetime]
    hw_ldos: Optional[datetime]

    apic_controller_id: Optional[int]


class DeviceInventoryCreate(DeviceInventoryBase):
    pass


class DeviceInventoryUpdate(DeviceInventoryBase):
    pass


class DeviceInventoryInDB(DeviceInventoryBase):
    id: int
    power_utilization: Optional[float]
    site_name: Optional[str]
    rack_name: Optional[str]
    device_ip: Optional[str]
    device_type: Optional[str]
    power_utilization: Optional[float]
    pue: Optional[float]
    power_input: Optional[float]
    datatraffic: Optional[float]
    created_at: Optional[datetime] = None
    

    
    class Config:
        orm_mode = True


T = TypeVar("T")


class Custom_Response_Inventory(BaseModel, Generic[T]):
    message: str
    data: T
    status_code: int

class modelCreate(BaseModel):
    site_id : Optional[int]
    rack_id : Optional[int]
    vendor_id : Optional[int]


#

import datetime

class FilterSchema(BaseModel):
    page:Optional[int]
    ip_address: Optional[str]
    device_name: Optional[str]
    serial_no: Optional[str]  # Serial numbers can be alphanumeric
    site_id: Optional[int]  # Dropdown
    rack_id: Optional[int]  # Dropdown
    vendor_id: Optional[int]  # Dropdown
    model_no: Optional[str]  # Dropdown
    device_type: Optional[int]  # Corrected syntax
    department: Optional[str]  # Corrected syntax
    sntc_date: Optional[str]  # Corrected Date type
    hardware_version: Optional[str] # Corrected
    software_version: Optional[str] # Corrected

