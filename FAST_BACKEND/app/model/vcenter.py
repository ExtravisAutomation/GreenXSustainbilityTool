from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, String, Integer, Text
from app.model.base_model import BaseModel
from typing import List
from sqlalchemy.orm import relationship
import datetime

class HostStorageAdapters(BaseModel):
    __tablename__ = 'host_storage_adapters'
    id = Column(Integer, primary_key=True, autoincrement=True)
    model = Column(String(255))
    driver = Column(String(255))
    storage_key = Column(String(255))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
    
class HostPhysicalNetworkAdapters(BaseModel):
    __tablename__ = 'host_physical_network_adapters'
    id = Column(Integer, primary_key=True, autoincrement=True)
    device = Column(String(255))
    mac = Column(String(255))
    driver = Column(String(255))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
    
class HostDatastores(BaseModel):
    __tablename__ = 'host_datastores'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    capacity = Column(String(255))
    free_space = Column(String(255))
    type = Column(String(255))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
    

class HostNetworking(BaseModel):
    __tablename__ = 'host_networking'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
    
class HostAdapters(BaseModel):
    __tablename__ = 'host_adapters'
    id = Column(Integer, primary_key=True, autoincrement=True)
    adapter_id = Column(String(255))
    device_id = Column(Integer)
    device_name = Column(String(255))
    vendor_id = Column(Integer)
    vendor_name = Column(String(255))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
class HostDetails(BaseModel):
    __tablename__ = 'host_details'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(500))
    host_name = Column(String(255))
    ip_address = Column(String(15))
    dns_servers = Column(Text)
    default_gateway = Column(String(15))
    ipv6_enabled = Column(Boolean)
    version = Column(String(50))
    state = Column(String(50))
    manufacturer = Column(String(100))
    model = Column(String(100))
    total_cpu_mhz = Column(Float)
    total_memory_gb = Column(Float)
    virtual_flash = Column(Float)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
    
class HostCPUModel(BaseModel):
    __tablename__ = 'host_cpu_model'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(500))
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    
class VCenterVMs(BaseModel):
    __tablename__ = 'vcenter_vm_details'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True)
    guest_os = Column(String(255), nullable=True)
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(15), nullable=True)
    num_cpus = Column(Integer, nullable=True)
    processor_type = Column(String(255), nullable=True)
    num_disks = Column(Integer, nullable=True)
    compatibility = Column(String(255), nullable=True)
    total_memory_GB = Column(Float, nullable=True)
    total_disk_GB = Column(Float, nullable=True)
    vmware_tools = Column(String(500), nullable=True)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    
    
class VMHardDisk(BaseModel):
    __tablename__ = 'vm_harddisk'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    size_MB = Column(Float, nullable=True)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))

class VMNetworkAdapters(BaseModel):
    __tablename__ = 'vm_network_adapters'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    network = Column(String(255), nullable=True)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))

class VMOtherHardware(BaseModel):
    __tablename__ = 'vm_other_hardware'

    id = Column(Integer, primary_key=True, autoincrement=True)
    hardware_name = Column(String(255), nullable=True)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))

class VMUSBController(BaseModel):
    __tablename__ = 'vm_usb_controller'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    vcenter_id = Column(Integer, ForeignKey('vcenter.id'))