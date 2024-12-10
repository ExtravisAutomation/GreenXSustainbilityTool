import sys
import time
from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.site_schema import CustomResponse
from app.schema.vcenter_schema import hostnameInput
from app.services.vcenter_service import VcenterService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from logging import getLogger


router = APIRouter(prefix="/vcenter", tags=["VCENTER"])
logger = getLogger(__name__)


@router.post("/gethostdetails", response_model=CustomResponse)
@inject
def get_vms(
    # current_user: User = Depends(get_current_active_user),
    vcenter_service: VcenterService = Depends(Provide[Container.vcenter_service])
):
    host_details = vcenter_service.get_host_details()
    return CustomResponse(
        message="Fetched all vcenter host details successfully",
        data=host_details,
        status_code=status.HTTP_200_OK
    )
    
    
@router.get("/getallvms", response_model=CustomResponse)
@inject
def get_vms(
    # current_user: User = Depends(get_current_active_user),
    vcenter_service: VcenterService = Depends(Provide[Container.vcenter_service])
):
    all_vms = vcenter_service.get_all_vms()
    print(all_vms)
    return CustomResponse(
        message="Fetched all vcenter VMs successfully",
        data=all_vms,
        status_code=status.HTTP_200_OK
    )


@router.post("/getHourlyStorage", response_model=List)
@inject
def get_hourly_storage(
    hostname_data: hostnameInput,
    # current_user: User = Depends(get_current_active_user),
    vcenter_service: VcenterService = Depends(Provide[Container.vcenter_service])
):
    return vcenter_service.get_hourly_storage(hostname_data)


@router.post("/getusages", response_model=List)
@inject
def get_usages(
    hostname_data: hostnameInput,
    # current_user: User = Depends(get_current_active_user),
    vcenter_service: VcenterService = Depends(Provide[Container.vcenter_service])
):
    return vcenter_service.get_usages(hostname_data)


@router.post("/getvmsdetails", response_model=CustomResponse)
@inject
def get_vms_details(
    hostname_data: hostnameInput,
    # current_user: User = Depends(get_current_active_user),
    vcenter_service: VcenterService = Depends(Provide[Container.vcenter_service])
):
    vms_details = vcenter_service.get_vms_details(hostname_data)
    
    return CustomResponse(
        message="Fetched all vcenter VMs successfully",
        data=vms_details,
        status_code=status.HTTP_200_OK
    )
