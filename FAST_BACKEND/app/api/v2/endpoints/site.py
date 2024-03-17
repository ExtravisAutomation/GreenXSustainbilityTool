from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.site_repository import SiteRepository
from app.schema.site_schema import SiteCreate, SiteUpdate, Site, FindSiteResult, GetSitesResponse, SiteDetails, \
    CustomResponse, CustomResponse1
from app.services.site_service import SiteService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from starlette.responses import JSONResponse
from app.schema.site_schema import SiteDetails1
from app.schema.site_schema import SitePowerConsumptionResponse

from app.schema.site_schema import EnergyConsumptionMetricsDetails

from app.schema.site_schema import HourlyEnergyMetricsResponse

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


@router.get("/sites/KPI_on_click/{site_id}", response_model=HourlyEnergyMetricsResponse)
@inject
def get_hourly_energy_metrics(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.calculate_hourly_energy_metrics(site_id)
