from sqlalchemy import Boolean, Column, Date, String, ForeignKey, DateTime, Integer
from sqlalchemy.orm import relationship
from .base_model import BaseModel


class DeviceInventory(BaseModel):
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
    device = relationship("Devices", backref="deviceInventory")


class DeviceSNTC(BaseModel):
    __tablename__ = 'devices_sntc'
    __table_args__ = {'extend_existing': True}  # This line prevents redefinition errors


    model_name = Column(String(255), nullable=True)
    hw_eol_ad = Column(Date, nullable=True)
    hw_eos = Column(Date, nullable=True)
    sw_EoSWM = Column(Date, nullable=True)
    hw_EoRFA = Column(Date, nullable=True)
    sw_EoVSS = Column(Date, nullable=True)
    hw_EoSCR = Column(Date, nullable=True)
    hw_ldos = Column(Date, nullable=True)
    


class Chassis(BaseModel):
    __tablename__ = 'chassis'

    # id = Column(Integer, primary_key=True, autoincrement=True)
    chassis_name = Column(String(255), nullable=True)
    hw_eol_ad = Column(Date, nullable=True)
    hw_eos = Column(Date, nullable=True)
    sw_EoSWM = Column(Date, nullable=True)
    hw_EoRFA = Column(Date, nullable=True)
    sw_EoVSS = Column(Date, nullable=True)
    hw_EoSCR = Column(Date, nullable=True)
    hw_ldos = Column(Date, nullable=True)

    # Define relationship with ChassisDevice
    chassis_devices = relationship("ChassisDevice", back_populates="chassis")
    chassis_power_supplies = relationship("ChassisPowerSupply", back_populates="chassis")
    chassis_fans = relationship("ChassisFan", back_populates="chassis")
    # chassis_modules = relationship("C", back_populates="chassis")
    chassis_modules = relationship("ChassisModule", back_populates="chassis")


class ChassisDevice(BaseModel):
    __tablename__ = 'chassis_devices'

    chassis_id = Column(Integer, ForeignKey('chassis.id'), nullable=True)
    device_sntc_id = Column(Integer, ForeignKey('devices_sntc.id'), nullable=True)
    device_slot = Column(String(255), nullable=True)
    PSIRT_Count = Column(String(255), nullable=True)

    # Define relationships
    chassis = relationship("Chassis", back_populates="chassis_devices")
    device_sntc = relationship("DevicesSntc", back_populates="chassis_devices")
#


class PowerSupply(BaseModel):
    __tablename__ = 'power_supply'
    # id = Column(Integer, primary_key=True)
    power_supply_name = Column(String(255), nullable=True)
    hw_eol = Column(Date, nullable=True)
    hw_eos = Column(Date, nullable=True)
    sw_EoSWM = Column(Date, nullable=True)
    hw_EoRFA = Column(Date, nullable=True)
    sw_EoVSS = Column(Date, nullable=True)
    hw_EoSCR = Column(Date, nullable=True)
    hw_ldos = Column(Date, nullable=True)
    hardware_version = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)

    chassis_power_supplies = relationship("ChassisPowerSupply", back_populates="power_supply")

class ChassisPowerSupply(BaseModel):
    __tablename__ = 'chassis_power_supply'


    chassis_id = Column(Integer, ForeignKey('chassis.id'), nullable=True)
    power_supply_id = Column(Integer, ForeignKey('power_supply.id'), nullable=True)
    ps_slot = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)
    chassis = relationship("Chassis", back_populates="chassis_power_supplies")
    power_supply = relationship("PowerSupply", back_populates="chassis_power_supplies")
#
class ChassisFan(BaseModel):
    __tablename__ = 'chassis_fan'


    chassis_id = Column(Integer, ForeignKey('chassis.id'), nullable=True)
    fan_id = Column(Integer, ForeignKey('fan.id'), nullable=True)
    fan_slot = Column(String(255), nullable=True)
    serial_number = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)
    # Define relationships
    chassis = relationship("Chassis", back_populates="chassis_fans")
    fan = relationship("Fan", back_populates="chassis_fans")

class Fan(BaseModel):
    __tablename__ = 'fan'

    # id = Column(Integer, primary_key=True)
    fan_name = Column(String(255), nullable=True)
    hw_eol = Column(Date, nullable=True)
    hw_eos = Column(Date, nullable=True)
    sw_EoSWM = Column(Date, nullable=True)
    hw_EoRFA = Column(Date, nullable=True)
    sw_EoVSS = Column(Date, nullable=True)
    hw_EoSCR = Column(Date, nullable=True)
    hw_ldos = Column(Date, nullable=True)
    hardware_version = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)

    # Define relationship with ChassisFan
    chassis_fans = relationship("ChassisFan", back_populates="fan")


class Module(BaseModel):
    __tablename__ = 'modules'

    module_name = Column(String(255), nullable=True)
    hw_eol_ad = Column(Date, nullable=True)
    hw_eos = Column(Date, nullable=True)
    sw_EoSWM = Column(Date, nullable=True)
    hw_EoRFA = Column(Date, nullable=True)
    sw_EoVSS = Column(Date, nullable=True)
    hw_EoSCR = Column(Date, nullable=True)
    hw_ldos = Column(Date, nullable=True)
    hardware_version = Column(String(255), nullable=True)
    software_version = Column(String(255), nullable=True)
    serial_number = Column(String(500), nullable=True)
      # Define the back reference from the Module model to the ChassisModule model
    chassis_modules = relationship("ChassisModule", back_populates="module")

class ChassisModule(BaseModel):
    __tablename__ = 'chassis_module'

    chassis_id = Column(Integer, ForeignKey('chassis.id'))
    modules_id = Column(Integer, ForeignKey('modules.id'))
    modules_slot = Column(String(255))
    serial_number = Column(String(255))
    software_version = Column(String(255))

    chassis = relationship("Chassis", back_populates="chassis_modules")
    module = relationship("Module", back_populates="chassis_modules")



