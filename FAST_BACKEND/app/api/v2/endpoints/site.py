from fastapi import APIRouter, Depends, HTTPException, status
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

router = APIRouter(prefix="/sites", tags=["sites"])


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
