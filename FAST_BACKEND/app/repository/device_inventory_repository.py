import sys
from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.model.device_inventory import DeviceInventory
from app.repository.base_repository import BaseRepository


class DeviceInventoryRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], influxdb_repository):
        super().__init__(session_factory, DeviceInventory)
        self.influxdb_repository = influxdb_repository

    def get_all_devices(self) -> List[DeviceInventory]:
        with self.session_factory() as session:
            return list(session.query(DeviceInventory).all())

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
