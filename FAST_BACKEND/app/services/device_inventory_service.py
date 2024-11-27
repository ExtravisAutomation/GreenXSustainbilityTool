from datetime import datetime
from typing import List
from app.repository.device_inventory_repository import DeviceInventoryRepository

from app.schema.device_inventory_schema import DeviceInventoryCreate, DeviceInventoryUpdate, DeviceInventoryInDB


class DeviceInventoryService:
    def __init__(self, device_inventory_repository: DeviceInventoryRepository):
        self.device_inventory_repository = device_inventory_repository

    def to_datetime(self, value):
        # Helper function to convert Date to datetime
        return datetime.combine(value, datetime.min.time()) if value else None

    def get_all_devices(self) -> List[dict]:
        # Get devices with SNTC and relationship data as dictionaries from the repository
        devices = self.device_inventory_repository.get_all_devices()

        enriched_devices = []

        for device in devices:
            # Enrich data with SNTC fields and handle potential missing data
            enriched_device = {
                "id": device.get("id"),
                "cisco_domain": device.get("cisco_domain"),
                "contract_expiry": device.get("contract_expiry"),
                "contract_number": device.get("contract_number"),
                "created_at": device.get("created_at"),
                "criticality": device.get("criticality"),
                "department": device.get("department"),
                "device_id": device.get("device_id"),
                "device_name": device.get("device_name"),
                "device_ru": device.get("device_ru"),
                "domain": device.get("domain"),
                "hardware_version": device.get("hardware_version"),
                "hw_eol_date": device.get("hw_eol_date"),
                "hw_eos_date": device.get("hw_eos_date"),
                "item_code": device.get("item_code"),
                "item_desc": device.get("item_desc"),
                "manufacturer_date": device.get("manufacturer_date"),
                "manufacturer": device.get("manufacturer"),
                "modified_by": device.get("modified_by"),
                "parent": device.get("parent"),
                "patch_version": device.get("patch_version"),
                "pn_code": device.get("pn_code"),
                "site_id": device.get("site_id"),
                "rack_id": device.get("rack_id"),
                "rfs_date": device.get("rfs_date"),
                "section": device.get("section"),
                "serial_number": device.get("serial_number"),
                "software_version": device.get("software_version"),
                "source": device.get("source"),
                "stack": device.get("stack"),
                "status": device.get("status"),
                "sw_eol_date": device.get("sw_eol_date"),
                "sw_eos_date": device.get("sw_eos_date"),
                "tag_id": device.get("tag_id"),
                "apic_controller_id": device.get("apic_controller_id"),

                # SNTC fields
                "hw_eol_ad": device.get("hw_eol_ad"),
                "hw_eos": device.get("hw_eos"),
                "sw_EoSWM": device.get("sw_EoSWM"),
                "hw_EoRFA": device.get("hw_EoRFA"),
                "sw_EoVSS": device.get("sw_EoVSS"),
                "hw_EoSCR": device.get("hw_EoSCR"),
                "hw_ldos": device.get("hw_ldos"),

                # Additional fields from relationships
                "site_name": device.get("site_name"),
                "rack_name": device.get("rack_name"),
                "device_ip": device.get("device_ip"),
                "device_type": device.get("device_type"),
                
                # Ahmed Changes
                "power_utilization": device.get("power_utilization"),
                "pue": device.get("pue"),
                "power_input": device.get("power_input"),
                "datatraffic": device.get("datatraffic"),
            }
            
            # Conditionally add 'datatraffic' if it exists
            if "datatraffic" in device:
                enriched_device["datatraffic"] = device["datatraffic"]

            enriched_devices.append(enriched_device)

        return enriched_devices


    def get_device_by_id(self, device_id: int) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.get_device_by_id(device_id)
        return DeviceInventoryInDB.from_orm(device)

    def create_device(self, device_data: DeviceInventoryCreate) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.add_device(device_data)
        return DeviceInventoryInDB.from_orm(device)

    def update_device(self, device_id: int, device_data: DeviceInventoryUpdate) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.update_device(device_id, device_data)
        return DeviceInventoryInDB.from_orm(device)

    def delete_device(self, device_id: int) -> None:
        self.device_inventory_repository.delete_device(device_id)

    def get_device_inventory_with_power_utilization(self) -> List[DeviceInventoryInDB]:
        devices = self.device_inventory_repository.get_device_inventory_with_power_utilization()
        return [DeviceInventoryInDB.from_orm(device) for device in devices]
    
    def chasis(self):
        return self.device_inventory_repository.chasis()
    
    def modules(self):
        return self.device_inventory_repository.modules()
    
    def power_supply(self):
        return self.device_inventory_repository.power_supply()
    
    def fans(self):
        return self.device_inventory_repository.fans()
    
    def device_power(self, apic_api: str):
        return self.device_inventory_repository.device_power(apic_api)
    
    def get_spcific_devices(self, device_ip: str):
        return self.device_inventory_repository.get_spcific_devices(device_ip)

    def get_models(self,model_data):
        return self.device_inventory_repository.get_models_data(model_data)

    def get_device_type(self, model_data):
        return self.device_inventory_repository.get_device_type(model_data)

    def get_vendor(self):
        return self.device_inventory_repository.get_vendors()
    def get_count(self):
        return self.device_inventory_repository.get_count()
    def get_device_nature(self):
        return self.device_inventory_repository.get_device_nature(model_data)