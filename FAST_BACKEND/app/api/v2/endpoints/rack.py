from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schema.rack_schema import RackCreate, RackUpdate, RackDetails, CustomResponse_rack, GetRacksResponse
# print(RackCreate)

from app.services.rack_service import RackService
from app.core.container import Container
from dependency_injector.wiring import inject, Provide
from app.model.user import User
from app.core.dependencies import get_current_active_user

from app.schema.rack_schema import RackUpdateResponse

router = APIRouter(prefix="/racks", tags=["RACKS"])


@router.get("/getallracks", response_model=CustomResponse_rack[List[RackDetails]])
@inject
def get_racks(current_user: User = Depends(get_current_active_user),
              rack_service: RackService = Depends(Provide[Container.rack_service])):
    racks = rack_service.get_racks()
    return CustomResponse_rack(
        message="Fetched all racks successfully",
        data=racks,
        status_code=status.HTTP_200_OK
    )


@router.post("/addrack", response_model=CustomResponse_rack[RackDetails])
@inject
def add_rack(rack_data: RackCreate, current_user: User = Depends(get_current_active_user),
             rack_service: RackService = Depends(Provide[Container.rack_service])):
    rack = rack_service.create_rack(rack_data)
    return CustomResponse_rack(
        message="Rack created successfully",
        data=rack,
        status_code=status.HTTP_200_OK
    )


@router.post("/updaterack/{rack_id}", response_model=RackUpdateResponse)
@inject
def update_rack(rack_id: int, rack_data: RackUpdate, current_user: User = Depends(get_current_active_user),
                rack_service: RackService = Depends(Provide[Container.rack_service])):
    updated_rack = rack_service.update_rack(rack_id, rack_data)
    return RackUpdateResponse(
        message="Rack updated successfully",
        data=updated_rack,
        status_code=status.HTTP_200_OK
    )


@router.post("/deleterack/{rack_id}", response_model=CustomResponse_rack[None])
@inject
def delete_rack(rack_id: int, current_user: User = Depends(get_current_active_user),
                rack_service: RackService = Depends(Provide[Container.rack_service])):
    rack_service.delete_rack(rack_id)
    return CustomResponse_rack(
        message="Rack deleted successfully",
        data=None,
        status_code=status.HTTP_200_OK
    )


@router.delete("/deleteracks", response_model=CustomResponse_rack[None])
@inject
def delete_racks(rack_ids: List[int], current_user: User = Depends(get_current_active_user),
                 rack_service: RackService = Depends(Provide[Container.rack_service])):
    rack_service.delete_racks(rack_ids)
    return CustomResponse_rack(
        message="Racks deleted successfully",
        data=None,
        status_code=status.HTTP_200_OK
    )
