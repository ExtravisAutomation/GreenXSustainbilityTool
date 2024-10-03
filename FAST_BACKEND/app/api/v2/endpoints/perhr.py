from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schema.perhr_schema import ApicControllerInput
from app.services.perhr_service import PerhrService
from app.core.container import Container
from dependency_injector.wiring import inject, Provide
from app.model.user import User
from app.core.dependencies import get_current_active_user

router = APIRouter(tags=["Perhr: Per Hour APIS"])

@router.post("/devicePowerperhr", response_model=List)
@inject
def device_power_perhr(
    apic_ip_data: ApicControllerInput,
    # current_user: User = Depends(get_current_active_user),
    perhr_service: PerhrService = Depends(Provide[Container.perhr_service])
):
    return perhr_service.device_power_perhr(apic_ip_data)
    
    
@router.post("/devicetrafficperhr", response_model=List)
@inject
def device_traffic_perhr(
    apic_ip_data: ApicControllerInput,
    # current_user: User = Depends(get_current_active_user),
    perhr_service: PerhrService = Depends(Provide[Container.perhr_service])
):
    return perhr_service.device_traffic_perhr(apic_ip_data)

