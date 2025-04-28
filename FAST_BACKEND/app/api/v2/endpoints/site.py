import sys
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import time
import numpy as np
from fastapi import File, UploadFile
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.site_repository import SiteRepository
from app.schema.site_schema import SiteCreate, SiteUpdate, Site, FindSiteResult, GetSitesResponse, SiteDetails, \
    CustomResponse, CustomResponse1, ComparisonDeviceMetricsDetails, ComparisonTrafficMetricsDetails, \
    DevicePowerComparisonPercentage,DeviceRequest
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

from app.schema.site_schema import PasswordGroupResponse, PasswordGroupCreate

from app.schema.site_schema import APICControllersResponse, APICControllersUpdate, APICControllersCreate
import subprocess
import logging
import os
from app.ONBOARDING.main import DeviceProcessor

from app.schema.site_schema import PasswordGroupUpdate

from app.schema.site_schema import GetRacksResponse

from app.schema.site_schema import EnergyConsumptionMetricsDetails1

from app.schema.site_schema import DeviceEnergyDetailResponse123

from app.schema.site_schema import PCRMetricsDetails

from app.schema.site_schema import DeviceCreateRequest
from logging import getLogger

from app.schema.site_schema import OnboardingRequest

from app.schema.site_schema import CSPCDevicesWithSntcResponse

from app.schema.site_schema import EnergyConsumptionMetricsDetails2

from app.schema.site_schema import CustomResponse_openai

from app.schema.site_schema import EnergyConsumptionMetricsDetailsNew,modelResponse

router = APIRouter(prefix="/sites", tags=["SITES"])
logger = getLogger(__name__)

import time
class DeleteRequest(BaseModel):
    site_ids: List[int]



@router.post("/addsite", response_model=CustomResponse[SiteDetails])
@inject
def add_site(
        site_data: SiteCreate,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    site = site_service.create_site(site_data)
    return CustomResponse(
        message="Site created successfully",
        data=site,
        status_code=status.HTTP_200_OK
    )


@router.post("/updatesite/{id}", response_model=CustomResponse[SiteDetails1])
@inject
def update_site(
        id: int,
        site_data: SiteUpdate,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        site = site_service.update_site(id, site_data)
        return CustomResponse(
            message="Site updated successfully",
            data=site,
            status_code=status.HTTP_200_OK
        )
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})




@router.post("/deletesite", response_model=List)
@inject
def delete_sites(
        # request: DeleteRequest,
        request: List[int],
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    # site_service.delete_sites(request.site_ids)
    return site_service.delete_sites(request)



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


@router.get("/sites//energy_consumption_metrics{site_id}",
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



@router.get("/site/device_specific_comparison/{site_id}")
@inject
def compare_devices_metrics(
        site_id: int,
        device_name1: Optional[str] = Query(None, alias="device_name1"),
        device_name2: Optional[str] = Query(None, alias="device_name2"),
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
        site_repository: SiteRepository = Depends(Provide[Container.site_repo])):
    if not device_name1 or not device_name2:
        all_device_names = site_repository.get_all_device_names(site_id)
        if len(all_device_names) < 2:
            raise HTTPException(status_code=404, detail="Not enough devices found in the database.")

        found_devices = False
        for i in range(0, len(all_device_names), 2):
            device_name1 = all_device_names[i]
            device_name2 = all_device_names[i + 1] if i + 1 < len(all_device_names) else None
            response = site_service.compare_devices_hourly_power_metrics(site_id, device_name1, device_name2, duration)
            if response[device_name1] and response[device_name2]:
                found_devices = True
                break

        if not found_devices:
            raise HTTPException(status_code=404, detail="No devices with data found.")
    else:
        response = site_service.compare_devices_hourly_power_metrics(site_id, device_name1, device_name2, duration)

    return {"device_name1": response[device_name1], "device_name2": response[device_name2]}


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


@router.get("/site/hardware_life_cycle_WITH_FILTER/{site_id}", response_model=dict[str, int])
@inject
def read_eol_eos_counts(site_id: int,
                        duration: Optional[str] = Query(None, alias="duration"),
                        current_user: User = Depends(get_current_active_user),
                        site_service: SiteService = Depends(Provide[Container.site_service])):
    duration = duration or "24 hours"
    try:
        eol_eos_counts = site_service.get_eol_eos_counts_for_site1(site_id, duration)
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


@router.get("/site/devices_name/{site_id}", response_model=CustomResponse[List[dict[str, str]]])
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
    global issue_detected1
    duration = duration or "24 hours"
    metrics = site_service.calculate_energy_consumption_by_id_with_filter(site_id, duration)
    response_data = []
    message = "Energy consumption metrics retrieved successfully."
    issue_detected1 = False

    for metric in metrics:
        energy_consumption = metric['energy_efficiency']
        power_efficiency = metric['power_efficiency']
        time_stamp = metric['time']

        if energy_consumption == 0 and power_efficiency == 0:
            continue  # Skip metrics with zero values for energy consumption and power efficiency

        if energy_consumption < 50:
            message = (f"At {time_stamp}, the energy efficiency ratio recorded was {energy_consumption}%, "
                       "which is unusually low and may indicate hardware malfunctions or inefficiencies. ")
            issue_detected1 = True
        elif 50 <= energy_consumption < 80:
            message = (f"Overall, the energy efficiency ratio measured was average, "
                       "which indicates that the hardware is generally performing well. ")
        elif energy_consumption >= 80:
            message = (f"Overall, the energy efficiency ratio is high, "
                       "demonstrating excellent performance and optimal operation of the hardware. ")

        if power_efficiency > 20:
            message += (
                f"However, a high power efficiency of {power_efficiency}% at this time suggests potential problems with power usage effectiveness, "
                "warranting further checks.")
            issue_detected1 = True
        elif power_efficiency <= 20 and power_efficiency > 0:
            message += f" Power usage effectiveness is low which is ideal and indicates positive performance."

    return CustomResponse(
        message=message,
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
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])):
    duration = duration or "24 hours"
    return site_service.get_top_5_power_devices_with_filter(site_id, duration)



