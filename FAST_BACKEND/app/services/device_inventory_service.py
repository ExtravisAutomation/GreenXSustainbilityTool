from typing import List
from app.repository.device_inventory_repository import DeviceInventoryRepository
from app.schema.device_inventory_schema import DeviceInventoryCreate, DeviceInventoryUpdate, DeviceInventoryInDB


class DeviceInventoryService:
    def __init__(self, device_inventory_repository: DeviceInventoryRepository):
        self.device_inventory_repository = device_inventory_repository

    def get_all_devices(self) -> List[DeviceInventoryInDB]:
        devices = self.device_inventory_repository.get_all_devices()
        return [DeviceInventoryInDB.from_orm(device) for device in devices]

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
