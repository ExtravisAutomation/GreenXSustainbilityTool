from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.device_inventory_service import DeviceInventoryService
from app.schema.device_inventory_schema import DeviceInventoryCreate, DeviceInventoryUpdate, DeviceInventoryInDB
from app.core.dependencies import get_db

from app.schema.device_inventory_schema import Custom_Response_Inventory
from app.core.dependencies import get_current_active_user
from app.model.user import User
from dependency_injector.wiring import Provide, inject
from app.core.container import Container

router = APIRouter(prefix="/device_inventory", tags=["Device Inventory"])


@router.get("/get_all_device_inventory", response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_all_devices(current_user: User = Depends(get_current_active_user),
                    device_inventory_service: DeviceInventoryService = Depends(
                        Provide[Container.device_inventory_service])):
    devices = device_inventory_service.get_all_devices()
    return Custom_Response_Inventory(
        message="Fetched all devices successfully",
        data=devices,
        status_code=200
    )


@router.get("get_device_inventory_by_id/{device_id}", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def get_device_by_id(device_id: int, current_user: User = Depends(get_current_active_user),
                     device_inventory_service: DeviceInventoryService = Depends(
                         Provide[Container.device_inventory_service])):
    device = device_inventory_service.get_device_by_id(device_id)
    return Custom_Response_Inventory(
        message="Fetched device successfully",
        data=device,
        status_code=200
    )


@router.post("/create_device_inventory", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def create_device(device_data: DeviceInventoryCreate,
                  current_user: User = Depends(get_current_active_user),
                  device_inventory_service: DeviceInventoryService = Depends(
                      Provide[Container.device_inventory_service])):
    new_device = device_inventory_service.create_device(device_data)
    return Custom_Response_Inventory(
        message="Device created successfully",
        data=new_device,
        status_code=201
    )


@router.put("update_device_inventory/{device_id}", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def update_device(device_id: int, device_data: DeviceInventoryUpdate,
                  current_user: User = Depends(get_current_active_user),
                  device_inventory_service: DeviceInventoryService = Depends(
                      Provide[Container.device_inventory_service])):
    updated_device = device_inventory_service.update_device(device_id, device_data)
    return Custom_Response_Inventory(
        message="Device updated successfully",
        data=updated_device,
        status_code=200
    )


@router.delete("delete_device_inventory/{device_id}", response_model=Custom_Response_Inventory[None])
@inject
def delete_device(device_id: int, current_user: User = Depends(get_current_active_user),
                  device_inventory_service: DeviceInventoryService = Depends(
                      Provide[Container.device_inventory_service])):
    device_inventory_service.delete_device(device_id)
    return Custom_Response_Inventory(
        message="Device deleted successfully",
        data=None,
        status_code=200
    )


@router.get("/get_device_inventory_with_power_utilization",
            response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_device_inventory_with_power_utilization(current_user: User = Depends(get_current_active_user),
                                                device_inventory_service: DeviceInventoryService = Depends(
                                                    Provide[Container.device_inventory_service])):
    devices = device_inventory_service.get_device_inventory_with_power_utilization()
    return Custom_Response_Inventory(
        message="Fetched all devices with power utilization",
        data=devices,
        status_code=200
    )