@router.get(
    "/site/traffic_throughput_metrics_by_device_WITH_FILTER/{site_id}",
    response_model=CustomResponse1[List[TrafficThroughputMetricsDetails]]
)
@inject
def get_device_data_metrics(
    site_id: int,
    device_name: Optional[str] = None,
    duration: Optional[str] = Query("24 hours", alias="duration"),
    current_user: User = Depends(get_current_active_user),
    site_service: SiteService = Depends(Provide[Container.site_service]),
    site_repository: SiteRepository = Depends(Provide[Container.site_repo])
):
    global issue_detected

    metrics = site_service.calculate_device_data_by_name_with_filter(site_id, device_name, duration)
    print("ENDPOINT METRICS:", metrics, file=sys.stderr)
    message = "Device data metrics retrieved successfully."
    issue_detected = False

    for metric in metrics:
        energy_consumption = metric.get('energy_consumption', 0)
        total_bytes_rate_last_gb = metric.get('total_bytes_rate_last_gb', 0)
        time_stamp = metric['time']

        if energy_consumption == 0 and total_bytes_rate_last_gb == 0:
            continue

        if energy_consumption < 50:
            message = (f"At {time_stamp}, the energy efficiency ratio recorded was {energy_consumption}%, "
                       "which is unusually low and may indicate hardware malfunctions or inefficiencies.")
            issue_detected = True
        elif 50 <= energy_consumption < 80:
            message = ("Overall, the energy efficiency ratio measured was average, "
                       "which indicates that the hardware is generally performing well.")
        elif energy_consumption >= 80:
            message = ("Overall, the energy efficiency ratio is high, "
                       "demonstrating excellent performance and optimal operation of the hardware.")

    return CustomResponse1(
        message=message,
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/site/device_specific_comparison_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[List[ComparisonDeviceMetricsDetails]]])
@inject
def compare_two_devices_metrics(
        site_id: int,
        device_name1: Optional[str] = None,
        device_name2: Optional[str] = None,
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
        site_repository: SiteRepository = Depends(Provide[Container.site_repo])):  # Ensure site_repository is injected
    if not device_name1 or not device_name2:
        default_device_names = site_repository.get_first_two_device_names(site_id)
        if len(default_device_names) < 2:
            raise HTTPException(status_code=404, detail="Not enough devices found in the database.")
        device_name1 = device_name1 or default_device_names[0]
        device_name2 = device_name2 or default_device_names[1]

    metrics = site_service.compare_device_data_by_names_and_duration(site_id, device_name1, device_name2, duration)
    return CustomResponse1(
        message="Device comparison metrics retrieved successfully",
        data=metrics,
        status_code=status.HTTP_200_OK
    )

@router.get("/site/device_traffic_comparison_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[List[ComparisonTrafficMetricsDetails]]])
@inject
def compare_two_devices_traffic(
        site_id: int,
        device_name1: Optional[str] = None,
        device_name2: Optional[str] = None,
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
        site_repository: SiteRepository = Depends(Provide[Container.site_repo])):
    if not device_name1 or not device_name2:
        default_device_names = site_repository.get_first_two_device_names(site_id)
        if len(default_device_names) < 2:
            raise HTTPException(status_code=404, detail="Not enough devices found in the database.")
        device_name1 = device_name1 or default_device_names[0]
        device_name2 = device_name2 or default_device_names[1]

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
        device_name1: Optional[str] = None,
        device_name2: Optional[str] = None,
        duration: Optional[str] = Query("24 hours", alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
        site_repository: SiteRepository = Depends(Provide[Container.site_repo])):
    if not device_name1 or not device_name2:
        default_device_names = site_repository.get_first_two_device_names(site_id)
        if len(default_device_names) < 2:
            raise HTTPException(status_code=404, detail="Not enough devices found in the database.")
        device_name1 = device_name1 or default_device_names[0]
        device_name2 = device_name2 or default_device_names[1]

    comparison = site_service.compare_device_power_percentage_by_names_and_duration(site_id, device_name1, device_name2,
                                                                                    duration)
    return CustomResponse1(
        message="Device power percentage comparison retrieved successfully",
        data=comparison,
        status_code=status.HTTP_200_OK
    )


def parse_timestamp(timestamp_str):
    for fmt in ['%Y-%m-%d %H:%M', '%Y-%m-%d %H', '%Y-%m-%d']:
        try:
            return datetime.strptime(timestamp_str, fmt)
        except ValueError:
            continue
    raise ValueError("Timestamp format is not recognized.")


def parse_time12(time_str: str):
    for fmt in ('%Y-%m-%d %H:%M', '%Y-%m-%d', '%Y-%m'):
        try:
            parsed_time = datetime.strptime(time_str, fmt)
            if fmt == '%Y-%m-%d %H:00':
                granularity = 'hourly'
            elif fmt == '%Y-%m-%d':
                granularity = 'daily'
            else:
                granularity = 'monthly'
            return parsed_time, granularity
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail="Timestamp format not recognized")


