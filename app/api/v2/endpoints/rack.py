from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from app.repository.rack_repository import RackRepository
from app.schema.rack_schema import RackCreate, RackUpdate, Rack, GetRackResponse
from app.services.rack_service import RackService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject

router = APIRouter(prefix="/racks", tags=["racks"])


@router.get("/", response_model=dict)
@inject
def get_racks(
    current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    return rack_service.get_racks()


@router.post("/addrack", response_model=dict)
@inject
def add_rack(
    rack_data: RackCreate,
    current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    return rack_service.create_rack(rack_data)


@router.put("/{rack_id}", response_model=dict)
@inject
def update_rack(
    rack_id: int,
    rack_data: RackUpdate,
    current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service]),
):
    return rack_service.update_rack(rack_id, rack_data)


@router.delete("/{rack_id}", response_model=dict)
@inject
def delete_rack(
    rack_id: int,
    current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service]),
):
    return rack_service.delete_rack(rack_id)
