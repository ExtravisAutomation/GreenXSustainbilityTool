from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.site_repository import SiteRepository
from app.schema.site_schema import SiteCreate, SiteUpdate, Site, FindSiteResult, GetSitesResponse, SiteDetails, CustomResponse
from app.services.site_service import SiteService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject

router = APIRouter(prefix="/sites", tags=["sites"])


@router.get("/getallsites", response_model=CustomResponse[GetSitesResponse])
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


@router.post("/updatesite", response_model=CustomResponse[SiteDetails])
@inject
def update_site(site_id: int, site_data: SiteUpdate, current_user: User = Depends(get_current_active_user),
                site_service: SiteService = Depends(Provide[Container.site_service])):
    site = site_service.update_site(site_id, site_data)
    return CustomResponse(
        message="Site updated successfully",
        data=site,
        status_code=status.HTTP_200_OK
    )


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
