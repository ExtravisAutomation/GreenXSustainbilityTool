import sys
from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload, selectinload

from sqlalchemy import or_

from concurrent.futures import ThreadPoolExecutor, as_completed
from fastapi import HTTPException
from app.model.DevicesSntc import DevicesSntc
from app.model.rack import Rack
from app.model.site import Site
from app.model.DevicesSntc import DevicesSntc as DeviceSNTC
from app.repository.InfluxQuery import get_24hDevice_dataTraffic, get_24hDevice_power, get_device_power
from app.model.device_inventory import ChassisFan, ChassisModule, ChassisPowerSupply, DeviceInventory, ChassisDevice
from app.model.apic_controller import APICController
from app.model.APIC_controllers import APICControllers,Vendor

from app.repository.base_repository import BaseRepository
from sqlalchemy import func, desc,and_
from datetime import datetime, timedelta
class DeviceInventoryRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], influxdb_repository):
        super().__init__(session_factory, DeviceInventory)
        self.influxdb_repository = influxdb_repository

    def get_device_type_by_ip(self, session, apic_controller_ip: str) -> str:
        if apic_controller_ip:
            print(f"Looking up APICControllers device type for IP: {apic_controller_ip}")
            apic_controller_device = (
                session.query(APICControllers)
                .filter(APICControllers.ip_address == apic_controller_ip)
                .first()
            )
            if apic_controller_device:
                device_type = apic_controller_device.device_type
                print(f"Device Type found for IP {apic_controller_ip}: {device_type}")
                return device_type
            else:
                print(f"No APICControllers device found with IP: {apic_controller_ip}")
        return None

    # def get_all_devices(self) -> List[dict]:
    #     enriched_devices = []
    #
    #     with self.session_factory() as session:
    #         devices = (
    #             session.query(DeviceInventory)
    #             .options(
    #                 joinedload(DeviceInventory.rack),
    #                 joinedload(DeviceInventory.site),
    #                 joinedload(DeviceInventory.apic_controller),
    #             )
    #             .order_by(DeviceInventory.id.desc())
    #             .all()
    #         )
    #
    #         for device in devices:
    #             sntc_data = (
    #                 session.query(DeviceSNTC)
    #                 .filter(DeviceSNTC.model_name == device.pn_code)
    #                 .first()
    #             )
    #
    #             apic_controller_ip = device.apic_controller.ip_address if device.apic_controller else None
    #             device_type = self.get_device_type_by_ip(session, apic_controller_ip)
    #
    #
    #             # Ahmed changes 31/10/2024 ---------------------
    #
    #             ip_result = (
    #                 session.query(APICControllers.ip_address)
    #                 .filter(APICControllers.id == device.apic_controller_id)
    #                 .order_by(APICControllers.updated_at.desc())  # Fetch by latest update timestamp
    #                 .first()
    #             )
    #
    #             # ip = apic_controller_ip if apic_controller_ip else None
    #             ip = ip_result[0] if ip_result else None
    #             power = get_24hDevice_power(ip) if ip else None
    #
    #             datatraffic = get_24hDevice_dataTraffic(ip) if ip else None
    #             print(datatraffic)
    #
    #
    #             # Prepare attributes for DeviceSNTC if exists, else set to None
    #             sntc_info = {
    #                 "hw_eol_ad": sntc_data.hw_eol_ad if sntc_data else None,
    #                 "hw_eos": sntc_data.hw_eos if sntc_data else None,
    #                 "sw_EoSWM": sntc_data.sw_EoSWM if sntc_data else None,
    #                 "hw_EoRFA": sntc_data.hw_EoRFA if sntc_data else None,
    #                 "sw_EoVSS": sntc_data.sw_EoVSS if sntc_data else None,
    #                 "hw_EoSCR": sntc_data.hw_EoSCR if sntc_data else None,
    #                 "hw_ldos": sntc_data.hw_ldos if sntc_data else None,
    #             }
    #
    #             # Collect device information with relationships, SNTC data, and device_type
    #             enriched_device = {
    #                 **device.__dict__,
    #                 **sntc_info,
    #                 "rack_name": device.rack.rack_name if device.rack else None,
    #                 "site_name": device.site.site_name if device.site else None,
    #                 "device_ip": apic_controller_ip,
    #                 "device_type": device_type,  # Include device_type from APICControllers if found
    #                 # Ahmed changes
    #                 "power_utilization": power[0]['power_utilization'] if power else 0,
    #                 "pue": power[0]['pue'] if power else 0,
    #                 "power_input": power[0]['total_supplied'] if power else 0,
    #                 "power_output": power[0]['total_drawn'] if power else 0,
    #             }
    #
    #             # Ahmed changes
    #             if datatraffic:
    #                 datatraffic_value = datatraffic[0]['traffic_through'] if datatraffic else 0
    #                 bandwidth_value = datatraffic[0]['bandwidth'] if datatraffic else 0
    #
    #                 datatraffic = datatraffic_value / (1024 ** 3) if datatraffic_value else 0
    #                 bandwidth=bandwidth_value/1000 if bandwidth_value else 0
    #                 bandwidth_utilization = (datatraffic / bandwidth) * 100 if bandwidth else 0
    #                 enriched_device["datatraffic"] = round(datatraffic, 2)
    #                 enriched_device["bandwidth_utilization"] = round(bandwidth_utilization, 2)
    #
    #             enriched_devices.append(enriched_device)
    #
    #             print(f"Enriched device added: {enriched_device['device_name']} with IP: {apic_controller_ip}")
    #
    #     return enriched_devices
    from typing import List, Dict
    from sqlalchemy.orm import joinedload

    def get_all_devices(self, page: int, page_size: int = 10) -> Dict:

        enriched_devices = []

        with self.session_factory() as session:
            # Get total device count for pagination
            total_devices = session.query(DeviceInventory).count()
            print("Total devices",total_devices)
            total_pages = (total_devices + page_size - 1) // page_size

            # Ensure page is within bounds
            if page < 1:
                page = 1
            elif page > total_pages:
                page = total_pages

            # Apply limit and offset for pagination
            devices = (
                session.query(DeviceInventory)
                .options(
                    joinedload(DeviceInventory.rack),
                    joinedload(DeviceInventory.site),
                    joinedload(DeviceInventory.apic_controller),
                )
                .order_by(DeviceInventory.id.desc())
                .limit(page_size)
                .offset((page - 1) * page_size)
                .all()
            )

            for device in devices:
                sntc_data = (
                    session.query(DeviceSNTC)
                    .filter(DeviceSNTC.model_name == device.pn_code)
                    .first()
                )

                apic_controller_ip = device.apic_controller.ip_address if device.apic_controller else None
                device_type = self.get_device_type_by_ip(session, apic_controller_ip)

                # Ahmed changes 31/10/2024 ---------------------
                ip_result = (
                    session.query(APICControllers.ip_address)
                    .filter(APICControllers.id == device.apic_controller_id)
                    .order_by(APICControllers.updated_at.desc())
                    .first()
                )

                ip = ip_result[0] if ip_result else None
                # power = get_24hDevice_power(ip) if ip else None
                # datatraffic = get_24hDevice_dataTraffic(ip) if ip else None

                # Use threading for concurrent fetching of power and data traffic
                power = None
                datatraffic = None

                if ip:
                    with ThreadPoolExecutor(max_workers=2) as executor:
                        future_power = executor.submit(get_24hDevice_power, ip)
                        future_datatraffic = executor.submit(get_24hDevice_dataTraffic, ip)

                        for future in as_completed([future_power, future_datatraffic]):
                            if future == future_power:
                                power = future.result()
                            elif future == future_datatraffic:
                                datatraffic = future.result()

                # Prepare attributes for DeviceSNTC if exists, else set to None
                sntc_info = {
                    "hw_eol_ad": sntc_data.hw_eol_ad if sntc_data else None,
                    "hw_eos": sntc_data.hw_eos if sntc_data else None,
                    "sw_EoSWM": sntc_data.sw_EoSWM if sntc_data else None,
                    "hw_EoRFA": sntc_data.hw_EoRFA if sntc_data else None,
                    "sw_EoVSS": sntc_data.sw_EoVSS if sntc_data else None,
                    "hw_EoSCR": sntc_data.hw_EoSCR if sntc_data else None,
                    "hw_ldos": sntc_data.hw_ldos if sntc_data else None,
                }

                # Collect device information with relationships, SNTC data, and device_type
                enriched_device = {
                    **device.__dict__,
                    **sntc_info,
                    "rack_name": device.rack.rack_name if device.rack else None,
                    "site_name": device.site.site_name if device.site else None,
                    "device_ip": apic_controller_ip,
                    "device_type": device_type,
                    "power_utilization": power[0]['power_utilization'] if power else 0,
                    "pue": power[0]['pue'] if power else 0,
                    "power_input": power[0]['total_supplied'] if power else 0,
                    "power_output": power[0]['total_drawn'] if power else 0,
                }

                # Ahmed changes for datatraffic and bandwidth utilization
                if datatraffic:
                    datatraffic_value = datatraffic[0]['traffic_through'] if datatraffic else 0
                    bandwidth_value = datatraffic[0]['bandwidth'] if datatraffic else 0

                    datatraffic_gb = datatraffic_value / (1024 ** 3) if datatraffic_value else 0
                    bandwidth_mbps = bandwidth_value / 1000 if bandwidth_value else 0
                    bandwidth_utilization = (datatraffic_gb / bandwidth_mbps) * 100 if bandwidth_mbps else 0

                    enriched_device["datatraffic"] = round(datatraffic_gb, 2)
                    enriched_device["bandwidth_utilization"] = round(bandwidth_utilization, 2)

                enriched_devices.append(enriched_device)
            data={
                "page": page,
                "page_size": page_size,
                "total_devices": total_devices,
                "total_pages": total_pages,
                "devices": enriched_devices
            }
            print("ds",data)
            return {
                "page": page,
                "page_size": page_size,
                "total_devices": total_devices,
                "total_pages": total_pages,
                "devices": enriched_devices
            }

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
            chassis_devices = session.query(ChassisDevice).options(
                joinedload(ChassisDevice.chassis),
                selectinload(ChassisDevice.device_sntc)
            ).all()

            enriched_chassis_devices = []

            for chasis_device in chassis_devices:
                chassis = chasis_device.chassis
                device_sntc = chasis_device.device_sntc

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
            chassis_modules = session.query(ChassisModule).options(
                joinedload(ChassisModule.module),
                joinedload(ChassisModule.chassis)
            ).all()

            enriched_modules = []
            id=0

            for chassis_module in chassis_modules:
                module = chassis_module.module  
                chassis = chassis_module.chassis
                id +=1

                module_details = {
                    "id": id,  # Added id to uniquely identify each module in the response list
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
            chassis_power_supplies = session.query(ChassisPowerSupply).options(
                joinedload(ChassisPowerSupply.power_supply),
                joinedload(ChassisPowerSupply.chassis)
            ).all()

            enriched_power_supplies = []

            for cps in chassis_power_supplies:
                power_supply = cps.power_supply

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
                    "chassis_name": cps.chassis.chassis_name if cps.chassis else None  
                }

                enriched_power_supplies.append(power_supply_details)

            return enriched_power_supplies
        
        
    def fans(self):
        with self.session_factory() as session:
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

            power = get_24hDevice_power(device_ip )
            datatraffic = get_24hDevice_dataTraffic(device_ip)

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


    def get_models_data(self,model_data):
        with self.session_factory() as session:
            site_id=model_data.site_id
            rack_id=model_data.rack_id
            vendor_id=model_data.vendor_id
            query = session.query(
                DeviceInventory.pn_code,
                func.count(DeviceInventory.id).label("count"),
            )

            query = query.join(APICControllers, APICControllers.id == DeviceInventory.apic_controller_id)
            conditions = []
            if site_id:
                conditions.append(DeviceInventory.site_id == site_id)
            if rack_id:
                conditions.append(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                conditions.append(APICControllers.vendor_id == vendor_id)
            if conditions:
                query = query.filter(and_(*conditions))

            apic = (
                query.group_by(DeviceInventory.pn_code)
                .order_by(desc("count"))
                .all()
            )
            print("daat",apic)
            data = [
                {
                    "model_name": a[0],  # pn_code
                    "count": a[1],  # count
                }
                for a in apic
            ]

            print(f"Total Records: {len(apic)}")  # Debugging info
            print("Processed Data:", data)  # Debugging info

        return data


    def get_device_type(self, model_data):
        with self.session_factory() as session:
            site_id = model_data.site_id
            rack_id = model_data.rack_id
            vendor_id = model_data.vendor_id
            query = session.query(
                APICControllers.device_type,  # Group by device_type
                func.count(DeviceInventory.id).label("device_count"),
            )

            query = query.join(APICControllers, APICControllers.id == DeviceInventory.apic_controller_id)

            conditions = []
            if site_id:
                conditions.append(DeviceInventory.site_id == site_id)
            if rack_id:
                conditions.append(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                conditions.append(APICControllers.vendor_id == vendor_id)
            if conditions:
                query = query.filter(and_(*conditions))
            device_type_count = (
                query.group_by(APICControllers.device_type)
                .order_by(desc("device_count"))  # Order by count of devices per type
                .all()
            )
            total_count=0
            data = []
            for record in device_type_count:
                data.append({
                    "device_type": record[0],  # APICControllers.device_type
                    "count": record[1],  # Device count
                })
                total_count += record[1]

            print(f"Total Records: {len(device_type_count)}")
            print("Processed Data:", data)

            result = {
                "device_type_count": data,
                "count": total_count
            }
            return result

    def get_vendors(self,site_id,rack_id):
        with self.session_factory() as session:

            query = session.query(Vendor).join(APICControllers, Vendor.id == APICControllers.vendor_id)

            # Apply filters dynamically
            if site_id is not None:
                query = query.filter(APICControllers.site_id == site_id)
            if rack_id is not None:
                query = query.filter(APICControllers.rack_id == rack_id)

            vendors = query.distinct().all()  # Fetch distinct vendors
            return vendors




    def get_count(self):
        with self.session_factory() as session:
            vendor_count = session.query(Vendor).count()
            site_count = session.query(Site).count()
            rack_count = session.query(Rack).count()
            device_count = session.query(APICControllers).count()

            data = [

                {"name": "Sites", "count": site_count},
                {"name": "Racks", "count": rack_count},
                {"name": "Devices", "count": device_count},
                {"name": "Vendors", "count": vendor_count},
            ]
            return data
    def  get_device_natures(self,model_data):
        with self.session_factory() as session:
            site_id = model_data.site_id
            rack_id = model_data.rack_id
            vendor_id = model_data.vendor_id
            query = session.query(
                APICControllers.device_nature,  # Group by device_type
                func.count(DeviceInventory.id).label("device_count"),
            )

            query = query.join(APICControllers, APICControllers.id == DeviceInventory.apic_controller_id)
            conditions = []
            if site_id:
                conditions.append(DeviceInventory.site_id == site_id)
            if rack_id:
                conditions.append(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                conditions.append(APICControllers.vendor_id == vendor_id)
            if conditions:
                query = query.filter(and_(*conditions))
            device_type_count = (
                query.group_by(APICControllers.device_nature)
                .order_by(desc("device_count"))  # Order by count of devices per type
                .all()
            )
            data = []
            total_count = 0  

            for a in device_type_count:
                data.append({
                    "device_nature": a[0],  # device type or nature
                    "count": a[1],  # count of devices
                })
                total_count += a[1]  # Accumulate the count

            print(f"Total Records: {len(device_type_count)}")
            print("Processed Data:", data)

            result = {
                "device_nature_count": data,
                "total_count": total_count
            }

            return result

    def get_vendor_device_count(self):
        with self.session_factory() as session:
            result = session.query(
                Vendor.vendor_name,
                func.count(APICControllers.id).label('device_count')
            ).join(APICControllers, APICControllers.vendor_id == Vendor.id) \
                .group_by(Vendor.vendor_name) \
                .all() 

            data = []
            total_count = 0 

            for vendor_name, device_count in result:
                data.append({
                    "vendor_name": vendor_name,  
                    "count": device_count,  
                })
                total_count += device_count 

            vendor_data = {
                "vendor_data": data,
                "total_count": total_count
            }

            return vendor_data

    def get_device_expiry(self, site_id):
        with self.session_factory() as session:
            current_date = datetime.now().date()  # Convert to date to match DB format
            one_month_ahead = (current_date + timedelta(days=30))  # Date 30 days from now
            print(current_date)
            print(one_month_ahead)
            join_query = session.query(DeviceInventory.device_name, DevicesSntc). \
                join(DevicesSntc, DeviceInventory.pn_code == DevicesSntc.model_name). \
                filter(DeviceInventory.site_id == site_id)

            result = []

            for device_name, device_sntc in join_query.all():
                print("device_name",device_name)
                print(device_sntc.hw_eos)
                # Check for End of Sale within the next 30 days
                if device_sntc.hw_eos and current_date <= device_sntc.hw_eos <= one_month_ahead:
                    days_left = (device_sntc.hw_eos - current_date).days
                    eos_date = device_sntc.hw_eos.strftime('%Y-%m-%d')
                    result.append(f"{device_name} end of sale is in {days_left} days (on {eos_date})")

                # Check for End of Support within the next 30 days
                if device_sntc.hw_ldos and current_date <= device_sntc.hw_ldos <= one_month_ahead:
                    days_left = (device_sntc.hw_ldos - current_date).days
                    eosup_date = device_sntc.hw_ldos.strftime('%Y-%m-%d')
                    result.append(f"{device_name} end of support is in {days_left} days (on {eosup_date})")

                # Check for End of Life within the next 30 days
                if device_sntc.hw_eol_ad and current_date <= device_sntc.hw_eol_ad <= one_month_ahead:
                    days_left = (device_sntc.hw_eol_ad - current_date).days
                    eol_date = device_sntc.hw_eol_ad.strftime('%Y-%m-%d')
                    result.append(f"{device_name} end of life is in {days_left} days (on {eol_date})")

            if not result:
                return ["No devices nearing EOL, EOS, or EoSUP in the next 30 days."]

            return result

    from fastapi import HTTPException
    from datetime import datetime
    from sqlalchemy.orm import joinedload
    from sqlalchemy import or_
    from concurrent.futures import ThreadPoolExecutor, as_completed

    def get_all_devices_test(self, filter_data) -> Dict:
        print("Getting all devices")
        page_size = 10  # Number of devices per page
        enriched_devices = []

        page = filter_data.page
        site_id = filter_data.site_id
        rack_id = filter_data.rack_id
        device_name = filter_data.device_name
        ip_address = filter_data.ip_address
        vendor_id = filter_data.vendor_id
        device_type = filter_data.device_type
        sntc_date = filter_data.sntc_date
        serial_no = filter_data.serial_no
        model_no = filter_data.model_no
        department = filter_data.department
        hardware_version=filter_data.hardware_version
        software_version=filter_data.software_version

        if sntc_date:
            try:
                sntc_date = datetime.strptime(sntc_date, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

        with self.session_factory() as session:
            query = (
                session.query(DeviceInventory)
                .options(
                    joinedload(DeviceInventory.rack),
                    joinedload(DeviceInventory.site),
                    joinedload(DeviceInventory.device),
                    joinedload(DeviceInventory.apic_controller)
                )
                .outerjoin(DeviceSNTC, DeviceInventory.pn_code == DeviceSNTC.model_name)
            )

            print(f"Base query count: {query.count()}")  # Debugging before filtering

            # Apply filters dynamically
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if device_name:
                query = query.filter(DeviceInventory.device_name.ilike(f"%{device_name}%"))
            if ip_address:
                query = query.filter(DeviceInventory.device.has(ip_address=ip_address))
            if device_type:
                query = query.filter(DeviceInventory.device.has(device_type=device_type))
            if vendor_id:
                query = query.filter(DeviceInventory.device.has(vendor_id=vendor_id))
            if serial_no:
                query = query.filter(DeviceInventory.serial_number.ilike(f"%{serial_no}%"))
            if model_no:
                query = query.filter(DeviceInventory.pn_code.ilike(f"%{model_no}%"))
            if hardware_version:
                query.filter(DeviceInventory.hardware_version.ilike(f"%{hardware_version}%"))
            if software_version:
                query = query.filter(DeviceInventory.software_version.ilike(f"%{software_version}%"))

            print(f"Filtered query count: {query.count()}")  # Debugging after filtering

            total_devices = query.count()
            total_pages = (total_devices + page_size - 1) // page_size
            page = max(1, min(page, total_pages))

            devices = query.order_by(DeviceInventory.id.desc()).limit(page_size).offset(
                (page - 1) * page_size).all()

            print(f"Devices fetched: {len(devices)}")  # Debugging

            for device in devices:
                sntc_data = (
                    session.query(DeviceSNTC)
                    .filter(DeviceSNTC.model_name == device.pn_code)
                    .first()
                )

                apic_controller_ip = device.device.ip_address if device.device else None
                device_type = self.get_device_type_by_ip(session, apic_controller_ip)

                # Get latest APIC controller IP
                ip_result = (
                    session.query(APICControllers.ip_address)
                    .filter(APICControllers.id == device.apic_controller_id)
                    .order_by(APICControllers.updated_at.desc())
                    .first()
                )
                ip = ip_result[0] if ip_result else None

                power, datatraffic = None, None

                # Fetch power and data traffic concurrently if IP is available
                if ip:
                    with ThreadPoolExecutor(max_workers=2) as executor:
                        future_power = executor.submit(get_24hDevice_power, ip)
                        future_datatraffic = executor.submit(get_24hDevice_dataTraffic, ip)

                        for future in as_completed([future_power, future_datatraffic]):
                            if future == future_power:
                                power = future.result()
                                print(f"Power data for {ip}: {power}")
                            elif future == future_datatraffic:
                                datatraffic = future.result()
                                print(f"Data traffic for {ip}: {datatraffic}")

                # Prepare attributes for DeviceSNTC if exists, else set to None
                sntc_info = {
                    "hw_eol_ad": sntc_data.hw_eol_ad if sntc_data else None,
                    "hw_eos": sntc_data.hw_eos if sntc_data else None,
                    "sw_EoSWM": sntc_data.sw_EoSWM if sntc_data else None,
                    "hw_EoRFA": sntc_data.hw_EoRFA if sntc_data else None,
                    "sw_EoVSS": sntc_data.sw_EoVSS if sntc_data else None,
                    "hw_EoSCR": sntc_data.hw_EoSCR if sntc_data else None,
                    "hw_ldos": sntc_data.hw_ldos if sntc_data else None,
                }

                # Prepare enriched device data
                enriched_device = {
                    **device.__dict__,
                    **sntc_info,
                    "rack_name": device.rack.rack_name if device.rack else None,
                    "site_name": device.site.site_name if device.site else None,
                    "device_ip": apic_controller_ip,
                    "device_type": device_type,
                    "power_utilization": power[0]['power_utilization'] if power else 0,
                    "pue": power[0]['pue'] if power else 0,
                    "power_input": power[0]['total_supplied'] if power else 0,
                    "power_output": power[0]['total_drawn'] if power else 0,
                }

                # Add bandwidth utilization if datatraffic exists
                if datatraffic:
                    datatraffic_value = datatraffic[0]['traffic_through'] if datatraffic else 0
                    bandwidth_value = datatraffic[0]['bandwidth'] if datatraffic else 0

                    datatraffic_gb = datatraffic_value / (1024 ** 3) if datatraffic_value else 0
                    bandwidth_mbps = bandwidth_value / 1000 if bandwidth_value else 0
                    bandwidth_utilization = (datatraffic_gb / bandwidth_mbps) * 100 if bandwidth_mbps else 0

                    enriched_device["datatraffic"] = round(datatraffic_gb, 2)
                    enriched_device["bandwidth_utilization"] = round(bandwidth_utilization, 2)
                else:
                    enriched_device["datatraffic"] = 0
                    enriched_device["bandwidth_utilization"] = 0


                print(f"Final enriched device data: {enriched_device}")  # Debugging final data
                enriched_devices.append(enriched_device)

            # Debug final response
            print({
                "page": page,
                "page_size": page_size,
                "total_devices": total_devices,
                "total_pages": total_pages,
                "devices": enriched_devices,
            })

            return {
                "page": page,
                "page_size": page_size,
                "total_devices": total_devices,
                "total_pages": total_pages,
                "devices": enriched_devices,
            }
