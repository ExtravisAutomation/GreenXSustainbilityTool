from sqlalchemy import Column, String, ForeignKey, DateTime, Integer
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class DeviceInventory(BaseModel):
    __tablename__ = "deviceInventory"

    cisco_domain = Column(String(255), nullable=True)
    contract_expiry = Column(DateTime, nullable=True)
    contract_number = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    criticality = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    device_id = Column(Integer, nullable=True)
    device_name = Column(String(255), nullable=True)
    device_ru = Column(Integer, nullable=True)
    domain = Column(String(255), nullable=True)
    hardware_version = Column(String(255), nullable=True)
    hw_eol_date = Column(DateTime, nullable=True)
    hw_eos_date = Column(DateTime, nullable=True)
    item_code = Column(String(255), nullable=True)
    item_desc = Column(String(3000), nullable=True)
    manufacturer_date = Column(DateTime, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    modified_by = Column(String(255), nullable=True)
    parent = Column(String(255), nullable=True)
    patch_version = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)
    rack_id = Column (Integer, ForeignKey('rack.id'))
    rfs_date = Column(DateTime, nullable=True)
    section = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    site_id = Column(Integer, ForeignKey('site.id'))
    software_version = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    stack = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)
    sw_eol_date = Column(DateTime, nullable=True)
    sw_eos_date = Column(DateTime, nullable=True)
    tag_id = Column(String(255), nullable=True)
    power_utilization = None
    apic_controller_id = Column(Integer, ForeignKey('apic_controllers.id'))
    apic_controller = relationship("APICController", back_populates="deviceInventory")
