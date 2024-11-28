from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.device_inventory_service import DeviceInventoryService
from app.schema.device_inventory_schema import DeviceInventoryCreate, DeviceInventoryUpdate, DeviceInventoryInDB
from app.core.dependencies import get_db

from app.schema.device_inventory_schema import Custom_Response_Inventory,modelCreate
from app.core.dependencies import get_current_active_user
from app.model.user import User
from dependency_injector.wiring import Provide, inject
from app.core.container import Container
from app.schema.site_schema import CustomResponse


router = APIRouter(prefix="/device_inventory", tags=["Device Inventory"])


@router.get("/get_all_device_inventory", response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_all_devices(
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_all_devices()
    
    return Custom_Response_Inventory(
        message="Fetched all devices successfully",
        data=devices,
        status_code=200
    )


@router.get("get_device_inventory_by_id/{device_id}", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def get_device_by_id(
    device_id: int, 
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    device = device_inventory_service.get_device_by_id(device_id)
    
    return Custom_Response_Inventory(
        message="Fetched device successfully",
        data=device,
        status_code=200
    )


@router.post("/create_device_inventory", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def create_device(
    device_data: DeviceInventoryCreate,
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    new_device = device_inventory_service.create_device(device_data)
    
    return Custom_Response_Inventory(
        message="Device created successfully",
        data=new_device,
        status_code=201
    )


@router.put("update_device_inventory/{device_id}", response_model=Custom_Response_Inventory[DeviceInventoryInDB])
@inject
def update_device(
    device_id: int, 
    device_data: DeviceInventoryUpdate,
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    updated_device = device_inventory_service.update_device(device_id, device_data)
    
    return Custom_Response_Inventory(
        message="Device updated successfully",
        data=updated_device,
        status_code=200
    )


@router.delete("delete_device_inventory/{device_id}", response_model=Custom_Response_Inventory[None])
@inject
def delete_device(
    device_id: int,
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    device_inventory_service.delete_device(device_id)
    
    return Custom_Response_Inventory(
        message="Device deleted successfully",
        data=None,
        status_code=200
    )


@router.get("/get_device_inventory_with_power_utilization", response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_device_inventory_with_power_utilization(
    current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_device_inventory_with_power_utilization()
    
    return Custom_Response_Inventory(
        message="Fetched all devices with power utilization",
        data=devices,
        status_code=200
    )



# Created by Ahmed
@router.get("/chasis", response_model=CustomResponse)
@inject
def chasis(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    chasis = device_inventory_service.chasis()
    
    return CustomResponse(
        message="Fetched all chassis successfully",
        data=chasis,
        status_code=status.HTTP_200_OK
    )
    
    
    
@router.get("/chasis", response_model=CustomResponse)
@inject
def chasis(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    chasis = device_inventory_service.chasis()
    
    return CustomResponse(
        message="Fetched all chassis successfully",
        data=chasis,
        status_code=status.HTTP_200_OK
    )
    
    

@router.get("/modules", response_model=CustomResponse)
@inject
def modules(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    modules = device_inventory_service.modules()
    
    return CustomResponse(
        message="Fetched all modules successfully",
        data=modules,
        status_code=status.HTTP_200_OK
    )
    
    
    
@router.get("/powerSupply", response_model=CustomResponse)
@inject
def power_supply(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    power_supply = device_inventory_service.power_supply()
    
    return CustomResponse(
        message="Fetched all Power Supply successfully",
        data=power_supply,
        status_code=status.HTTP_200_OK
    )
    
    
    
@router.get("/fans", response_model=CustomResponse)
@inject
def fans(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    fans = device_inventory_service.fans()
    
    return CustomResponse(
        message="Fetched all Fans successfully",
        data=fans,
        status_code=status.HTTP_200_OK
    )


@router.post("/deviceLastPowerUtiization", response_model=List)
@inject
def device_power(
    apic_api: str,
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    return device_inventory_service.device_power(apic_api)



@router.post("/get_specific_device_inventory", response_model=CustomResponse)
@inject
def get_spcific_devices(
    device_ip: str,
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_spcific_devices(device_ip)
    
    return CustomResponse(
        message="Fetched device data successfully",
        data=devices,
        status_code=200
    )


@router.post("/get_model_Count", response_model=CustomResponse)
@inject
def get_model_names(
        model_data:modelCreate,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_models(model_data)

    return CustomResponse(
        message="Fetched model data successfully",
        data=models,
        status_code=200
    )


@router.post("/devicetype_count", response_model=CustomResponse)
@inject
def device_type(
        model_data:modelCreate,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_device_type(model_data)

    return CustomResponse(
        message="Fetched devices type count successfully",
        data=devices,
        status_code=200
    )
@router.get("/get_vendors", response_model=CustomResponse)
@inject
def get_vendors(
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    vendors = device_inventory_service.get_vendor()

    return CustomResponse(
        message="Fetched vendors data successfully",
        data=vendors,
        status_code=200
    )
@router.get("/get_count", response_model=CustomResponse)
@inject
def get_count(
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_count()

    return CustomResponse(
        message="Fetched model data successfully",
        data=models,
        status_code=200
    )
@router.post("/get_device_nature", response_model=CustomResponse)
@inject
def get_count(
        device_nature: modelCreate,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_device_nature(device_nature)

    return CustomResponse(
        message="Fetched model data successfully",
        data=models,
        status_code=200
    )
@router.post("/get_device_type", response_model=CustomResponse)
@inject
def get_count(
        device_nature: modelCreate,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_device_nature(device_nature)

    return CustomResponse(
        message="Fetched model data successfully",
        data=models,
        status_code=200
    )




@router.post("/get_device_type", response_model=CustomResponse)
@inject
def get_count(
        device_nature: modelCreate,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_device_nature(device_nature)

    return CustomResponse(
        message="Fetched model data successfully",
        data=models,
        status_code=200
    )



@router.get("/get_vendor_count", response_model=CustomResponse)
@inject
def get_count(

        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    models = device_inventory_service.get_vendor_count()

    return CustomResponse(
        message="Fetched vendor data successfully",
        data=models,
        status_code=200
    )


