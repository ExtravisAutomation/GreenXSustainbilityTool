import sys
import time

from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.dashboard_schema import CustomResponse,MetricesPayload
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from logging import getLogger

from requests import Session
from starlette.responses import JSONResponse
from app.services.dashboard_service import DashboardService

from app.schema.dashboard_schema import DevicePayload

router = APIRouter(prefix="/dashboard", tags=["Dashboard Module"])


@router.post("/metrics", response_model=CustomResponse)
@inject
def get_metrics(filter_data: MetricesPayload,
    # current_user: User = Depends(get_current_active_user),
    dashboard_service: DashboardService = Depends(Provide[Container.dashboard_services])):

    data=dashboard_service.get_metrics_info(payload=filter_data)
    print(data,"datata")
    return CustomResponse(
        message="*Metrics Data Retrieved Successfully*",
        data=data,
        status_code=status.HTTP_200_OK
    )


@router.post("/energy-traffic-trends", response_model=CustomResponse)
@inject
def get_metrics(filter_data: MetricesPayload,
    # current_user: User = Depends(get_current_active_user),
    dashboard_service: DashboardService = Depends(Provide[Container.dashboard_services])):

    data=dashboard_service.get_energy_traffic_data_timeline(payload=filter_data)
    return CustomResponse(
        message="Energy Efficiency data Retrieved Successfully*",
        data=data,
        status_code=status.HTTP_200_OK
    )



@router.post("/peak_low_devices", response_model=CustomResponse)
@inject
def get_peak_low_devices(filter_data: MetricesPayload,
    # current_user: User = Depends(get_current_active_user),
    dashboard_service: DashboardService = Depends(Provide[Container.dashboard_services])):

    data=dashboard_service.get_peak_low_devices(payload=filter_data)
    return CustomResponse(
        message="Energy Efficiency data Retrieved Successfully*",
        data=data,
        status_code=status.HTTP_200_OK
    )
@router.post("/get_devices_co2emmision_pcr", response_model=CustomResponse)
@inject
def devices_co2emmision_pcr(filter_data: DevicePayload,
    # current_user: User = Depends(get_current_active_user),
    dashboard_service: DashboardService = Depends(Provide[Container.dashboard_services])):

    data=dashboard_service.get_devices_co2emmision_pcr(payload=filter_data)
    return CustomResponse(
        message="Emission and PCR Retrieved Successfully*",
        data=data,
        status_code=status.HTTP_200_OK
    )