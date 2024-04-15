import sys
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.site_repository import SiteRepository
from app.schema.site_schema import SiteCreate, SiteUpdate, Site, FindSiteResult, GetSitesResponse, SiteDetails, \
    CustomResponse, CustomResponse1, ComparisonDeviceMetricsDetails, ComparisonTrafficMetricsDetails, \
    DevicePowerComparisonPercentage
from app.services.site_service import SiteService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from starlette.responses import JSONResponse
from app.schema.site_schema import SiteDetails1
from app.schema.site_schema import SitePowerConsumptionResponse

from app.schema.site_schema import EnergyConsumptionMetricsDetails

from app.schema.site_schema import HourlyEnergyMetricsResponse

from app.schema.site_schema import HourlyDevicePowerMetricsResponse

from app.schema.site_schema import TopDevicesPowerResponse

from app.schema.site_schema import TrafficThroughputMetricsDetails

from app.schema.site_schema import TrafficThroughputMetricsResponse

router = APIRouter(prefix="/sites", tags=["SITES"])


class DeleteRequest(BaseModel):
    site_ids: List[int]


@router.get("/getallsites", response_model=CustomResponse1[GetSitesResponse])
@inject
def get_sites(current_user: User = Depends(get_current_active_user),
              site_service: SiteService = Depends(Provide[Container.site_service])):
    sites = site_service.get_sites()
    return CustomResponse(
        message="Fetched all sites successfully",
        data=sites,
        status_code=status.HTTP_200_OK
    )


@router.post("/addsite", response_model=CustomResponse[SiteDetails])
@inject
def add_site(site_data: SiteCreate, current_user: User = Depends(get_current_active_user),
             site_service: SiteService = Depends(Provide[Container.site_service])):
    site = site_service.create_site(site_data)
    return CustomResponse(
        message="Site created successfully",
        data=site,
        status_code=status.HTTP_200_OK
    )


@router.post("/updatesite/{id}", response_model=CustomResponse[SiteDetails1])
@inject
def update_site(id: int, site_data: SiteUpdate, current_user: User = Depends(get_current_active_user),
                site_service: SiteService = Depends(Provide[Container.site_service])):
    try:
        site = site_service.update_site(id, site_data)
        return CustomResponse(
            message="Site updated successfully",
            data=site,
            status_code=status.HTTP_200_OK
        )
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})


@router.post("/deletesite", response_model=CustomResponse[None])
@inject
def delete_site(site_id: int, current_user: User = Depends(get_current_active_user),
                site_service: SiteService = Depends(Provide[Container.site_service])):
    site_service.delete_site(site_id)
    return CustomResponse(
        message="Site deleted successfully",
        data=None,
        status_code=status.HTTP_200_OK
    )


@router.post("/deletesites", response_model=CustomResponse[None])
@inject
def delete_sites(request: DeleteRequest, current_user: User = Depends(get_current_active_user),
                 site_service: SiteService = Depends(Provide[Container.site_service])):
    site_service.delete_sites(request.site_ids)
    return CustomResponse(
        message="Sites deleted successfully",
        data=None,
        status_code=status.HTTP_200_OK
    )


@router.get("/sites/power_summary_metrics/{site_id}", response_model=CustomResponse[SitePowerConsumptionResponse])
@inject
def get_site_power_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    power_metrics = site_service.calculate_site_power_metrics_by_id(site_id)
    return CustomResponse(
        message="Power consumption metrics retrieved successfully",
        data=power_metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/sites/energy_consumption_metrics/{site_id}",
            response_model=CustomResponse[list[EnergyConsumptionMetricsDetails]])
@inject
def get_energy_consumption_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.calculate_energy_consumption_by_id(site_id)
    return CustomResponse(
        message="Energy consumption metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/KPI_on_click/{site_id}", response_model=HourlyEnergyMetricsResponse)
@inject
def get_hourly_energy_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.calculate_hourly_energy_metrics(site_id)


