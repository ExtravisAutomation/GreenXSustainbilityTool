from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.services.device_inventory_service import DeviceInventoryService
from app.schema.device_inventory_schema import (DeviceInventoryCreate, DeviceInventoryUpdate,
                                                DeviceInventoryInDB,FilterSchema,VendorSchema,DeviceTypeSchema)
from app.core.dependencies import get_db
from fastapi.responses import FileResponse
from app.schema.device_inventory_schema import Custom_Response_Inventory,modelCreate
from app.core.dependencies import get_current_active_user
from app.model.user import User
from dependency_injector.wiring import Provide, inject
from app.core.container import Container
from app.schema.site_schema import CustomResponse


router = APIRouter(prefix="/device_inventory", tags=["Device Inventory"])



@router.post("/get_all_device_inventory", response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_all_devices(page:int=None,
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_all_devices(page)

    return Custom_Response_Inventory(
        message="Fetched all devices successfully",
        data=devices,
        status_code=200
    )
@router.post("/get_all_device_inventory_with_filter", response_model=Custom_Response_Inventory[List[DeviceInventoryInDB]])
@inject
def get_all_devices(filter_data:FilterSchema,

    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.get_all_devices_test(filter_data)

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
        site_id: Optional[int] = None,
        rack_id: Optional[int]=None,
        current_user: User = Depends(get_current_active_user),
        device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    vendors = device_inventory_service.get_vendor(site_id,rack_id)

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
@router.post("/get_sntc_expiry", response_model=CustomResponse)
@inject
def get_expiry(site_id: int,
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
               ):
    data = device_inventory_service.get_device_expiry(site_id)
    return CustomResponse(
        message="Fetched  data successfully",
        data=data,
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




@router.post("/generate_excel")
@inject
def generate_excel(filter_data:FilterSchema,
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    devices = device_inventory_service.generate_excel(filter_data)
    print(devices['pcr'])
    columns_to_drop = [
        '_sa_instance_state', 'created_at', 'device_id', 'item_desc', 'role', 'contract_number',
        'hardware_version',
        'parent', 'site_id', 'apic_controller_id', 'created_by', 'hw_eol_date',
        'manufacturer_date', 'status', 'sw_eol_date', 'updated_at', 'patch_version',
        'rfs_date', 'sw_eos_date', 'cisco_domain', 'device_ru', 'id', 'criticality', 'hw_eos_date',
        'section', 'tag_id', 'contract_expiry', 'domain', 'modified_by',
        'source', 'department', 'item_code', 'rack_id', 'stack',
        'apic_controller', 'rack', 'site', 'device'
    ]
    devices = devices.drop(columns=columns_to_drop, errors='ignore')  # errors='ignore' skips missing columns safely
    print(devices.columns,"After drop")
    devices.rename(columns={
        "device_name": "Device Name",
        "manufacturer": "Manufacturer",
        "serial_number": "Serial Number",
        "software_version": "Software Version",
        "pn_code": "Product Number (PN)",
        "hw_eol_ad": "HW End-of-Life (EoL)",
        "hw_eos": "HW End-of-Support (EoS)",
        "sw_EoSWM": "SW Maintenance EoL",
        "hw_EoRFA": "HW Last Date of RFA",
        "sw_EoVSS": "SW Vulnerability Support EoS",
        "hw_EoSCR": "HW Security Support EoS",
        "hw_ldos": "HW Last Day of Support",
        "rack_name": "Rack",
        "site_name": "Site",
        "ip_address": "IP Address",
        "device_type": "Device Type",
        "Energy Efficiency": "Energy Efficiency (%)",
        "pue": "Power Usage Effectiveness (PUE)",
        "power_input": "Power Input (W)",
        "power_output": "Power Output (W)",
        "datatraffic": "Data Traffic (GB)",
        "bandwidth_utilization": "Bandwidth Utilization (%)",
        "carbon_emission": "Carbon Emission (kgCO₂)",
        "pcr": "Power Consumption Ratio (W/Gbps)",
        "performance_score": "Performance Score",
        "performance_description": "Performance Description"
    }, inplace=True)

    print(devices['Power Consumption Ratio (W/Gbps)'])


    file_path = "device_report.xlsx"

    # Save DataFrame to an Excel file
    devices.to_excel(file_path, index=False, engine="openpyxl")
    return FileResponse(file_path, filename="device_report.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@router.get("/get_hardware_version",response_model=CustomResponse)
@inject
def get_hardwareversionsa(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    hardware_versions = device_inventory_service.get_hardware_versions()

    return CustomResponse(
        message="Fetched  hardware versions successfully",
        data=hardware_versions,
        status_code=200
    )
@router.get("/get_software_version",response_model=CustomResponse)
@inject
def get_software_versions(
    # current_user: User = Depends(get_current_active_user),
    device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    software_versions = device_inventory_service.get_software_versions()

    return CustomResponse(
        message="Fetched  software versions successfully",
        data=software_versions,
        status_code=200
    )



@router.post("/create_vendor/")
@inject
def create_vendor(vendor: VendorSchema, device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    vendor =device_inventory_service.add_vendor(vendor)
    return CustomResponse(
        message="vendor created successfully",
        data=vendor,
        status_code=200
    )


@router.post("/create_device_type/")
@inject
def create_device_type(device: DeviceTypeSchema, device_inventory_service: DeviceInventoryService = Depends(Provide[Container.device_inventory_service])
):
    device_type =device_inventory_service.add_device_type(device)
    return CustomResponse(
        message="Device Type created successfully",
        data=device_type,
        status_code=200
    )
