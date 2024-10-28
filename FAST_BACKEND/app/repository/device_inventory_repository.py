import sys
from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi import HTTPException
from app.model.rack import Rack
from app.model.site import Site
from app.model.DevicesSntc import DevicesSntc as DeviceSNTC
from app.repository.InfluxQuery import get_24hDevice_dataTraffic, get_24hDevice_power, get_device_power
from app.model.device_inventory import ChassisFan, ChassisModule, ChassisPowerSupply, DeviceInventory, ChassisDevice
from app.model.apic_controller import APICController
from app.model.APIC_controllers import APICControllers
from app.repository.base_repository import BaseRepository


class DeviceInventoryRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], influxdb_repository):
        super().__init__(session_factory, DeviceInventory)
        self.influxdb_repository = influxdb_repository

    def get_all_devices(self) -> List[DeviceInventory]:
        with self.session_factory() as session:
            return session.query(DeviceInventory) \
                .options(joinedload(DeviceInventory.site), joinedload(DeviceInventory.rack)) \
                .all()

    def get_device_by_id(self, device_id: int) -> DeviceInventory:
        with self.session_factory() as session:
            device = session.get(DeviceInventory, device_id)
            if not device:
                raise HTTPException(status_code=404, detail="Device not found")
            return device

    def add_device(self, device_data) -> DeviceInventory:
        with self.session_factory() as session:
            new_device = DeviceInventory(**device_data.dict())
            session.add(new_device)
            session.commit()
            session.refresh(new_device)
            return new_device

    def update_device(self, device_id: int, device_data) -> DeviceInventory:
        with self.session_factory() as session:
            device = session.get(DeviceInventory, device_id)
            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            for key, value in device_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(device, key, value)

            session.commit()
            session.refresh(device)
            return device

    def delete_device(self, device_id: int):
        with self.session_factory() as session:
            device = session.get(DeviceInventory, device_id)
            if device is None:
                raise HTTPException(status_code=404, detail="Device not found")
            session.delete(device)
            session.commit()

    def get_device_inventory_with_power_utilization(self) -> List[DeviceInventory]:
        try:
            with self.session_factory() as session:
                devices = session.query(DeviceInventory).all()
                for device in devices:
                    try:
                        if device.apic_controller:
                            drawn_avg, supplied_avg = self.influxdb_repository.get_power_data(device.apic_controller.ip_address)
                            if drawn_avg is not None and supplied_avg is not None and supplied_avg > 0:
                                device.power_utilization = (drawn_avg / supplied_avg) * 100
                        else:
                            print(f"No associated APIC controller for device {device.device_name}", file=sys.stderr)
                    except Exception as e:
                        print(f"Error while fetching power data for device {device.device_name}: {e}", file=sys.stderr)
                return devices
        except Exception as e:
            print(f"Error while fetching devices: {e}", file=sys.stderr)
            raise HTTPException(status_code=500, detail=f"Error while fetching devices: {e}")


    def chasis(self):
        with self.session_factory() as session:
            # Fetch all chassis devices with related chassis data and pre-load related DeviceSNTC data
            chassis_devices = session.query(ChassisDevice).options(
                joinedload(ChassisDevice.chassis),
                selectinload(ChassisDevice.device_sntc)
            ).all()

            enriched_chassis_devices = []

            for chasis_device in chassis_devices:
                chassis = chasis_device.chassis
                device_sntc = chasis_device.device_sntc

                # Check if device_sntc is loaded and has a model_name, safely access model_name
                model_name = device_sntc.model_name if device_sntc else None

                device_details = {
                    "id": chasis_device.id,
                    "chassis_id": chasis_device.chassis_id,
                    "devices_model": model_name,
                    "device_slot": chasis_device.device_slot,
                    "PSIRT_Count": chasis_device.PSIRT_Count,
                    "hw_eol_ad": chassis.hw_eol_ad if chassis else None,
                    "hw_eos": chassis.hw_eos if chassis else None,
                    "sw_EoSWM": chassis.sw_EoSWM if chassis else None,
                    "hw_EoRFA": chassis.hw_EoRFA if chassis else None,
                    "sw_EoVSS": chassis.sw_EoVSS if chassis else None,
                    "hw_EoSCR": chassis.hw_EoSCR if chassis else None,
                    "hw_ldos": chassis.hw_ldos if chassis else None
                }

                enriched_chassis_devices.append(device_details)

            return enriched_chassis_devices
        
        
        
    def modules(self):
        with self.session_factory() as session:
            # Fetch all chassis-module relationships with pre-loaded Module and Chassis data
            chassis_modules = session.query(ChassisModule).options(
                joinedload(ChassisModule.module),
                joinedload(ChassisModule.chassis)
            ).all()

            enriched_modules = []

            # Iterate over ChassisModule entries to construct the output data
            for chassis_module in chassis_modules:
                module = chassis_module.module  # Get the related Module
                chassis = chassis_module.chassis  # Get the related Chassis

                # Create a dictionary for each module containing all relevant details
                module_details = {
                    "module_id": module.id if module else None,
                    "module_name": module.module_name if module else "Unknown",
                    "hardware_version": module.hardware_version if module else None,
                    "software_version": module.software_version if module else None,
                    "chassis_id": chassis.id if chassis else None,
                    "chassis_name": chassis.chassis_name if chassis else "Unknown",
                    "modules_slot": chassis_module.modules_slot,
                    "serial_number": chassis_module.serial_number,
                    "hw_eol_ad": module.hw_eol_ad if module and module.hw_eol_ad else None,
                    "hw_eos": module.hw_eos if module and module.hw_eos else None,
                    "sw_EoSWM": module.sw_EoSWM if module and module.sw_EoSWM else None,
                    "hw_EoRFA": module.hw_EoRFA if module and module.hw_EoRFA else None,
                    "sw_EoVSS": module.sw_EoVSS if module and module.sw_EoVSS else None,
                    "hw_EoSCR": module.hw_EoSCR if module and module.hw_EoSCR else None,
                    "hw_ldos": module.hw_ldos if module and module.hw_ldos else None
                }
                enriched_modules.append(module_details)

            return enriched_modules
        
        
    def power_supply(self):
        with self.session_factory() as session:
            # Fetch all chassis power supply records with related power supply data efficiently
            chassis_power_supplies = session.query(ChassisPowerSupply).options(
                joinedload(ChassisPowerSupply.power_supply),
                joinedload(ChassisPowerSupply.chassis)
            ).all()

            # List to hold enhanced power supply details
            enriched_power_supplies = []

            for cps in chassis_power_supplies:
                power_supply = cps.power_supply

                # Prepare a dictionary to capture details about each power supply along with its chassis information
                power_supply_details = {
                    "id": cps.id,
                    "chassis_id": cps.chassis_id,
                    "power_supply_id": cps.power_supply_id,
                    "power_supply_name": power_supply.power_supply_name if power_supply else None,
                    "ps_slot": cps.ps_slot,
                    "serial_number": cps.serial_number,
                    "hardware_version": power_supply.hardware_version if power_supply else None,
                    "software_version": cps.software_version,
                    "hw_eol_ad": power_supply.hw_eol if power_supply else None,
                    "hw_eos": power_supply.hw_eos if power_supply else None,
                    "sw_EoSWM": power_supply.sw_EoSWM if power_supply else None,
                    "hw_EoRFA": power_supply.hw_EoRFA if power_supply else None,
                    "sw_EoVSS": power_supply.sw_EoVSS if power_supply else None,
                    "hw_EoSCR": power_supply.hw_EoSCR if power_supply else None,
                    "hw_ldos": power_supply.hw_ldos if power_supply else None,
                    "chassis_name": cps.chassis.chassis_name if cps.chassis else None  # assuming Chassis has a 'chassis_name' attribute
                }

                # Add the detailed record to the list
                enriched_power_supplies.append(power_supply_details)

            return enriched_power_supplies
        
        
    def fans(self):
        with self.session_factory() as session:
            # Fetch all chassis fan records with related fan data efficiently
            chassis_fans = session.query(ChassisFan).options(
                joinedload(ChassisFan.fan),
                joinedload(ChassisFan.chassis)
            ).all()

            enriched_fans = []

            for chassis_fan in chassis_fans:
                fan = chassis_fan.fan

                fan_details = {
                    "id": chassis_fan.id,
                    "chassis_id": chassis_fan.chassis_id,
                    "fan_id": chassis_fan.fan_id,
                    "fan_name": fan.fan_name if fan else None,
                    "fan_slot": chassis_fan.fan_slot,
                    "serial_number": chassis_fan.serial_number,
                    "hardware_version": fan.hardware_version if fan else None,
                    "software_version": chassis_fan.software_version,
                    "hw_eol_ad": fan.hw_eol if fan else None,
                    "hw_eos": fan.hw_eos if fan else None,
                    "sw_EoSWM": fan.sw_EoSWM if fan else None,
                    "hw_EoRFA": fan.hw_EoRFA if fan else None,
                    "sw_EoVSS": fan.sw_EoVSS if fan else None,
                    "hw_EoSCR": fan.hw_EoSCR if fan else None,
                    "hw_ldos": fan.hw_ldos if fan else None,
                    "chassis_name": chassis_fan.chassis.chassis_name if chassis_fan.chassis else None  # Assuming Chassis has a 'chassis_name' attribute
                }

                enriched_fans.append(fan_details)

            return enriched_fans
        
        
        
    def device_power(self, apic_api: str):
        with self.session_factory() as session:
            response = []
            rack_data=get_device_power(apic_api)
            for data in rack_data:
                result = session.query(APICControllers.device_name).filter(
                    APICControllers.ip_address == apic_api).first()
                response.append({
                    'apic_controller_ip': apic_api,
                    'apic_controller_name':result[0],
                    'power_utilization': data['power_utilization']
                })
                
            return response
        
        
    def get_spcific_devices(self, device_ip: str):
        with self.session_factory() as session:
            query = session.query(DeviceInventory).filter(APICController.ip_address == device_ip)
            device = query.first()
            print("Here we are")
            # return device
            # exit()

            # device_ip = session.query(Devices.ip_address).filter(Devices.id == device.apic_controller_id).first()

            power = get_24hDevice_power(device_ip )
            datatraffic = get_24hDevice_dataTraffic(device_ip)
                # powerIn = get_24hDevice_powerIn(ip)

            rack = session.query(Rack.rack_name).filter(Rack.id == device.rack_id).first()
            site = session.query(Site.site_name).filter(Site.id == device.site_id).first()
            device.power_utilization = power[0]['power_utilization'] if power else None
            total_power_input = power[0]['total_supplied']
            device.power_input = round(total_power_input / 1000, 2)
            device.rack_name = rack.rack_name if rack else None
            device.site_name = site.site_name if site else None
            device.device_ip = device_ip if device_ip else None
            datatraffic_value=datatraffic[0]['traffic_through'] if datatraffic else None

            sntc_result = session.query(DeviceSNTC).filter(DeviceSNTC.model_name == device.pn_code).first()

            # Assign SNTC attributes
            if sntc_result:
                attrs = ['hw_eol_ad', 'hw_eos', 'sw_EoSWM', 'hw_EoRFA', 'sw_EoVSS', 'hw_EoSCR', 'hw_ldos']
                for attr in attrs:
                    setattr(device, attr, getattr(sntc_result, attr, None))
            else:
                device.hw_eol_ad = device.hw_eos = device.sw_EoSWM = device.hw_EoRFA = \
                    device.sw_EoVSS = device.hw_EoSCR = device.hw_ldos = None
            print(datatraffic)
            if datatraffic_value:
                datatraffic = datatraffic_value / (1024 ** 3)
            else:
                datatraffic=0
            device.datatraffic = round(datatraffic, 2)
            device.cost = 13

            return device
