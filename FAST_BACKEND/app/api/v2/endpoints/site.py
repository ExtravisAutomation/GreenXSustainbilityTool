from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.site_repository import SiteRepository
from app.schema.site_schema import SiteCreate, SiteUpdate, Site, FindSiteResult, GetSitesResponse
from app.services.site_service import SiteService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject

router = APIRouter(prefix="/sites", tags=["sites"])


@router.get("/", response_model=GetSitesResponse)
@inject
def get_sites(
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.get_sites()


@router.post("/addsite", response_model=dict)
@inject
def add_site(
        site_data: SiteCreate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service])
):
    return site_service.create_site(site_data)


@router.put("/{site_id}", response_model=dict)
@inject
def update_site(
        site_id: int,
        site_data: SiteUpdate,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
):
    return site_service.update_site(site_id, site_data)


@router.delete("/sites/{site_id}", response_model=dict)
@inject
def delete_site(
        site_id: int,
        current_user: User = Depends(get_current_active_user),
        site_service: SiteService = Depends(Provide[Container.site_service]),
):
    return site_service.delete_site(site_id)
