from sqlalchemy import Column, String, Integer, DateTime, Date, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class DeviceInventories(BaseModel):
    __tablename__ = "Inventory"

    cisco_domain = Column(String(255), nullable=True)
    contract_expiry = Column(Date, nullable=True)
    contract_number = Column(String(255), nullable=True)
    device_UID = Column(Integer, nullable=True)
    created_by = Column(String(255), nullable=True)
    creation_date = Column(DateTime, nullable=True)
    criticality = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    device_ru = Column(Integer, nullable=True)
    domain = Column(String(255), nullable=True)
    hardware_version = Column(String(255), nullable=True)
    hw_eol_date = Column(Date, nullable=True)
    hw_eos_date = Column(Date, nullable=True)
    item_code = Column(String(255), nullable=True)
    item_desc = Column(Text, nullable=True)
    manufacturer_date = Column(Date, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    modification_date = Column(DateTime, nullable=True)
    modified_by = Column(String(255), nullable=True)
    parent = Column(String(255), nullable=True)
    patch_version = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)
    rfs_date = Column(Date, nullable=True)
    section = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    stack = Column(Boolean, nullable=True)
    status = Column(String(255), nullable=True)
    sw_eol_date = Column(Date, nullable=True)
    sw_eos_date = Column(Date, nullable=True)
    tag_id = Column(String(255), nullable=True)

    Device_id = Column(Integer, ForeignKey('Devices.id'), nullable=False)
    device = relationship("APICControllers", back_populates="inventories")