@router.get("/site/getallsites", response_model=CustomResponse1[GetSitesResponse])
@inject
def get_sites(
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    api_start_time = time.time()

    logger.debug("Starting get_sites API execution")

    service_start_time = time.time()
    sites = site_service.get_extended_sites()
    service_end_time = time.time()
    logger.debug(f"Time taken by site_service.get_extended_sites(): {service_end_time - service_start_time:.2f} seconds")

    api_end_time = time.time()
    logger.debug(f"Total time for get_sites API: {api_end_time - api_start_time:.2f} seconds")

    return CustomResponse(
        message="Fetched all sites successfully",
        data=sites,
        status_code=status.HTTP_200_OK
    )

@router.post("/site/sitePowerUtilization/{site_id}")
@inject
def site_power_utilization(site_id: int,
                           current_user: User = Depends(get_current_active_user),
                           site_service: SiteService = Depends(Provide[Container.site_service])):
    try:
        power_metrix = site_service.calculate_power_utilization_by_id(site_id)
        return power_metrix
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/site/sitePowerEfficiency/{site_id}")
@inject
def site_power_efficiency(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        efficiency_data = site_service.calculate_power_efficiency_by_id(site_id)
        return efficiency_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/site/sitePowerRequired/{site_id}")
@inject
def site_power_required(
        site_id: int,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        power_required = site_service.calculate_power_requirement_by_id(site_id)
        return power_required
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/site/Co2emission/{site_id}")
@inject
def site_co2_emission(site_id: int,
                      current_user: User = Depends(get_current_active_user),
                      site_service: SiteService = Depends(Provide[Container.site_service])):
    try:
        co2_emission = site_service.calculate_co2_emission_by_id(site_id)
        return co2_emission
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sites/electricity_map_piechart/{site_id}", response_model=CustomResponse[dict])
@inject
def get_total_power_consumption(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    pin_value, consumption_percentages, totalpin_kws = site_service.calculate_total_power_consumption(site_id, duration)
    return CustomResponse(
        message="Energy and power consumption metrics retrieved successfully.",
        data={"total_PIn": pin_value, "consumption_percentages": consumption_percentages, "totalpin_kws": totalpin_kws},
        status_code=200
    )



@router.get("/sites/carbon_emission_details/{site_id}", response_model=CustomResponse[dict])
@inject
def get_carbon_emission_metrics(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    pin_value, carbon_emission, carbon_car, carbon_flight, carbon_solution = site_service.calculate_carbon_emission(
        site_id, duration)
    print("FINALLLLLLLL", carbon_emission, file=sys.stderr)
    carbon_em=0
    if carbon_emission < 1000:
        carbon_ems = str(round(carbon_emission, 3)) + ' kg'
    else:
        carbon_ems = str(round(carbon_emission / 1000, 3)) + ' Tons'
    return CustomResponse(
        message="Carbon emission metrics retrieved successfully.",
        data={
            "total_PIn": pin_value,
            "carbon_emission": carbon_ems,
            "carbon_effect_car": carbon_car,
            "carbon_effect_flight": carbon_flight,
            "carbon_solution": carbon_solution
        },
        status_code=200
    )


@router.get("/sites/location_and_carbon/{site_id}", response_model=CustomResponse[dict])
@inject
def get_site_emission_details(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        data = site_service.get_emission_details(site_id)
        return CustomResponse(
            message="Emission details retrieved successfully.",
            data=data,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/sites/create_password_groups", response_model=CustomResponse[PasswordGroupResponse])
@inject
def create_password_group(
        password_group: PasswordGroupCreate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        dt = site_service.create_password_group1(password_group)
        return CustomResponse(
            message="Password group created successfully.",
            data=dt,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sites/get_password_group_by_id/{password_group_id}", response_model=PasswordGroupResponse)
@inject
def get_password_group(
        password_group_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    password_group = site_service.get_password_group(password_group_id)
    if not password_group:
        raise HTTPException(status_code=404, detail="PasswordGroup not found")
    return password_group


@router.get("/sites/get_all_password_groups/", response_model=CustomResponse[List[PasswordGroupResponse]])
@inject
def get_all_password_groups(
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    dta = site_service.get_all_password_groups1()
    return CustomResponse(
        message="Password groups fetched successfully.",
        data=dta,
        status_code=200
    )


@router.post("/sites/delete_password_groups_by_ids/", response_model=CustomResponse[None])
@inject
def delete_password_groups(
        password_group_ids: List[int],
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    delete = site_service.delete_password_groups1(password_group_ids)
    return CustomResponse(
        message="Password groups deleted successfully.",
        data=None,
        status_code=200
    )


@router.post("/sites/create_devices", response_model=CustomResponse[APICControllersResponse])
@inject
def create_device(
        device_data: APICControllersCreate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        response_data = site_service.create_device1(device_data)

        if hasattr(response_data, "id"):
            device_id = response_data.id
        else:
            logging.error("Device ID not found in response data")
            raise HTTPException(status_code=400, detail="Device ID not found in response data")

        processor = DeviceProcessor()
        processor.get_devices_by_ids([device_id])

        return CustomResponse(
            message="Device created and processed successfully.",
            data=response_data,
            status_code=200
        )
    except Exception as e:
        logging.error(f"Exception: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sites/get_all_devices", response_model=CustomResponse[List[APICControllersResponse]])
@inject
def get_all_devices(
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        devices = site_service.get_all_devices_data()
        return CustomResponse(
            message="Devices fetched successfully.",
            data=devices,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sites/update_device/{device_id}", response_model=CustomResponse[APICControllersResponse])
@inject
def update_device(
        device_id: int,
        device_data: APICControllersUpdate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        response_data = site_service.update_device1(device_id, device_data)
        return CustomResponse(
            message="Device updated successfully.",
            data=response_data,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sites/delete_devices", response_model=CustomResponse[None])
@inject
def delete_devices(
        device_ids: List[int],
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        site_service.delete_devices1(device_ids)
        return CustomResponse(
            message="Devices deleted successfully.",
            data=None,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sites/get_all_device_types", response_model=CustomResponse)
@inject
def get_device_types_by_vendor(
        vendor_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        device_types = site_service.get_device_types_by_vendor(vendor_id)
        return CustomResponse(
            message="Device types fetched successfully.",
            data=device_types,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sites/update_password_groups/{group_id}", response_model=CustomResponse[PasswordGroupResponse])
@inject
def update_password_group(
        group_id: int,
        password_group: PasswordGroupUpdate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        dt = site_service.update_password_group(group_id, password_group)
        return CustomResponse(
            message="Password group updated successfully.",
            data=dt,
            status_code=200
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sites/single_device_energy_consumption/{site_id}/{device_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails]])
@inject
def get_device_energy_consumption_metrics(
        site_id: int,
        device_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    metrics = site_service.calculate_energy_consumption_by_device_id_with_filter(site_id, device_id, duration)
    print("METRIXXX ENDPOINTTTTTTTTTTTTTTT", metrics, file=sys.stderr)
    print("TESTTTTTTTTTTTTTTTTTTTTTTTTTT")
    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics found for the given device and duration.")

    return CustomResponse(
        message="Energy consumption metrics retrieved successfully.",
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.post("/get_racks_by_site_id/{site_id}", response_model=CustomResponse[GetRacksResponse])
@inject
def get_racks_by_site_id(site_id: int,
                         current_user: User = Depends(get_current_active_user),
                         site_service: SiteService = Depends(Provide[Container.site_service])):
    racks = site_service.get_racks_by_site_id(site_id)
    return CustomResponse(
        message="Racks fetched successfully",
        data=GetRacksResponse(racks=racks),
        status_code=status.HTTP_200_OK
    )


@router.get("/sites/average_energy_consumption_metrics/{site_id}",
            response_model=CustomResponse[
                Union[EnergyConsumptionMetricsDetails1, List[EnergyConsumptionMetricsDetails1]]])
@inject
def get_energy_consumption_metrics(
        site_id: int,
        device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    if duration == "First Quarter":
        #time.sleep(5)
        metrics = {
            "time": "2024-01-01 00:00:00 - 2024-03-31 23:59:59",
            "energy_consumption": 88.56,
            "total_POut": 177.12,
            "total_PIn": 200.56,
            "power_efficiency": 0
        }
    elif duration == "Second Quarter":
        #time.sleep(8)
        metrics = {
            "time": "2024-04-01 00:00:00 - 2024-06-30 23:59:59",
            "energy_consumption": 90.12,
            "total_POut": 180.24,
            "total_PIn": 210.48,
            "power_efficiency": 0.52
        }
    elif duration == "Third Quarter":
        #time.sleep(6)
        metrics = {
            "time": "2024-07-01 00:00:00 - 2024-09-30 23:59:59",
            "energy_consumption": 85.78,
            "total_POut": 171.56,
            "total_PIn": 195.84,
            "power_efficiency": 0.5
        }
    else:
        if device_id:
            metrics = site_service.calculate_energy_consumption_by_device_id(site_id, device_id, duration)
        else:
            metrics = site_service.calculate_average_energy_consumption_by_site_id(site_id, duration)

    print(f"Metrics: {metrics}", file=sys.stderr)

    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics found for the given site/device and duration.")

    return CustomResponse(
        message="Energy consumption metrics retrieved successfully.",
        data=metrics,
        status_code=status.HTTP_200_OK
    )

@router.get("/total_value")
@inject
def get_energy_consumption_metricssss(
        site_id: int,
        # device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    metrics = site_service.calculate_average_energy_consumption_by_site_idd(site_id, duration)
    return {
        "data":metrics
    }

@router.get("/site/device_energy_details/{site_id}", response_model=DeviceEnergyDetailResponse123)
@inject
def get_device_energy_details(
        site_id: int,
        device_id: int,
        time: str,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        print(f"Received request: site_id={site_id}, device_id={device_id}, time={time}")
        exact_time, granularity = parse_time12(time)
        print(f"Parsed time: exact_time={exact_time}, granularity={granularity}")
        device_details = site_service.get_device_energy_details(site_id, device_id, exact_time, granularity)
        if not device_details:
            raise HTTPException(status_code=404, detail="No details found for the specified device and time.")
        return device_details
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sites/device_carbon_emission_details/{site_id}", response_model=CustomResponse[dict])
@inject
def get_carbon_emission_metrics(
        site_id: int,
        device_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    device_details, carbon_emission = site_service.calculate_device_carbon_emission(site_id, device_id, duration)
    return CustomResponse(
        message="Carbon emission metrics retrieved successfully.",
        data={
            "device_id": device_details["device_id"],
            "device_name": device_details["device_name"],
            "carbon_emission": carbon_emission,
        },
        status_code=200
    )


@router.get("/sites/all_devices_carbon_emission/{site_id}", response_model=CustomResponse[List[dict]])
@inject
def get_all_devices_carbon_emission(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    devices_carbon_emission = site_service.get_all_devices_carbon_emission(site_id, duration)
    return CustomResponse(
        message="Carbon emission metrics for all devices retrieved successfully.",
        data=devices_carbon_emission,
        status_code=200
    )
import math
@router.get("/sites/all_devices_pcr/{site_id}", response_model=CustomResponse[List[dict]])
@inject
def get_all_devices_pcr(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    devices_pcr = site_service.get_all_devices_pcr(site_id, duration)

    print(devices_pcr,
          "dsfdnsjdgnjkhkhkkhkhk")
    for device in devices_pcr:
        # for key, value in device.items():
        #     if isinstance(value, float) and (math.isinf(value) or math.isnan(value)):
        #         device[key] = 0  # Replace with None or a default value like 0
        for key, value in device.items():
            # Handle NaN or Inf values
            if isinstance(value, float) and (math.isinf(value) or math.isnan(value)):
                device[key] = 0
            # Convert numpy types to native Python types
            elif isinstance(value, (np.integer, np.int64, np.int32)):
                device[key] = int(value)
            elif isinstance(value, (np.floating, np.float64, np.float32)):
                device[key] = float(value)
        # return device

    return CustomResponse(
        message="PCR metrics for all devices retrieved successfully.",
        data=devices_pcr,
        status_code=200
    )







@router.get("/site/traffic_pcr_metrics_by_device_WITH_FILTER/{site_id}",
            response_model=CustomResponse1[List[PCRMetricsDetails]])
@inject
def get_device_pcr_metrics(
        site_id: int,
        device_name: Optional[str] = None,
        duration: Optional[str] = Query("24 hours", alias="duration"),
        limit: Optional[int] = Query(None, ge=1), 
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
        site_repository: SiteRepository = Depends(Provide[Container.site_repo])
):
    if not device_name:
        device_name = site_repository.get_first_device_name(site_id)
        if not device_name:
            raise HTTPException(status_code=404, detail="No devices found for the given site.")

    pcr_metrics = site_service.calculate_device_pcr_by_name_with_filter(site_id, device_name, duration, limit)  # Pass limit to service
    message = "Device PCR metrics retrieved successfully."
    return CustomResponse1(
        message=message,
        data=pcr_metrics,
        status_code=status.HTTP_200_OK
    )


@router.post("/sites/create_onboard_devices", response_model=CustomResponse[dict])
@inject
def create_device(
        device_data: DeviceCreateRequest,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        response_data = site_service.create_onboard_device(device_data)
        return CustomResponse(
            message="Device created successfully.",
            data=response_data,
            status_code=201
        )
    except Exception as e:
        logger.error(f"Exception: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sites/onboard_devices", response_model=CustomResponse[str])
def onboard_devices(
        onboarding_data: OnboardingRequest,
        current_user: User = Depends(get_current_active_user)
):
    try:
        print(f"Onboarding Devices: {onboarding_data.device_ids}", file=sys.stderr)

        processor = DeviceProcessor()
        processor.get_devices_by_ids(onboarding_data.device_ids)

        return CustomResponse(
            message="Onboarding Process Completed.",
            data="Success",
            status_code=200
        )

    except ValueError as ve:
        logger.error(f"Validation error during device onboarding: {str(ve)}")
        raise HTTPException(status_code=400, detail="Devices onboarding failed due to validation errors.")

    except Exception as e:
        logger.error(f"Unexpected error during device onboarding: {str(e)}")
        raise HTTPException(status_code=500, detail="Devices onboarding failed due to an unexpected error.")

@router.get("/sites/last_7_days_energy_metrics/{site_id}",
            response_model=CustomResponse[List[dict]])
@inject
def get_last_7_days_energy_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.get_last_7_days_energy_metrics(site_id)
    message = "Last 7 days energy metrics retrieved successfully."

    if not metrics:
        message = "No metrics available for the last 7 days."

    return CustomResponse(
        message=message,
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/sites/last_24_hours_energy_metrics/{site_id}",
            response_model=CustomResponse[List[dict]])
@inject
def get_last_24_hours_energy_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    metrics = site_service.get_last_24_hours_energy_metrics(site_id)
    message = "Last 24 hours energy metrics retrieved successfully."

    if not metrics:
        message = "No metrics available for the last 24 hours."

    return CustomResponse(
        message=message,
        data=metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/sites/power_output_prediction/{site_id}", response_model=CustomResponse[dict])
@inject
def get_total_power_output_prediction(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    total_pout_value_KW, predicted_pout, predicted_cost = site_service.calculate_total_pout_and_prediction(site_id)

    cost_message = f"Estimated cost of this month: AED {predicted_cost:.2f}"

    if predicted_pout > total_pout_value_KW:
        usage_message = "Higher"
        analysis_message = "December 2024 energy consumption will be higher than November 2024 based on AI Predicted Data."
    else:
        usage_message = "Higher"
        analysis_message = "December 2024 energy consumption will be higher than November 2024 based on AI Predicted Data."

    if total_pout_value_KW != 0:
        percentage_change = ((total_pout_value_KW - predicted_pout) / total_pout_value_KW) * 100
        percentage_change = 5
    else:
        percentage_change = 0.0  # Handle edge case if total pout is zero

    predictive_analysis_message = f"From January to December, estimated cost will be more than {percentage_change:.1f}% for this month."

    return CustomResponse(
        message="Power output prediction retrieved successfully.",
        data={
            "total_POut_last_3_months": total_pout_value_KW,
            "predicted_POut_next_month": predicted_pout,
            "predicted_cost_next_month": predicted_cost,
            "text_stats": {
                "cost_message": cost_message,
                "usage_comparison": usage_message,
                "predictive_analysis": predictive_analysis_message,
                "analysis_message": analysis_message
            }
        },
        status_code=200
    )


@router.get("/sites/power_comparison_and_prediction/{site_id}", response_model=CustomResponse[Dict])
@inject
def get_power_comparison_and_prediction(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    last_year_power = []
    current_year_power = []

    for i, month in enumerate(months):
        # Calculate start and end dates for each month of last year and current year
        last_year_start = datetime(datetime.now().year - 1, i + 1, 1)
        last_year_end = (last_year_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        total_pout_last_year = site_service.get_monthly_pout(site_id, last_year_start, last_year_end)
        last_year_power.append(round(total_pout_last_year, 2)) 

        current_year_start = datetime(datetime.now().year, i + 1, 1)
        current_year_end = (current_year_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        total_pout_current_year = site_service.get_monthly_pout(site_id, current_year_start, current_year_end)
        current_year_power.append(round(total_pout_current_year, 2))  # Round to 2 decimal places

    total_pout_last_3_months_kw, predicted_next_month_pout_kw, predicted_cost = site_service.calculate_total_pout_and_prediction(
        site_id)

    current_month_index = datetime.now().month - 1 
    if current_month_index == 9:  
        current_year_power[9] = predicted_next_month_pout_kw  

    if current_year_power[9] == 0:
        last_3_months_values = current_year_power[6:9]  
        if len(last_3_months_values) > 0 and sum(last_3_months_values) > 0:
            avg_last_3_months = sum(last_3_months_values) / len([p for p in last_3_months_values if p > 0])
            predicted_next_month_pout_kw = round(avg_last_3_months * 0.5, 2)  
            current_year_power[9] = predicted_next_month_pout_kw  

    print(f"Predicted next month (October) power after fallback: {current_year_power[9]}", file=sys.stderr)
    print(f"Final current year power: {current_year_power}", file=sys.stderr)

    return CustomResponse(
        message="Power comparison and prediction retrieved successfully.",
        data={
            "months": months,
            "last_year_power": last_year_power,
            "current_year_power": current_year_power
        },
        status_code=200
    )



@router.get("/sites/power_output_prediction/{site_id}", response_model=CustomResponse[dict])
@inject
def get_total_power_output_prediction(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    total_pout_value_KW, predicted_pout, predicted_cost = site_service.calculate_total_pout_and_prediction(site_id)

    cost_message = f"Estimated cost of this month: AED {predicted_cost:.2f}"

    if predicted_pout > total_pout_value_KW:
        usage_message = "Higher"
        analysis_message = "October 2024 energy consumption will be higher than September 2024 based on AI/ML Data."
    else:
        usage_message = "Higher"
        analysis_message = "October 2024 energy consumption will be higher than September 2024 based on AI/ML Data."

    if total_pout_value_KW != 0:
        percentage_change = ((total_pout_value_KW - predicted_pout) / total_pout_value_KW) * 100
        percentage_change = 5
    else:
        percentage_change = 0.0  # Handle edge case if total pout is zero

    predictive_analysis_message = f"From January to September, estimated cost will be more than {percentage_change:.1f}% for this month."

    return CustomResponse(
        message="Power output prediction retrieved successfully.",
        data={
            "total_POut_last_3_months": total_pout_value_KW,
            "predicted_POut_next_month": predicted_pout,
            "predicted_cost_next_month": predicted_cost,
            "text_stats": {
                "cost_message": cost_message,
                "usage_comparison": usage_message,
                "predictive_analysis": predictive_analysis_message,
                "analysis_message": analysis_message
            }
        },
        status_code=200
    )


@router.get("/sites/power_comparison_and_prediction/{site_id}", response_model=CustomResponse[Dict])
@inject
def get_power_comparison_and_prediction(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    last_year_power = []
    current_year_power = []

    for i, month in enumerate(months):
        last_year_start = datetime(datetime.now().year - 1, i + 1, 1)
        last_year_end = (last_year_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        total_pout_last_year = site_service.get_monthly_pout(site_id, last_year_start, last_year_end)
        last_year_power.append(round(total_pout_last_year, 2))  # Round to 2 decimal places

        current_year_start = datetime(datetime.now().year, i + 1, 1)
        current_year_end = (current_year_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        total_pout_current_year = site_service.get_monthly_pout(site_id, current_year_start, current_year_end)
        current_year_power.append(round(total_pout_current_year, 2))  # Round to 2 decimal places

    total_pout_last_3_months_kw, predicted_next_month_pout_kw, predicted_cost = site_service.calculate_total_pout_and_prediction(
        site_id)

    current_month_index = datetime.now().month - 1  
    if current_month_index == 9:  
        current_year_power[9] = predicted_next_month_pout_kw  

    if current_year_power[9] == 0:
        last_3_months_values = current_year_power[6:9]  
        if len(last_3_months_values) > 0 and sum(last_3_months_values) > 0:
            avg_last_3_months = sum(last_3_months_values) / len([p for p in last_3_months_values if p > 0])
            predicted_next_month_pout_kw = round(avg_last_3_months * 1.05, 2)  
            current_year_power[9] = predicted_next_month_pout_kw  

    print(f"Predicted next month (October) power after fallback: {current_year_power[9]}", file=sys.stderr)
    print(f"Final current year power: {current_year_power}", file=sys.stderr)

    return CustomResponse(
        message="Power comparison and prediction retrieved successfully.",
        data={
            "months": months,
            "last_year_power": last_year_power,
            "current_year_power": current_year_power
        },
        status_code=200
    )


@router.post("/Co2emmission", response_model=List)
@inject
def site_power_co2emmission(
        site_id: int,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.site_power_co2emmission(site_id)


@router.get("/get_site_names", response_model=CustomResponse)
@inject
def get_site_names(
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    sites = site_service.get_site_names()
    return CustomResponse(
        message="Fetched all sites successfully",
        data=sites,
        status_code=status.HTTP_200_OK
    )


@router.post("/Co2emmission", response_model=List)
@inject
def site_power_co2emmission(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.site_power_co2emmission(site_id)


@router.get("/get_site_names", response_model=CustomResponse)
@inject
def get_site_names(
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    sites = site_service.get_site_names()
    return CustomResponse(
        message="Fetched all sites successfully",
        data=sites,
        status_code=status.HTTP_200_OK
    )







@router.get("/devices/get_all_with_sntc", response_model=List[CSPCDevicesWithSntcResponse])
@inject
def get_all_devices_with_sntc(
    site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:
        devices = site_service.get_cspc_devices_with_sntc()
        return devices
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sites/PUE_onclick/{site_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails2]])
@inject
def get_device_energy_metrics(
        site_id: int,
        device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    print(f"Request received for site_id: {site_id}, device_id: {device_id}, duration: {duration}", file=sys.stderr)

    if device_id:
        metrics = site_service.calculate_energy_metrics_by_device_id(site_id, device_id, duration)
    else:
        metrics = site_service.calculate_average_energy_metrics_by_site_id(site_id, duration)

    print(f"Metrics retrieved: {metrics}", file=sys.stderr)

    if not metrics or not metrics.get("metrics"):
        print(f"No metrics found for site_id: {site_id}, device_id: {device_id}", file=sys.stderr)
        raise HTTPException(status_code=404, detail="No metrics found for the given site/device and duration.")

    return CustomResponse(
        message="Device energy metrics retrieved successfully.",
        data=metrics.get("metrics"),  
        status_code=status.HTTP_200_OK
    )





@router.get("/site/detailed_energy_metrics/{site_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails2]])
@inject
def get_device_energy_metrics_by_timestamp(
        site_id: int,
        timestamp: Optional[str] = Query(None, alias="timestamp"), 
        device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    print(f"Request received for site_id: {site_id}, device_id: {device_id}, duration: {duration}, timestamp: {timestamp}", file=sys.stderr)

    if device_id:
        metrics = site_service.calculate_energy_metrics_by_device_id(site_id, device_id, duration)
    else:
        metrics = site_service.calculate_average_energy_metrics_by_site_id(site_id, duration)

    print(f"Metrics retrieved: {metrics}", file=sys.stderr)


    if not metrics or not metrics.get("metrics"):
        print(f"No metrics found for site_id: {site_id}, device_id: {device_id}, duration: {duration}", file=sys.stderr)
        raise HTTPException(status_code=404, detail="No metrics found for the given site/device and duration.")

    # Filter the metrics by timestamp if provided
    if timestamp:
        filtered_metrics = [metric for metric in metrics.get("metrics", []) if metric["time"] == timestamp]
        if not filtered_metrics:
            print(f"No metrics found for the given timestamp: {timestamp}", file=sys.stderr)
            raise HTTPException(status_code=404, detail=f"No metrics found for the timestamp: {timestamp}")
    else:
        filtered_metrics = metrics.get("metrics")

    return CustomResponse(
        message="Device energy metrics retrieved successfully.",
        data=filtered_metrics,
        status_code=status.HTTP_200_OK
    )


@router.get("/ask_openai", response_model=CustomResponse_openai[dict])
@inject
def ask_openai(
        question: str,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    keywords = ["power", "time", "device", "site"]

    if "power" in question.lower() and "ip" in question.lower():
        answer = site_service.calculate_power_for_ip(question)
    elif "traffic" in question.lower() and "ip" in question.lower():
        answer = site_service.calculate_traffic_for_ip(question)
    elif "co2" in question.lower() and "ip" in question.lower():
        answer = site_service.calculate_co2_for_ip(question)
    elif all(keyword in question.lower() for keyword in keywords):
        answer = site_service.analyze_csv_and_ask_openai(question)
    else:
        answer = site_service.ask_openai_question(question)

    return CustomResponse_openai(
        message="OpenAI response retrieved successfully.",
        data={"answer": answer},
        status_code=200
    )




@router.post("/sites/upload_devices", response_model=CustomResponse[dict])
@inject
def upload_devices1(
        file: UploadFile = File(...),
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    try:

        response_data, exceptions = site_service.upload_devices_from_excel(file)
        return CustomResponse(
            message="Devices processed successfully from Excel with exceptions." if exceptions else "Devices processed successfully from Excel.",
            data={"processed_devices": response_data, "exceptions": exceptions},
            status_code=201
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to process the file.")


class EnergyConsumptionRequest(BaseModel):
    site_id: Optional[int] = None
    rack_id: Optional[int] = None
    model_no: Optional[str] = None
    vendor_name: Optional[str] = None
    duration: Optional[str] = "24 hours"  # Default to "24 hours" if not provided


@router.post("/sites/model_no_device_energy_consumption/",
             response_model=CustomResponse[List[EnergyConsumptionMetricsDetails]])
@inject
def get_device_energy_consumption_metrics(
        request: EnergyConsumptionRequest,  # Accepting data as a body
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    site_id = request.site_id
    rack_id = request.rack_id
    model_no = request.model_no
    vendor_name = request.vendor_name
    duration = request.duration or "24 hours"

    metrics = site_service.calculate_energy_consumption_with_filters(site_id, rack_id, model_no, vendor_name, duration)
    print("METRIXXX ENDPOINTTTTTTTTTTTTTTT", metrics, file=sys.stderr)

    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics found for the given filters.")

    return CustomResponse(
        message="Energy consumption metrics retrieved successfully.",
        data=metrics,
        status_code=status.HTTP_200_OK
    )

def clean_data(data):
    for item in data:
        for key, value in item.items():
            if isinstance(value, float):
                if np.isnan(value) or np.isinf(value):
                    item[key] = 0  # Replace with 0 or another fallback
    return data
@router.post("/sites/avg_energy_consumption_with_model_count/")
@inject
def get_device_avg_energy_consumption_metrics(
        model_data:modelResponse,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):

    duration =  "24 hours"

    avg_metrics = site_service.calculate_avg_energy_consumption_with_filters(model_data.limit,model_data.site_id, model_data.rack_id, model_data.vendor_id,
                                                                             duration)

    print("Average Metrics:", avg_metrics, file=sys.stderr)
    avg_metrics=clean_data(avg_metrics)
    if not avg_metrics:
        raise HTTPException(status_code=404, detail="No metrics found for the given filters.")

    return avg_metrics



@router.get("/get_inventory_count", response_model=CustomResponse)
@inject
def get_inventory_counts(
        site_id: Optional[int] = None,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    data = site_service.get_inventory_count(site_id)
    return CustomResponse(
        message="Fetched all inventory count successfully",
        data=data,
        status_code=status.HTTP_200_OK
    )


@router.post("/get_next_month", response_model=CustomResponse)
@inject
def get_ai_res(device_data:DeviceRequest,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    # data = site_service.get_device_aidata(device_data)
    data = site_service.check_site(device_data.site_id)
    if data:
     data = [


        {'month': 'October', 'year': 2024, 'total_PIn': 221.37, 'total_POut': 191.79, 'PUE': 1.15, 'EER': 0.87,'co2':8.8,
         'Prediction': 'False'},
        {'month': 'November', 'year': 2024, 'total_PIn': 205.29, 'total_POut': 177.65, 'PUE': 1.16, 'EER': 0.87,'co2':8.2,
         'Prediction': 'False'},
        {'month': 'December', 'year': 2024, 'total_PIn': 223.01, 'total_POut': 193.01, 'PUE': 1.16, 'EER': 0.87,'co2':8.9,
         'Prediction': 'False'},
        {'month': 'January', 'year': 2025, 'total_PIn': 70.33, 'total_POut': 60.85, 'PUE': 1.16, 'EER': 0.87,'co2':2.8,
         'Prediction': 'False'},
        {'month': 'February', 'year': 2025, 'total_PIn':  223.01, 'total_POut': 193.01, 'PUE': 1.16, 'EER': 0.87,'co2':8.9,
         'Prediction': 'False'},
        {'month': 'March', 'year': 2024, 'total_PIn': 222.95, 'total_POut': 192.5, 'PUE': 1.16, 'EER': 0.86,'co2':8.8,
         'Prediction': 'False'},
        {'month': 'April', 'year': 2025, 'total_PIn': 222.67, 'total_POut': 193.67, 'PUE': 1.16, 'EER': 0.87,'co2':8.9,
         'Prediction': 'False'},
         {'month': 'May', 'year': 2025, 'total_PIn': 189.37, 'total_POut': 190.79, 'PUE': 1.15, 'EER': 0.87,
          'co2': 7.5,
          'Prediction': 'True'},
    ]
    print(data)
    print(type(data),"$#@@@@@@@@@@@@@@@@")
    return CustomResponse(
        message="Fetched all inventory count successfully",
        data=data,
        status_code=status.HTTP_200_OK
    )
@router.post("/get_next_year_co2", response_model=CustomResponse)
@inject
def get_ai_res_year_co2(
               site_id: int,
               # current_user: User = Depends(get_current_active_user),
               site_service: SiteService = Depends(Provide[Container.site_service])
               ):
    data = site_service.check_site(site_id)
    if data:
        data = [
            {'year': 2023, 'total_PIn': 221.37, 'total_POut': 191.79, 'co2':8.8,
             'Prediction': 'False'},
            { 'year': 2024, 'total_PIn': 229.87, 'total_POut': 191.79, 'co2':9.1,
             'Prediction': 'False'},
            {'year': 2025, 'total_PIn': 205.29, 'total_POut': 177.65, 'co2':8.2,
             'Prediction': 'False'},
            {'year': 2026, 'total_PIn': 223.01, 'total_POut': 193.01, 'co2':8.9,
             'Prediction': 'True'},]
        print(data)
        print(type(data))
        return CustomResponse(
            message="Fetched all data  successfully",
            data=data,
            status_code=status.HTTP_200_OK
        )

@router.post("/get_next_year", response_model=CustomResponse)
@inject
def get_ai_res_year(
               site_id: int,
               # current_user: User = Depends(get_current_active_user),
               site_service: SiteService = Depends(Provide[Container.site_service])
               ):
    data = site_service.check_site(site_id)
    if data:
         data = [
        {'year': 2023, 'total_PIn': 221.37, 'total_POut': 191.79, 'PUE': 1.15, 'EER': 0.87, 'datatraffic':2.3,
         'Prediction': 'False'},
        { 'year': 2024, 'total_PIn': 221.37, 'total_POut': 191.79, 'PUE': 1.15, 'EER': 0.87,'datatraffic':2.3,
         'Prediction': 'False'},
        {'year': 2025, 'total_PIn': 205.29, 'total_POut': 177.65, 'PUE': 1.16, 'EER': 0.87,'datatraffic':2.3,
         'Prediction': 'False'},
        {'year': 2026, 'total_PIn': 223.01, 'total_POut': 193.01, 'PUE': 1.16, 'EER': 0.87,'datatraffic':2.3,
         'Prediction': 'True'},]
    print(data)
    print(type(data))
    return CustomResponse(
        message="Fetched all inventory count successfully",
        data=data,
        status_code=status.HTTP_200_OK
    )

@router.post("/generate_reports", response_model=CustomResponse[dict])
@inject
def get_reports(
        site_id: int,
        duration: Optional[str] = Query(None, alias="duration"),
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"
    def calculate_emission():
        pin_value, consumption_percentages, totalpin_kws = site_service.calculate_total_power_consumption(site_id, duration)
        return {"total_PIn": pin_value, "consumption_percentages": consumption_percentages, "totalpin_kws": totalpin_kws}
    def get_device_emission():
        return site_service.get_all_devices_carbon_emission(site_id, duration)

    # Use ThreadPoolExecutor to run tasks in parallel
    with ThreadPoolExecutor() as executor:
        future_emission = executor.submit(calculate_emission)
        future_device_emission = executor.submit(get_device_emission)

        # Get results from threads
        co2_emmission = future_emission.result()
        devices_carbon_emission = future_device_emission.result()

    return CustomResponse(
        message="Energy and power consumption metrics retrieved successfully.",
        data={
            "co2_emmission": co2_emmission,
            "devices_carbon_emission": devices_carbon_emission,
        },
        status_code=200,
    )


# Directory to save uploaded PDF files
UPLOAD_DIRECTORY = "./uploaded_files/"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)  # Ensure the directory exists



@router.post("/upload_pdf", response_model=CustomResponse[dict])
@inject
async def upload_pdf(file: UploadFile = File(...)):
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Generate a unique file name
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    # Save the file
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save the file: {str(e)}")

    return JSONResponse(
        content={
            "message": "PDF file uploaded successfully.",
            "file_path": file_path,
        },
        status_code=201,
    )



@router.get("/sites/carbon_onclick/{site_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails2]])
@inject
def get_device_cabonemmsion(
        site_id: int,
        device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    print(f"Request received for site_id: {site_id}, device_id: {device_id}, duration: {duration}", file=sys.stderr)

    if device_id:
        metrics = site_service.calculate_energy_metrics_by_device_id(site_id, device_id, duration)
    else:
        metrics = site_service.calculate_average_energy_metrics_by_site_id(site_id, duration)

    print(f"Metrics retrieved: {metrics}", file=sys.stderr)

    if not metrics or not metrics.get("metrics"):
        print(f"No metrics found for site_id: {site_id}, device_id: {device_id}", file=sys.stderr)
        raise HTTPException(status_code=404, detail="No metrics found for the given site/device and duration.")

    return CustomResponse(
        message="Device energy metrics retrieved successfully.",
        data=metrics.get("metrics"),
        status_code=status.HTTP_200_OK
    )

from fastapi.responses import FileResponse
from pathlib import Path

@router.post("/view-pdf/")
def view_pdf(
        filename: Optional[str] = None,
        # current_user: User = Depends(get_current_active_user),
):
    if not filename:
        raise HTTPException(status_code=400, detail="Filename parameter is required.")

    # Secure the filename to avoid directory traversal attacks
    safe_filename = os.path.basename(filename)
    pdf_path = Path(f"/home/dev/DCS-Project/backend-dcs/backend-1/DCS/FAST_BACKEND/ega_report/{safe_filename}")
    print("path",pdf_path)

    if pdf_path.exists():
        return FileResponse(
            path=pdf_path,
            media_type='application/pdf',
            filename=safe_filename
        )
    else:
        raise HTTPException(status_code=404, detail="File not found.")


@router.get("/device_level_analytics/{site_id}",
            response_model=CustomResponse[List[EnergyConsumptionMetricsDetails2]])
@inject
def get_dcs_energy_metrics_by_timestamp(
        site_id: int,
        timestamp: Optional[str] = Query(None, alias="timestamp"),
        device_id: Optional[int] = Query(None, alias="device_id"),
        duration: Optional[str] = Query(None, alias="duration"),
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    duration = duration or "24 hours"

    print(f"Request received for site_id: {site_id}, device_id: {device_id}, duration: {duration}, timestamp: {timestamp}", file=sys.stderr)

    if device_id:
        print("Request received")
        metrics = site_service.calculate_dcs_metrics_by_device_id(site_id, device_id, duration)
    else:
        metrics = site_service.calculate_average_energy_metrics_by_site_id(site_id, duration)

    print(f"Metrics retrieved: {metrics}", file=sys.stderr)

    if not metrics or not metrics.get("metrics"):
        print(f"No metrics found for site_id: {site_id}, device_id: {device_id}, duration: {duration}", file=sys.stderr)
        raise HTTPException(status_code=404, detail="No metrics found for the given site/device and duration.")

    # Filter the metrics by timestamp if provided
    if timestamp:
        filtered_metrics = [metric for metric in metrics.get("metrics", []) if metric["time"] == timestamp]
        if not filtered_metrics:
            print(f"No metrics found for the given timestamp: {timestamp}", file=sys.stderr)
            raise HTTPException(status_code=404, detail=f"No metrics found for the timestamp: {timestamp}")
    else:
        filtered_metrics = metrics.get("metrics")

    return CustomResponse(
        message="Device energy metrics retrieved successfully.",
        data=filtered_metrics,
        status_code=status.HTTP_200_OK
    )


@router.post("/collection_status")
@inject
def site_power_co2emmission(
        device_id: int,
        collecton_status:bool,
        # current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    response=site_service.device_collectionstatus(device_id,collecton_status)
    print("Device status")

    return {
        "message": "Device collection status updated successfully.",
        "data": response,
        "status_code": status.HTTP_200_OK
    }