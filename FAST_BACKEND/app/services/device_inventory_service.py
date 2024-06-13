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

    def create_device2(self, device_data: APICControllersCreate) -> APICControllers:
        with self.session_factory() as session:
            db_device = APICControllers(**device_data.dict())
            session.add(db_device)
            session.commit()
            session.refresh(db_device)
            return db_device

    def get_all_devices2(self) -> List[APICControllers]:
        with self.session_factory() as session:
            return session.query(APICControllers).all()

    def update_device2(self, device_id: int, device_data: APICControllersUpdate) -> APICControllers:
        with self.session_factory() as session:
            db_device = session.query(APICControllers).filter(APICControllers.id == device_id).first()
            for key, value in device_data.dict().items():
                setattr(db_device, key, value)
            session.commit()
            session.refresh(db_device)
            return db_device

    def delete_devices2(self, device_ids: List[int]) -> None:
        with self.session_factory() as session:
            session.query(APICControllers).filter(APICControllers.id.in_(device_ids)).delete(synchronize_session=False)
            session.commit()
