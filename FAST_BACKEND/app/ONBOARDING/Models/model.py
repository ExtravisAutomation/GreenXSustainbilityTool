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
    unit_position = Column(Integer, nullable=True)
    rack_model = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    Ru = Column(Integer, nullable=True)
    RFS = Column(String(255), nullable=True)
    Height = Column(Integer, nullable=True)
    Width = Column(Integer, nullable=True)
    Depth = Column(Integer, nullable=True)
    Tag_id = Column(String(255), nullable=True)
    floor = Column(Integer, nullable=True)
    status = Column(String(255), nullable=True)
    total_devices = Column(Integer, nullable=True)

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
    __tablename__ = 'Devices'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ip_address = Column(String(255))
    device_type = Column(String(200))
    device_name = Column(String(200))
    OnBoardingStatus = Column(Boolean, default=False)
    site_id = Column(Integer, ForeignKey('site.id'))
    rack_id = Column(Integer, ForeignKey('rack.id'))
    rack_unit = Column(Integer)
    credential_id  = Column(Integer)
    node_id=Column(Integer)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())
    password_group_id = Column(Integer, ForeignKey('password_groups.id'))

    # Relationships
    site = relationship("Site")
    rack = relationship("Rack")
    password_group = relationship("PasswordGroup")
class APICController(Base):
    __tablename__ = 'apic_controllers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    ip_address = Column(String(255), nullable=False)

# class DeviceInventory(Base):
#     __tablename__ = 'deviceinventoryy'
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     cisco_domain = Column(String(255), nullable=True)
#     created_by = Column(String(255), nullable=True)
#     criticality = Column(String(255), nullable=True)
#     department = Column(String(255), nullable=True)
#     device_id = Column(Integer, nullable=True)
#     device_name = Column(String(255), nullable=True)
#     device_ru = Column(Integer, nullable=True)
#     domain = Column(String(255), nullable=True)
#     hardware_version = Column(String(255), nullable=True)
#     item_desc = Column(Text, nullable=True)
#     manufacturer_date = Column(Date, nullable=True)
#     manufacturer = Column(String(255), nullable=True)
#     modified_by = Column(String(255), nullable=True)
#     apic_controller_id = Column(Integer, ForeignKey('apic_controllers.id'), nullable=False)
#     pn_code = Column(String(255), nullable=True)
#     rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
#     rfs_date = Column(Date, nullable=True)
#     section = Column(String(255), nullable=True)
#     serial_number = Column(String(255), nullable=True)
#     site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
#     software_version = Column(String(255), nullable=True)
#     status = Column(String(255), nullable=True)
#     tag_id = Column(String(255), nullable=True)
#
#     # Define relationships
#     apic_controller = relationship("APICController", backref="deviceInventory")
#     rack = relationship("Rack", backref="deviceInventory")
#     site = relationship("Site", backref="deviceInventory")
class DeviceInventory(Base):
    __tablename__ = 'deviceInventory'

    id = Column(Integer, primary_key=True, autoincrement=True)
    cisco_domain = Column(String(255), nullable=True)
    contract_expiry = Column(Date, nullable=True)
    contract_number = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    criticality = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    device_id = Column(Integer, nullable=True)
    device_name = Column(String(255), nullable=True)
    device_ru = Column(Integer, nullable=True)
    domain = Column(String(255), nullable=True)
    hardware_version = Column(String(255), nullable=True)
    hw_eol_date = Column(Date, nullable=True)
    hw_eos_date = Column(Date, nullable=True)
    item_code = Column(String(255), nullable=True)
    item_desc = Column(Text, nullable=True)
    manufacturer_date = Column(Date, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    modified_by = Column(String(255), nullable=True)
    apic_controller_id = Column(Integer, ForeignKey('apic_controllers.id'), nullable=False)
    parent = Column(String(255), nullable=True)
    patch_version = Column(String(255), nullable=True)
    pn_code = Column(String(255), nullable=True)
    rack_id = Column(Integer, ForeignKey('rack.id'), nullable=True)
    rfs_date = Column(Date, nullable=True)
    section = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    site_id = Column(Integer, ForeignKey('site.id'), nullable=True)
    software_version = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    stack = Column(Boolean, nullable=True)
    status = Column(String(255), nullable=True)
    sw_eol_date = Column(Date, nullable=True)
    sw_eos_date = Column(Date, nullable=True)
    tag_id = Column(String(255), nullable=True)
    role = Column(String(255),nullable=True)

    # Define relationships
    apic_controller = relationship("APICController", backref="deviceInventory")
    rack = relationship("Rack", backref="deviceInventory")
    site = relationship("Site", backref="deviceInventory")