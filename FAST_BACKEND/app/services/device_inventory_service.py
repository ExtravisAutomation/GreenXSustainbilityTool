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
    def get_all_devices(self) -> List[DeviceInventoryInDB]:
        devices = self.device_inventory_repository.get_all_devices()
        enriched_devices = []
        for device in devices:
            enriched_device = DeviceInventoryInDB(
                # Set only required fields explicitly
                cisco_domain=device.cisco_domain,
                contract_expiry=device.contract_expiry,
                contract_number=device.contract_number,
                created_by=device.created_by,
                criticality=device.criticality,
                department=device.department,
                device_id=device.device_id,
                device_name=device.device_name,
                device_ru=device.device_ru,
                domain=device.domain,
                hardware_version=device.hardware_version,
                hw_eol_date=device.hw_eol_date,
                hw_eos_date=device.hw_eos_date,
                item_code=device.item_code,
                item_desc=device.item_desc,
                manufacturer_date=device.manufacturer_date,
                manufacturer=device.manufacturer,
                modified_by=device.modified_by,
                parent=device.parent,
                patch_version=device.patch_version,
                pn_code=device.pn_code,
                site_id=device.site_id,
                rack_id=device.rack_id,
                rfs_date=device.rfs_date,
                section=device.section,
                serial_number=device.serial_number,
                software_version=device.software_version,
                source=device.source,
                stack=device.stack,
                status=device.status,
                sw_eol_date=device.sw_eol_date,
                sw_eos_date=device.sw_eos_date,
                tag_id=device.tag_id,
                apic_controller_id=device.apic_controller_id,

                # Convert SNTC fields
                hw_eol_ad=self.to_datetime(device.hw_eol_ad),
                hw_eos=self.to_datetime(device.hw_eos),
                sw_EoSWM=self.to_datetime(device.sw_EoSWM),
                hw_EoRFA=self.to_datetime(device.hw_EoRFA),
                sw_EoVSS=self.to_datetime(device.sw_EoVSS),
                hw_EoSCR=self.to_datetime(device.hw_EoSCR),
                hw_ldos=self.to_datetime(device.hw_ldos),

                # Additional fields
                site_name=device.site.site_name if device.site else None,
                rack_name=device.rack.rack_name if device.rack else None,
                device_ip=device.apic_controller.ip_address if device.apic_controller else None
            )
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