@router.get("/site/POWER_METRICS_on_click/{site_id}", response_model=HourlyDevicePowerMetricsResponse)
@inject
def get_detailed_hourly_power_metrics_for_site(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.calculate_hourly_power_metrics_for_each_device(site_id)


@router.get("/site/device_specific_comparison/{site_id}", response_model=HourlyDevicePowerMetricsResponse)
@inject
def compare_devices_metrics(
        site_id: int,
        device_name1: Optional[str] = Query(None, alias="device_name1"),
        device_name2: Optional[str] = Query(None, alias="device_name2"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    device_name1 = device_name1 or "RYD-SLY-00-F14"
    device_name2 = device_name2 or "RYD-SLY-00-AF14"
    # device_name1 = device_name1 or "Device2"
    # device_name2 = device_name2 or "Device3"
    return site_service.compare_devices_hourly_power_metrics(site_id, device_name1, device_name2)


@router.get("/site/pie_chart/{site_id}", response_model=dict[str, int])
@inject
def read_eol_eos_counts(site_id: int,
                        current_user: User = Depends(get_current_active_user),
                        site_service: SiteService = Depends(Provide[Container.site_service])):
    try:
        eol_eos_counts = site_service.get_eol_eos_counts_for_site(site_id)
        return eol_eos_counts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/site/top_devices_power_cost/{site_id}", response_model=TopDevicesPowerResponse)
@inject
def get_top_5_power_devices(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    return site_service.get_top_5_power_devices(site_id)


@router.get("/site/traffic_throughput_metrics/{site_id}",
            response_model=CustomResponse[List[TrafficThroughputMetricsDetails]])
@inject
def get_traffic_throughput_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.calculate_traffic_throughput_by_id(site_id)
    return CustomResponse(
        message="Traffic throughput metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/traffic_throughput_metrics_by_device/{site_id}/{device_name}",
            response_model=CustomResponse[List[TrafficThroughputMetricsDetails]])
@inject
def get_device_data_metrics(
        site_id: int,
        device_name: str,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.calculate_device_data_by_name(site_id, device_name)
    return CustomResponse(
        message="Device data metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/TRAFFIC_THROUGHPUT_on_click/{site_id}", response_model=TrafficThroughputMetricsResponse)
@inject
def get_site_traffic_throughput_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.calculate_site_traffic_throughput_metrics(site_id)
    return metrics


@router.get("/site/devices_name/{site_id}", response_model=CustomResponse[List[str]])
@inject
def get_device_names_by_site_id(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        device_names = site_service.get_device_names_by_site_id1(site_id)
        return CustomResponse(
            message="Device names fetched successfully",
            data=device_names,
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/site/rack_by_id/{site_id}/{rack_id}", response_model=CustomResponse[Dict[str, Any]])
@inject
def get_device_metrics_by_site_and_rack(
        site_id: int,
        rack_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        device_metrics = site_service.get_device_metrics_by_site_and_rack(site_id, rack_id)
        return CustomResponse(
            message="Device metrics fetched successfully",
            data=device_metrics,
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/site/TOP_DEVICES_on_click/{site_id}/{device_id}")
@inject
def get_device_metrics(
        site_id: int,
        device_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    metrics = site_service.fetch_hourly_device_data(site_id, device_id)
    return metrics


@router.get("/sites/energy_consumption_metrics_WITH_FILTER/{site_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails]])
@inject
def get_energy_consumption_metrics(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    metrics = site_service.calculate_energy_consumption_by_id_with_filter(site_id, duration)
    return CustomResponse(
        message="Energy consumption metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/traffic_throughput_metrics_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[TrafficThroughputMetricsDetails]])
@inject
def get_traffic_throughput_metrics(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    metrics = site_service.calculate_traffic_throughput_by_id_with_filter(site_id, duration)
    print("endpointtttttttttttttttttttttttttttttttttttttt", metrics, file=sys.stderr)
    return CustomResponse1(
        message="Traffic throughput metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/top_devices_power_cost_WITH_FILTER/{site_id}", response_model=TopDevicesPowerResponse)
@inject
def get_top_5_power_devices(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    duration = duration or "24 hours"
    return site_service.get_top_5_power_devices_with_filter(site_id, duration)


@router.get("/site/traffic_throughput_metrics_by_device_WITH_FILTER/{site_id}/{device_name}",
            response_model=CustomResponse1[List[TrafficThroughputMetricsDetails]])
@inject
def get_device_data_metrics(
        site_id: int,
        device_name: str,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    metrics = site_service.calculate_device_data_by_name_with_filter(site_id, device_name, duration)
    return CustomResponse1(
        message="Device data metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/device_specific_comparison_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[List[ComparisonDeviceMetricsDetails]]])
@inject
def compare_two_devices_metrics(
        site_id: int,
        device_name1: Optional[str] = Query(..., description="Name of the first device"),
        device_name2: Optional[str] = Query(..., description="Name of the second device"),
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    device_name1 = device_name1 or "RYD-SLY-00-AF14"
    device_name2 = device_name2 or "RYD-SLY-00-AF15"
    metrics = site_service.compare_device_data_by_names_and_duration(site_id, device_name1, device_name2, duration)
    return CustomResponse1(
        message="Device comparison metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/device_traffic_comparison_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[ComparisonTrafficMetricsDetails]])
@inject
def compare_two_devices_traffic(
        site_id: int,
        device_name1: Optional[str] = Query(..., description="Name of the first device"),
        device_name2: Optional[str] = Query(..., description="Name of the second device"),
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    device_name1 = device_name1 or "RYD-SLY-00-AF14"
    device_name2 = device_name2 or "RYD-SLY-00-AF15"
    metrics = site_service.compare_device_traffic_by_names_and_duration(site_id, device_name1, device_name2, duration)
    return CustomResponse1(
        message="Device traffic comparison metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/device_power_comparison_percentage_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[DevicePowerComparisonPercentage]])
@inject
def compare_two_devices_power_percentage(
        site_id: int,
        device_name1: Optional[str] = Query(..., description="Name of the first device"),
        device_name2: Optional[str] = Query(..., description="Name of the second device"),
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    device_name1 = device_name1 or "RYD-SLY-00-AF14"
    device_name2 = device_name2 or "RYD-SLY-00-AF15"
    comparison = site_service.compare_device_power_percentage_by_names_and_duration(site_id, device_name1, device_name2,
                                                                                    duration)
    return CustomResponse1(
        message="Device power percentage comparison retrieved successfully",
        data=comparison,
        status_code=status.HTTP_200_OK
    )
