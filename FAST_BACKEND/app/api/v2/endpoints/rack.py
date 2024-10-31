from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schema.rack_schema import RackCreate, RackUpdate, RackDetails, CustomResponse_rack, GetRacksResponse
from pydantic import BaseModel
from app.services.rack_service import RackService
from app.core.container import Container
from dependency_injector.wiring import inject, Provide
from app.model.user import User
from app.core.dependencies import get_current_active_user

from app.schema.rack_schema import RackUpdateResponse

from app.schema.building_schema import BuildingCreate, MultiDeleteResponse, CustomResponse_building

from app.schema.building_schema import BuildingUpdate

router = APIRouter(prefix="/racks", tags=["RACKS"])

@router.get("/getallracks", response_model=CustomResponse_rack[List[RackDetails]])
@inject
def get_racks(
    # current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    racks = rack_service.get_racks()
    return CustomResponse_rack(
        message="Fetched all racks successfully",
        data=racks,
        status_code=status.HTTP_200_OK
    )


@router.post("/addrack", response_model=CustomResponse_rack[RackDetails])
@inject
def add_rack(
    rack_data: RackCreate,
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    rack = rack_service.create_rack(rack_data)
    return CustomResponse_rack(
        message="Rack created successfully",
        data=rack,
        status_code=status.HTTP_200_OK
    )


@router.post("/updaterack/{rack_id}", response_model=RackUpdateResponse)
@inject
def update_rack(
    rack_id: int, 
    rack_data: RackUpdate, 
    # current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    updated_rack = rack_service.update_rack(rack_id, rack_data)
    return RackUpdateResponse(
        message="Rack updated successfully",
        data=updated_rack,
        status_code=status.HTTP_200_OK
    )

# Original code
# @router.post("/deleterack/{rack_id}", response_model=CustomResponse_rack[None])
# @inject
# def delete_rack(
#     rack_id: int, 
#     current_user: User = Depends(get_current_active_user),
#     rack_service: RackService = Depends(Provide[Container.rack_service])
# ):
#     rack_service.delete_rack(rack_id)
#     return CustomResponse_rack(
#         message="Rack deleted successfully",
#         data=None,
#         status_code=status.HTTP_200_OK
#     )


class DeleteRequest1(BaseModel):
    rack_ids: List[int]
    
    
@router.post("/deleterack", response_model=CustomResponse_rack[None])
@inject
def delete_rack(
    rack_ids: List[int], 
    # current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    rack_service.delete_rack(rack_ids)
    return CustomResponse_rack(
        message="Racks deleted successfully",
        data=None,
        status_code=status.HTTP_200_OK
    )


class DeleteRequest1(BaseModel):
    rack_ids: List[int]


# @router.post("/deleteracks", response_model=CustomResponse_rack[None])
# @inject
# def delete_racks(
#     delete_request: DeleteRequest1, 
#     current_user: User = Depends(get_current_active_user),
#     rack_service: RackService = Depends(Provide[Container.rack_service])
# ):
#     rack_ids_list = delete_request.rack_ids
#     rack_service.delete_racks(rack_ids_list)
#     return CustomResponse_rack(
#         message="Racks deleted successfully",
#         data=None,
#         status_code=status.HTTP_200_OK
#     )
    
    
@router.post("/rackLastPowerUtiization", response_model=dict)
@inject
def rack_power(
    rack_id: int,
    # current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    return rack_service.get_rack_last_power_utilization(rack_id)



@router.post("/rackPowerutilization", response_model=List)
@inject
def rack_power(
    rack_id: int,
    # current_user: User = Depends(get_current_active_user),
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    return rack_service.get_rack_power_utilization(rack_id)


@router.post("/addbuilding", response_model=CustomResponse_building)
def create_building(
    building_data: BuildingCreate,
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    building = rack_service.create_building(building_data)
    return CustomResponse_building(
        message="Building created successfully",
        data=building,
        status_code=status.HTTP_201_CREATED
    )

@router.get("/getbuilding/{building_id}", response_model=CustomResponse_building)
def get_building(
    building_id: int,
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    building = rack_service.get_building(building_id)
    return CustomResponse_building(
        message="Building fetched successfully" if building else "Building not found",
        data=building,
        status_code=status.HTTP_200_OK if building else status.HTTP_404_NOT_FOUND
    )

@router.get("/getallbuildings", response_model=CustomResponse_building)
@inject
def get_all_buildings(
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    buildings = rack_service.get_all_buildings()
    return CustomResponse_building(
        message="Fetched all buildings successfully",
        data=buildings,
        status_code=status.HTTP_200_OK
    )

@router.put("/updatebuilding/{building_id}", response_model=CustomResponse_building)
@inject
def update_building(
    building_id: int,
    update_data: BuildingUpdate,
    rack_service: RackService = Depends(Provide[Container.rack_service])
):
    building = rack_service.update_building(building_id, update_data)
    return CustomResponse_building(
        message="Building updated successfully" if building else "Building not found",
        data=building,
        status_code=status.HTTP_200_OK if building else status.HTTP_404_NOT_FOUND
    )

@router.delete("/deletebuilding/{building_id}", response_model=CustomResponse_building)
def delete_building(
    building_id: int,
    building_service: RackService = Depends(Provide[Container.rack_service])
):
    success = building_service.delete_building(building_id)
    return CustomResponse_building(
        message="Building deleted successfully" if success else "Building not found",
        data=None,
        status_code=status.HTTP_200_OK if success else status.HTTP_404_NOT_FOUND
    )

@router.delete("/deletemultiplebuildings", response_model=MultiDeleteResponse)
def delete_multiple_buildings(
    building_ids: List[int],
    building_service: RackService = Depends(Provide[Container.rack_service])
):
    deleted_ids = building_service.delete_multiple_buildings(building_ids)
    return MultiDeleteResponse(
        message="Buildings deleted successfully" if deleted_ids else "No buildings were deleted",
        deleted_ids=deleted_ids,
        status_code=status.HTTP_200_OK
    )


