from datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean,Date,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()
class Site(Base):
    __tablename__ = 'site'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=True, default=datetime.now)
    updated_at = Column(DateTime, nullable=True, default=datetime.now, onupdate=datetime.now)
    site_name = Column(String(255), nullable=True)
    site_type = Column(String(255), nullable=True)
    region = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    latitude = Column(String(255), nullable=True)
    longitude = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(String(255), nullable=True)

class Rack(Base):
    __tablename__ = 'rack'

    id = Column(Integer, primary_key=True, autoincrement=True)
    rack_name = Column(String(255), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=False)  # Foreign key referencing Site.id
    manufacture_date = Column(Date, nullable=True)
    rack_model = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    RFS = Column(String(255), nullable=True)
    Height = Column(Integer, nullable=True)
    Width = Column(Integer, nullable=True)
    Depth = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)

    created_at = Column(DateTime, nullable=True, default=datetime.now())
    updated_at = Column(DateTime, nullable=True, default=None, onupdate=datetime.now)


class PasswordGroup(Base):
    __tablename__ = 'password_groups'

    id = Column(Integer, primary_key=True, autoincrement=True)
    password_group_name = Column(String(255))
    password_group_type = Column(String(255))
    username = Column(String(255))
    password = Column(String(255))
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

class Device(Base):
    __tablename__ = 'devices'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ip_address = Column(String(255))
    device_name = Column(String(200))
    OnBoardingStatus = Column(Boolean, default=False)
    site_id = Column(Integer, ForeignKey('site.id'))
    rack_id = Column(Integer, ForeignKey('rack.id'))
    messages = Column(String(1000), nullable=True)
    node_id=Column(Integer)
    collection_status = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())
    password_group_id = Column(Integer, ForeignKey('password_groups.id'))
    device_type_id = Column(Integer, ForeignKey('device_type.id'), nullable=True)  # Added device_type_id
    vendor_id = Column(Integer, ForeignKey('vendor.id'), nullable=True)

    # Relationships
    site = relationship("Site")
    rack = relationship("Rack")
    password_group = relationship("PasswordGroup")

    vendor = relationship("Vendor", back_populates="devices")
    device_type_rel = relationship("DeviceType", back_populates="devices")

class Vendor(Base):
    __tablename__ = "vendor"
    id = Column(Integer, primary_key=True)
    vendor_name = Column(String(200), nullable=True)
    devices = relationship("Device", back_populates="vendor")
    devices1 = relationship("DeviceType", back_populates="vendor")


class DeviceType(Base):
    __tablename__ = "device_type"
    id = Column(Integer, primary_key=True, autoincrement=True)
    device_type = Column(String(255), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendor.id"), nullable=False)
    vendor = relationship("Vendor", back_populates="devices1")
    devices = relationship("Device", back_populates="device_type_rel")
class APICController(Base):
    __tablename__ = 'apic_controllers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    ip_address = Column(String(255), nullable=False)

class DeviceInventory(Base):
    __tablename__ = 'deviceInventory'

    id = Column(Integer, primary_key=True, autoincrement=True)
    contract_expiry = Column(Date, nullable=True)
    contract_number = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    device_id = Column(Integer, ForeignKey('devices.id'), nullable=True)
    domain = Column(String(255), nullable=True)
    hardware_version = Column(String(255), nullable=True)
    manufacturer_date = Column(Date, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)
    rfs_date = Column(Date, nullable=True)
    serial_number = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    stack = Column(Boolean, nullable=True)
    error_message = Column(String(1000), nullable=True)
    active_psu = Column(Integer, nullable=True)
    non_active_psu = Column(Integer, nullable=True)
    switch_topology = Column(String(100), nullable=True)
    switch_mode = Column(String(100), nullable=True)
    role = Column(String(255), nullable=True)
    psu_model = Column(String(100), nullable=True)
    command = Column(String(100), nullable=True)
    psu_count = Column(Integer, nullable=True)
    total_power_capacity = Column(Integer, nullable=True)
    total_interface = Column(Integer, nullable=True)
    up_link = Column(Integer, nullable=True)
    down_link = Column(Integer, nullable=True)
    access_port = Column(Integer, nullable=True)
    bandwidth = Column(Integer, nullable=True)
    up_Link_interfaces = Column(String(1000), nullable=True)
    interfaces_types = Column(String(1000), nullable=True)
    device = relationship("Device", backref="deviceInventory")