import sys
from contextlib import AbstractContextManager
from typing import Callable, List,Dict
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.orm import aliased
import pandas as pd
from sqlalchemy import or_, distinct
from sqlalchemy.orm import joinedload
from concurrent.futures import ThreadPoolExecutor, as_completed
from fastapi import HTTPException
from app.model.DevicesSntc import DevicesSntc
from app.model.rack import Rack
from app.model.site import Site
from app.model.DevicesSntc import DevicesSntc as DeviceSNTC
from app.repository.InfluxQuery import get_24hDevice_dataTraffic, get_24hDevice_power, get_device_power,get_excel_df
from app.model.device_inventory import ChassisFan, ChassisModule, ChassisPowerSupply, DeviceInventory, ChassisDevice

from app.model.APIC_controllers import  APICControllers as Devices, Vendor, DeviceType

from app.repository.base_repository import BaseRepository
from sqlalchemy import func, desc, and_
from datetime import datetime, timedelta



class DeviceInventoryRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], influxdb_repository):
        super().__init__(session_factory, DeviceInventory)
        self.influxdb_repository = influxdb_repository

    def get_device_type_by_ip(self, session, apic_controller_ip: str) -> str:
        if apic_controller_ip:
            print(f"Looking up Devices device type for IP: {apic_controller_ip}")

            result = session.query(DeviceType.device_type) \
                .join(Devices, Devices.device_type_id == DeviceType.id) \
                .filter(Devices.ip_address == apic_controller_ip) \
                .first()
            return result[0] if result else None
        else:
            print(f"No Devices device found with IP: {apic_controller_ip}")
        return None



    def get_all_devices(self, page: int, page_size: int = 10) -> Dict:

        enriched_devices = []

        with self.session_factory() as session:
            # Get total device count for pagination
            total_devices = session.query(DeviceInventory).count()
            print("Total devices", total_devices)
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
                    session.query(Devices.ip_address)
                    .filter(Devices.id == device.apic_controller_id)
                    .order_by(Devices.updated_at.desc())
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
            data = {
                "page": page,
                "page_size": page_size,
                "total_devices": total_devices,
                "total_pages": total_pages,
                "devices": enriched_devices
            }
            print("ds", data)
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
                            drawn_avg, supplied_avg = self.influxdb_repository.get_power_data(
                                device.apic_controller.ip_address)
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
            id = 0

            for chassis_module in chassis_modules:
                module = chassis_module.module
                chassis = chassis_module.chassis
                id += 1

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
                    "chassis_name": chassis_fan.chassis.chassis_name if chassis_fan.chassis else None
                    # Assuming Chassis has a 'chassis_name' attribute
                }

                enriched_fans.append(fan_details)

            return enriched_fans

    def device_power(self, apic_api: str):
        with self.session_factory() as session:
            response = []
            rack_data = get_device_power(apic_api)
            for data in rack_data:
                result = session.query(Devices.device_name).filter(
                    Devices.ip_address == apic_api).first()
                response.append({
                    'apic_controller_ip': apic_api,
                    'apic_controller_name': result[0],
                    'power_utilization': data['power_utilization']
                })

            return response

    def get_spcific_devices(self, device_ip: str):
        with self.session_factory() as session:

            controller = session.query(Devices.id, Devices.device_name).filter(
                Devices.ip_address == device_ip
            ).first()

            if not controller:
                print(f"APICController not found for IP: {device_ip}")
                return None

            device_id, device_name = controller

            query = session.query(DeviceInventory).filter(DeviceInventory.device_id == device_id)
            device = query.first()
            print("Here we are")
            print(device)

            power = get_24hDevice_power(device_ip)
            datatraffic = get_24hDevice_dataTraffic(device_ip)
            print(power, datatraffic)

            rack = session.query(Rack.rack_name).filter(Rack.id == device.rack_id).first()
            site = session.query(Site.site_name).filter(Site.id == device.site_id).first()
            device.power_utilization = power[0]['power_utilization'] if power else None
            total_power_input = power[0]['total_supplied']
            device.power_input = round(total_power_input / 1000, 2)
            device.rack_name = rack.rack_name if rack else None
            device.site_name = site.site_name if site else None
            # Set device name and IP
            device.device_name = device_name
            device.device_ip = device_ip
            datatraffic_value = datatraffic[0]['traffic_through'] if datatraffic else None
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
                datatraffic = 0
            device.datatraffic = round(datatraffic, 2)
            device.cost = 13

            return device

    def get_models_data(self, model_data):
        with self.session_factory() as session:
            site_id = model_data.site_id
            rack_id = model_data.rack_id
            vendor_id = model_data.vendor_id
            query = session.query(
                DeviceInventory.pn_code,
                func.count(DeviceInventory.id).label("count"),
            )

            query = query.join(Devices, Devices.id == DeviceInventory.apic_controller_id)
            conditions = []
            if site_id:
                conditions.append(DeviceInventory.site_id == site_id)
            if rack_id:
                conditions.append(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                conditions.append(Devices.vendor_id == vendor_id)
            if conditions:
                query = query.filter(and_(*conditions))

            apic = (
                query.group_by(DeviceInventory.pn_code)
                .order_by(desc("count"))
                .all()
            )
            print("daat", apic)
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
            try:
                site_id = model_data.site_id
                rack_id = model_data.rack_id
                vendor_id = model_data.vendor_id
                apic_alias = aliased(Devices)
                device_inv_alias = aliased(DeviceInventory)

                # Query to count devices based on device_type_id
                query = session.query(
                    DeviceType.id.label("device_type_id"),
                    DeviceType.device_type,
                    func.count(func.distinct(device_inv_alias.id)).label("device_count")  # Ensure distinct count
                )

                query = query.join(apic_alias, apic_alias.device_type_id == DeviceType.id, isouter=True) \
                    .join(device_inv_alias, apic_alias.id == device_inv_alias.device_id, isouter=True)

                # Apply filters before grouping
                if site_id or rack_id or vendor_id:
                    conditions = []
                    if site_id:
                        conditions.append(device_inv_alias.site_id == site_id)
                    if rack_id:
                        conditions.append(device_inv_alias.rack_id == rack_id)
                    if vendor_id:
                        conditions.append(DeviceType.vendor_id == vendor_id)
                    query = query.filter(and_(*conditions))

                query = query.group_by(DeviceType.id, DeviceType.device_type)

                device_type_count = query.order_by(desc("device_count")).all()

                total_count = sum(record[2] for record in device_type_count)  # Sum actual counts
                data = [
                    {"id": idx, "device_type_id": record[0], "device_type": record[1], "count": record[2]}
                    for idx, record in enumerate(device_type_count, start=1)
                ]
                result = {
                    "device_type_count": data,
                    "count": total_count
                }
                return result
            except Exception as e:
                raise ValueError(f"Error fetching device type data: {str(e)}")

    def get_vendors(self, site_id, rack_id):
        with self.session_factory() as session:

            query = session.query(Vendor).outerjoin(Devices, Vendor.id == Devices.vendor_id)

            # Apply filters dynamically
            if site_id is not None:
                query = query.filter(Devices.site_id == site_id)
            if rack_id is not None:
                query = query.filter(Devices.rack_id == rack_id)

            vendors = query.distinct().all()  # Fetch distinct vendors
            return vendors

    def get_count(self):
        with self.session_factory() as session:
            vendor_count = session.query(Vendor).count()
            site_count = session.query(Site).count()
            rack_count = session.query(Rack).count()
            device_count = session.query(Devices).count()

            data = [

                {"name": "Sites", "count": site_count},
                {"name": "Racks", "count": rack_count},
                {"name": "Devices", "count": device_count},
                {"name": "Vendors", "count": vendor_count},
            ]
            return data

    def get_device_natures(self, model_data):
        with self.session_factory() as session:
            site_id = model_data.site_id
            rack_id = model_data.rack_id
            vendor_id = model_data.vendor_id
            query = session.query(
                Devices.device_nature,  # Group by device_type
                func.count(DeviceInventory.id).label("device_count"),
            )

            query = query.join(Devices, Devices.id == DeviceInventory.apic_controller_id)
            conditions = []
            if site_id:
                conditions.append(DeviceInventory.site_id == site_id)
            if rack_id:
                conditions.append(DeviceInventory.rack_id == rack_id)
            if vendor_id:
                conditions.append(Devices.vendor_id == vendor_id)
            if conditions:
                query = query.filter(and_(*conditions))
            device_type_count = (
                query.group_by(Devices.device_nature)
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
                func.count(Devices.id).label('device_count')
            ).join(Devices, Devices.vendor_id == Vendor.id) \
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


    def get_notifications(self, site):
        site_id = site.site_id
        current_date = datetime.today().date()
        one_month_ahead = current_date + timedelta(days=30)

        with self.session_factory() as session:
            join_query = session.query(Devices, DeviceInventory, DevicesSntc).join(
                Devices, DeviceInventory.device_id == Devices.id
            ).join(
                DevicesSntc, DeviceInventory.pn_code == DevicesSntc.model_name
            ).filter(
                Devices.OnBoardingStatus == True,
                Devices.collection_status == True
            )
            if site_id:
                join_query = join_query.filter(DeviceInventory.site_id == site_id)

            records = join_query.all()

            result = []
            for controller, inventory, sntc in records:
                device_name = controller.device_name
                ip_address = controller.ip_address

                date_checks = [
                    ("end of sale", sntc.hw_eos),
                    ("end of support", sntc.hw_ldos),
                    ("end of life", sntc.hw_eol_ad)
                ]

                for label, date_value in date_checks:
                    if date_value and current_date <= date_value <= one_month_ahead:
                        days_left = (date_value - current_date).days
                        formatted_date = date_value.strftime('%Y-%m-%d')
                        result.append({
                            "ip_address": ip_address,
                            "name": device_name,
                            "dated": formatted_date,
                            "text": f"{label} is in {days_left} days"
                        })
        return result

   
    def classify_performance(self, avg_energy_efficiency, avg_power_efficiency, avg_data_traffic, avg_pcr,
                             avg_co2_emissions):
        # Collect all values in a dictionary
        metrics = {
            "energy_efficiency": avg_energy_efficiency,
            "power_efficiency": avg_power_efficiency,
            "data_traffic": avg_data_traffic,
            "pcr": avg_pcr,
            "co2_emissions": avg_co2_emissions
        }

        # Find min and max for each metric dynamically
        min_values = {k: min(v, 1e-6) for k, v in metrics.items()}  # Avoid division by zero
        max_values = {k: max(v, 1) for k, v in metrics.items()}

        # Normalize each metric (scales values between 0 and 1)
        normalized_metrics = {
            k: (v - min_values[k]) / (max_values[k] - min_values[k])
            for k, v in metrics.items()
        }

        # Assign weight factors to each metric (you can tweak these)
        weights = {
            "energy_efficiency": 0.25,
            "power_efficiency": 0.20,
            "data_traffic": 0.20,
            "pcr": 0.15,
            "co2_emissions": -0.20  # Negative weight because lower CO2 is better
        }

        # Calculate weighted score
        score = sum(normalized_metrics[k] * weights[k] for k in metrics)
        score = round(score, 2)

        # **Final Classification**
        if score >= 0.7:
            return score, "Highly efficient device with optimal power usage, low CO₂ emissions, and strong data performance."
        elif 0.45 <= score < 0.7:
            return score, "Moderate efficiency device with some areas for improvement."
        else:
            return score, "Low efficiency device that may require significant optimization."

    # def classify_performance(self, avg_energy_efficiency, avg_power_efficiency, avg_data_traffic, avg_pcr,
    #                          avg_co2_emissions, thresholds=None):
    #     if thresholds is None:
    #         # Default thresholds for different metrics
    #         thresholds = {
    #             "energy_efficiency": [0.80, 0.90],  # Moderate, Good
    #             "power_efficiency": [1.10, 1.20],  # Good, Moderate
    #             "data_traffic": [1500, 2500],  # Moderate, Good
    #             "pcr": [1.5, 2.5],  # Good, Moderate
    #             "co2_emissions": [2.0, 3.0]  # Good, Moderate
    #         }
    #
    #     score = 0
    #
    #     # **Energy Efficiency Score**
    #     if avg_energy_efficiency >= thresholds["energy_efficiency"][1]:
    #         score += 2
    #     elif thresholds["energy_efficiency"][0] <= avg_energy_efficiency < thresholds["energy_efficiency"][1]:
    #         score += 1
    #
    #     # **Power Efficiency Score**
    #     if avg_power_efficiency <= thresholds["power_efficiency"][0]:
    #         score += 2
    #     elif thresholds["power_efficiency"][0] < avg_power_efficiency <= thresholds["power_efficiency"][1]:
    #         score += 1
    #
    #     # **Data Traffic Score**
    #     if avg_data_traffic >= thresholds["data_traffic"][1]:
    #         score += 2
    #     elif thresholds["data_traffic"][0] <= avg_data_traffic < thresholds["data_traffic"][1]:
    #         score += 1
    #
    #     # **Power Consumption Ratio (PCR) Score**
    #     if avg_pcr <= thresholds["pcr"][0]:
    #         score += 2
    #     elif thresholds["pcr"][0] < avg_pcr <= thresholds["pcr"][1]:
    #         score += 1
    #
    #     # **CO₂ Emissions Score**
    #     if avg_co2_emissions <= thresholds["co2_emissions"][0]:
    #         score += 2
    #     elif thresholds["co2_emissions"][0] < avg_co2_emissions <= thresholds["co2_emissions"][1]:
    #         score += 1
    #     elif avg_co2_emissions > thresholds["co2_emissions"][1]:
    #         score -= 2
    #
    #     # **Final Classification**
    #     if score >= 8:
    #         return score, "Highly efficient device with optimal power usage, low CO₂ emissions, and strong data performance."
    #     elif 5 <= score < 8:
    #         return score, "Moderate efficiency device with some areas for improvement."
    #     else:
    #         return score, "Low efficiency device that may require significant optimization."

    def get_response_with_filter(self, page, page_size, query, score):
        devices = query.order_by(DeviceInventory.id.desc()).all()
        enriched_devices = self.get_devices_result(devices)
        if score:
            if len(score) == 2:  # Case: [min, max] (e.g., [0,5] or [5,8])
                min_score, max_score = score[0], score[1]
            elif len(score) == 1:  # Case: [x] meaning >=x (e.g., [8] means score >= 8)
                min_score = score[0]
                max_score = 10  # No upper limit
            else:
                min_score, max_score = 0, 10  # Default full range

            enriched_devices = [
                device for device in enriched_devices
                if min_score <= device["performance_score"] <= max_score
            ]

        return enriched_devices

    def convert_gb_mbs(self, data):
        data_gb = round(data / (1024 ** 3), 3) if data else 0
        data_mb = round(data / (1024 ** 2), 3) if data else 0
        return data_gb, data_mb

    def get_devices_result(self, devices):

        with self.session_factory() as session:
            enriched_devices = []
            for device in devices:
                sntc_data = (
                    session.query(DeviceSNTC)
                    .filter(DeviceSNTC.model_name == device.pn_code)
                    .first()
                )

                ip_address = device.device.ip_address if device.device else None
                device_type = self.get_device_type_by_ip(session, ip_address)
                # Get latest APIC controller IP
                ip_result = (
                    session.query(Devices.ip_address)
                    .filter(Devices.id == device.apic_controller_id)
                    .order_by(Devices.updated_at.desc())
                    .first()
                )
                ip = ip_result[0] if ip_result else None

                power, datatraffic = None, None

                # Fetch power and data traffic concurrently if IP is available
                if ip:
                    with ThreadPoolExecutor(max_workers=2) as executor:
                        future_power = executor.submit(get_24hDevice_power, ip)
                        print(future_power)
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
                    "device_ip": ip_address,
                    "device_type": device_type,
                    "bandwidth":device.bandwidth,

                    # "device_name": device.device_name,
                    "power_utilization": power[0]['power_utilization'] if power else 0,
                    "pue": power[0]['pue'] if power else 0,
                    "power_input": power[0]['total_supplied'] if power else 0,
                    "power_output": power[0]['total_drawn'] if power else 0,
                }

                print(enriched_device)
                bandwidth=enriched_device.get("bandwidth") or 0

                # Add bandwidth utilization if datatraffic exists
                if datatraffic:
                    datatraffic_value = datatraffic[0]['traffic_through'] if datatraffic else 0
                    bandwidth_value = datatraffic[0]['bandwidth'] if datatraffic else 0
                    total_input_bytes=datatraffic[0]['total_input_bytes'] if datatraffic else 0
                    total_output_bytes=datatraffic[0]['total_output_bytes'] if datatraffic else  0
                    total_output_rate = datatraffic[0]['total_output_rate'] if datatraffic else 0

                    total_input_rate = datatraffic[0]['total_input_rate'] if datatraffic else 0

                    total_input_packets = datatraffic[0]['total_input_packets'] if datatraffic else 0

                    total_output_packets = datatraffic[0]['total_output_packets'] if datatraffic else 0

                    datatraffic_gb , datatraffic_mb = self.convert_gb_mbs(datatraffic_value)

                    total_output_gbs,total_output_mbs = self.convert_gb_mbs(total_output_bytes)
                    bandwidth_bps = bandwidth_value * 1000  # = 1,000,000,000 bps

                    mb_per_sec = bandwidth_bps / 8 / 1024 / 1024

                    total_input_gbs,total_input_mbs=self.convert_gb_mbs(total_input_bytes)
                    bandwidth_mbps = bandwidth_value / 1000 if bandwidth_value else 0
                    bandwidth_gbps = bandwidth_value / 1_000_000 if bandwidth_value else 0
                    bandwidth_mbps = bandwidth_value / 1000 if bandwidth_value else 0

                    datatraffic_utilization = (datatraffic_mb / bandwidth_mbps) * 100 if bandwidth_mbps > 0 else 0
                    enriched_device["bandwidth_mbps"] = round(bandwidth_mbps, 2)
                    enriched_device["total_output_mbs"]=round(total_output_mbs,4)
                    enriched_device["total_input_mbs"] = round(total_input_mbs, 4)
                    enriched_device["datatraffic"] = round(datatraffic_mb, 4)
                    enriched_device["datatraffic_utilization"] = round(datatraffic_utilization, 2)
                    enriched_device["total_input_packets"] = round(total_input_packets, 2)
                    enriched_device["total_output_packets"] = round(total_output_packets, 2)
                else:
                    enriched_device["bandwidth_mbps"] = 0
                    enriched_device["datatraffic"] = 0
                    enriched_device["datatraffic_utilization"] = 0
                    enriched_device["total_output_mbs"] = 0
                    enriched_device["total_input_mbs"] = 0

                power_input = enriched_device.get("power_input") or 0
                power_output = enriched_device.get("power_output") or 0

                power_utilization = enriched_device.get("power_utilization") or 0
                pue = enriched_device.get("pue") or 0
                datatraffic = enriched_device.get("datatraffic") or 0
                # datatraffic_gb = datatraffic / (1024 ** 3) if datatraffic_value else 0
                bandwidth_utilization = enriched_device.get("bandwidth_utilization") or 0
                eer_dt = round(datatraffic / power_input, 3) if power_input else 0

                # Carbon Emissions Calculation
                carbon_emission = round(((power_output / 1000) * 0.4041), 4)
                carbon_emission_tons=round(carbon_emission/1000,2)


                # Power Consumption Ratio (PCR) Calculation
                pcr = round(power_input/ datatraffic, 4) if datatraffic else 0

                # Classify device performance and power consumption
                performance_score, performance_description = self.classify_performance(
                    power_utilization, pue, datatraffic, pcr or 0, carbon_emission
                )
                enriched_device['carbon_emission']=carbon_emission
                enriched_device['pcr']=pcr
                enriched_device['eer_dt']=eer_dt
                enriched_device['carbon_emission_tons']=carbon_emission_tons
                enriched_device["performance_score"] = performance_score
                enriched_device["performance_description"] = performance_description
                enriched_devices.append(enriched_device)
        # print(enriched_devices)

        return enriched_devices

    def get_devices_result1(self, devices):

        with self.session_factory() as session:
            enriched_devices = []
            ip_list = [device.device.ip_address for device in devices]

            return get_excel_df(ip_list)

    def get_all_devices_test(self, filter_data) -> Dict:
        print("Getting all devices")
        page_size = 10  # Number of devices per page

        page = filter_data.page
        site_id = filter_data.site_id
        rack_id = filter_data.rack_id
        device_name = filter_data.device_name
        ip_addresss = filter_data.ip_address
        vendor_id = filter_data.vendor_id
        device_type = filter_data.device_type
        sntc_date = filter_data.sntc_date
        serial_no = filter_data.serial_no
        model_no = filter_data.model_no
        department = filter_data.department
        hardware_version = filter_data.hardware_version
        software_version = filter_data.software_version
        score_card = filter_data.score

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
            query.filter(
                DeviceInventory.device.has(
                    (Devices.OnBoardingStatus == True) &
                    (Devices.collection_status == True)
                )
            ).filter(
                DeviceInventory.pn_code.notlike('%IE%')
            )
            print(f"Base query count: {query.count()}")  # Debugging before filtering

            # Apply filters dynamically
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if device_name:
                query = query.filter(DeviceInventory.device_name.ilike(f"%{device_name}%"))
            if ip_addresss:
                query = query.filter(DeviceInventory.device.has(Devices.ip_address.ilike(f"%{ip_addresss}%")))
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
            if score_card:

                enriched_devices = self.get_response_with_filter(page, page_size, query, score_card)

                total_devices = len(enriched_devices)
                total_pages = (total_devices + page_size - 1) // page_size
                page = max(1, min(page, total_pages))

                paginated_devices = enriched_devices[(page - 1) * page_size: page * page_size]

                return {
                    "page": page,
                    "page_size": page_size,
                    "total_devices": total_devices,
                    "total_pages": total_pages,
                    "devices": paginated_devices
                }
            else:
                total_devices = query.count()
                total_pages = (total_devices + page_size - 1) // page_size
                page = max(1, min(page, total_pages))

                devices = query.order_by(DeviceInventory.id.desc()).limit(page_size).offset(
                    (page - 1) * page_size).all()

                print(f"Devices fetched: {len(devices)}")  # Debugging
                enriched_devices = self.get_devices_result(devices)

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

    def generate_excel(self, filter_data) -> Dict:
        print("Getting all devices")
        page_size = 10  # Number of devices per page

        file_path = "device_report.xlsx"
        page = filter_data.page
        site_id = filter_data.site_id
        rack_id = filter_data.rack_id
        device_name = filter_data.device_name
        ip_addresss = filter_data.ip_address
        vendor_id = filter_data.vendor_id
        device_type = filter_data.device_type
        sntc_date = filter_data.sntc_date
        serial_no = filter_data.serial_no
        model_no = filter_data.model_no
        department = filter_data.department
        hardware_version = filter_data.hardware_version
        software_version = filter_data.software_version
        score_card = filter_data.score

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
            query = query.filter(
                DeviceInventory.device.has(
                    (Devices.OnBoardingStatus == True) &
                    (Devices.collection_status == True)
                )
            )

            print(f"Base query count: {query.count()}")  # Debugging before filtering

            # Apply filters dynamically
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if device_name:
                query = query.filter(DeviceInventory.device_name.ilike(f"%{device_name}%"))
            if ip_addresss:
                query = query.filter(DeviceInventory.device.has(Devices.ip_address.ilike(f"%{ip_addresss}%")))
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
            if score_card:

                enriched_devices = self.get_response_with_filter(page, page_size, query, score_card)
                df = pd.DataFrame(enriched_devices)
                print(df.columns)
                return df
            else:
                devices = query.order_by(DeviceInventory.id.desc()).all()

                print(f"Devices fetched: {len(devices)}")  # Debugging
                enriched_devices = self.get_devices_result(devices)
                print(enriched_devices)

                df=pd.DataFrame(enriched_devices)

                print(df['error_message'])

                return df
    def generate_excel1(self, filter_data) -> Dict:
        print("Getting all devices")
        page_size = 10  # Number of devices per page

        file_path = "device_report.xlsx"
        page = filter_data.page
        site_id = filter_data.site_id
        rack_id = filter_data.rack_id
        device_name = filter_data.device_name
        ip_addresss = filter_data.ip_address
        vendor_id = filter_data.vendor_id
        device_type = filter_data.device_type
        sntc_date = filter_data.sntc_date
        serial_no = filter_data.serial_no
        model_no = filter_data.model_no
        department = filter_data.department
        hardware_version = filter_data.hardware_version
        software_version = filter_data.software_version
        score_card = filter_data.score

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
            query = query.filter(
                DeviceInventory.device.has(
                    (Devices.OnBoardingStatus == True) &
                    (Devices.collection_status == True)
                )
            )

            print(f"Base query count: {query.count()}")  # Debugging before filtering

            # Apply filters dynamically
            if site_id:
                query = query.filter(DeviceInventory.site_id == site_id)
            if rack_id:
                query = query.filter(DeviceInventory.rack_id == rack_id)
            if device_name:
                query = query.filter(DeviceInventory.device_name.ilike(f"%{device_name}%"))
            if ip_addresss:
                query = query.filter(DeviceInventory.device.has(Devices.ip_address.ilike(f"%{ip_addresss}%")))
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
            if score_card:

                devices = query.order_by(DeviceInventory.id.desc()).all()

                print(f"Devices fetched: {len(devices)}")  # Debugging
                enriched_devices = self.get_devices_result1(devices)

                return enriched_devices
            else:
                devices = query.order_by(DeviceInventory.id.desc()).all()

                print(f"Devices fetched: {len(devices)}")  # Debugging
                enriched_devices = self.get_devices_result1(devices)


                return enriched_devices
    def get_hardware_versions(self):
        with self.session_factory() as session:
            distinct_hw_versions = session.query(distinct(DeviceInventory.hardware_version)).all()

            # Convert result to a list of values
            hardware_versions = [hw[0] for hw in distinct_hw_versions]
            return hardware_versions

    def get_software_versions(self):
        with self.session_factory() as session:
            distinct_sw_versions = session.query(distinct(DeviceInventory.software_version)).all()
            # Convert result to a list of values
            software_versions = [sw[0] for sw in distinct_sw_versions]
            return software_versions

    def add_vendor(self, vendor):
        with self.session_factory() as session:
            new_vendor = Vendor(vendor_name=vendor.vendor_name)
            session.add(new_vendor)
            session.commit()
            session.refresh(new_vendor)
            return new_vendor

    def add_device_type(self, device_type):
        with self.session_factory() as session:
            vendor = session.query(Vendor).filter(Vendor.id == device_type.vendor_id).first()
            if not vendor:
                raise HTTPException(status_code=404, detail="Vendor not found")
            new_device_type = DeviceType(device_type=device_type.device_type, vendor_id=device_type.vendor_id)
            session.add(new_device_type)
            session.commit()
            session.refresh(new_device_type)
            return new_device_type
