from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean, Date, Text
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

Base = declarative_base()

class Site(Base):
    __tablename__ = 'site'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    site_name = Column(String(255), nullable=False)
    site_type = Column(String(255), nullable=True)
    region = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    latitude = Column(String(255), nullable=True)
    longitude = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(Integer, nullable=True)

    # Relationships
    racks = relationship("Rack", back_populates="site", cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="site", cascade="all, delete-orphan")
    device_inventory = relationship("DeviceInventory", back_populates="site", cascade="all, delete-orphan")


class Rack(Base):
    __tablename__ = 'rack'

    id = Column(Integer, primary_key=True, autoincrement=True)
    rack_name = Column(String(255), nullable=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=False)
    manufacture_date = Column(Date, nullable=True)
    unit_position = Column(Integer, nullable=True)
    rack_model = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    Ru = Column(Integer, nullable=True)
    RFS = Column(String(255), nullable=True)
    height = Column(Integer, nullable=True)
    width = Column(Integer, nullable=True)
    depth = Column(Integer, nullable=True)
    tag_id = Column(String(255), nullable=True)
    floor = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    site = relationship("Site", back_populates="racks")
    devices = relationship("Device", back_populates="rack", cascade="all, delete-orphan")
    device_inventory = relationship("DeviceInventory", back_populates="rack", cascade="all, delete-orphan")


class PasswordGroup(Base):
    __tablename__ = 'password_groups'

    id = Column(Integer, primary_key=True, autoincrement=True)
    password_group_name = Column(String(255), nullable=False)
    password_group_type = Column(String(255), nullable=True)
    username = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    devices = relationship("Device", back_populates="password_group", cascade="all, delete-orphan")


class Vendor(Base):
    __tablename__ = "vendor"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_name = Column(String(255), nullable=False)

    # Relationships
    devices = relationship("Device", back_populates="vendor", cascade="all, delete-orphan")
    device_types = relationship("DeviceType", back_populates="vendor", cascade="all, delete-orphan")


class DeviceType(Base):
    __tablename__ = "device_type"

    id = Column(Integer, primary_key=True, autoincrement=True)
    device_type = Column(String(255), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendor.id"), nullable=False)

    # Relationships
    vendor = relationship("Vendor", back_populates="device_types")
    devices = relationship("Device", back_populates="device_type_rel", cascade="all, delete-orphan")


class Device(Base):
    __tablename__ = "Devices"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ip_address = Column(String(255), unique=False, index=True)
    device_type = Column(String(255), nullable=True)
    device_name = Column(String(255), nullable=True)
    device_nature = Column(String(255), nullable=True)
    OnBoardingStatus = Column(Boolean, nullable=True, default=False)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    rack_unit = Column(Integer, nullable=True)
    password_group_id = Column(Integer, ForeignKey('password_groups.id'), nullable=True)
    node_id = Column(Integer, nullable=True)
    messages = Column(Text, nullable=True)
    collection_status = Column(Boolean, nullable=True, default=True)
    device_type_id = Column(Integer, ForeignKey('device_type.id'), nullable=True)
    vendor_id = Column(Integer, ForeignKey('vendor.id'), nullable=True)

    # Relationships
    rack = relationship("Rack", back_populates="devices")
    site = relationship("Site", back_populates="devices")
    password_group = relationship("PasswordGroup", back_populates="devices")
    vendor = relationship("Vendor", back_populates="devices")
    device_type_rel = relationship("DeviceType", back_populates="devices")


class APICController(Base):
    __tablename__ = 'apic_controllers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    ip_address = Column(String(255), nullable=False)

    # Relationships
    device_inventory = relationship("DeviceInventory", back_populates="apic_controller", cascade="all, delete-orphan")


class DeviceInventory(Base):
    __tablename__ = 'deviceInventory'

    id = Column(Integer, primary_key=True, autoincrement=True)
    cisco_domain = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    criticality = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    device_id = Column(Integer, ForeignKey('Devices.id'), nullable=True)
    device_name = Column(String(255), nullable=True)
    device_ru = Column(Integer, nullable=True)
    domain = Column(String(255), nullable=True)
    hardware_version = Column(String(255), nullable=True)
    item_desc = Column(Text, nullable=True)
    manufacturer_date = Column(Date, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    stack=Column(Integer, nullable=True)
    modified_by = Column(String(255), nullable=True)
    apic_controller_id = Column(Integer, ForeignKey('apic_controllers.id'), nullable=False)
    pn_code = Column(String(255), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    rfs_date = Column(Date, nullable=True)
    section = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    software_version = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    stack=Column(Boolean, nullable=True)
    error_message= Column(String(1000), nullable=True)
    role = Column(String(255), nullable=True)
    psu_model = Column(String(100), nullable=True)
    psu_count = Column(Integer, nullable=True)
    total_power_capacity = Column(Integer, nullable=True)
    command=Column(String(100), nullable=True)

    # Relationships
    apic_controller = relationship("APICController", back_populates="device_inventory")
    rack = relationship("Rack", back_populates="device_inventory")
    site = relationship("Site", back_populates="device_inventory")
    device = relationship("Device", backref="device_inventory")


# If needed, define your database engine here
# engine = create_engine("sqlite:///database.db", echo=True)
# Base.metadata.create_all(engine)
