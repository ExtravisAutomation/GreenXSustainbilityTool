from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from app.core.container import Container
from app.services.apic_service import APICService
from dependency_injector.wiring import Provide, inject
from app.core.dependencies import get_current_active_user
from app.model.user import User
from app.schema.site_schema import CustomResponse  # Assuming you have this schema
# from .models import APICDataRequest  # Ensure you import your APICDataRequest correctly
from pydantic import BaseModel, Field

from app.schema.fabric_node import FabricNodeResponse

from app.schema.site_schema import CustomResponse1

from app.schema.fabric_node import FabricNodeDetails

# from app.schema.fabric_node import PowerUtilizationResponse

from app.schema.fabric_node import PowerUtilizationResponse_per_day, PowerUtilizationResponse_5min

from app.schema.fabric_node import HourlyPowerUtilizationResponse

router = APIRouter(prefix="/apic", tags=["APIC"])


class APICDataRequest(BaseModel):
    apic_ips: List[str] = Field(..., example=["10.14.106.4", "10.14.106.6", "10.14.106.8"])
    username: str = Field(..., example="ciscotac")
    password: str = Field(..., example="C15c0@mob1ly")


class PowerDataRequest(BaseModel):
    apic_controller_ip: str
    node: str


@router.post("/collect_apic_data", response_model=CustomResponse)
@inject
def collect_apic_data(
        request: APICDataRequest,
        current_user: User = Depends(get_current_active_user),
        apic_service: APICService = Depends(Provide[Container.apic_service])):
    try:
        apic_service.collect_and_store_data(request.apic_ips, request.username, request.password)
        return CustomResponse(message="Data collection and storage initiated successfully.",
                              status_code=status.HTTP_200_OK)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get("/getallfabricnodes", response_model=CustomResponse1[List[FabricNodeDetails]])
@inject
def get_fabric_nodes(current_user: User = Depends(get_current_active_user),
                     apic_service: APICService = Depends(Provide[Container.apic_service])):
    fabric_nodes = apic_service.get_fabric_nodes()
    return CustomResponse1(
        message="Fetched all fabric nodes successfully",
        data=fabric_nodes,
        status_code=status.HTTP_200_OK
    )


@router.get("/fabric-nodes/with-power", response_model=List[FabricNodeDetails])
@inject
def get_fabric_nodes_with_power_utilization(service: APICService = Depends(Provide[Container.apic_service])):
    try:
        return service.get_fabric_nodes_with_power_utilization()
    except HTTPException as http_exc:  #
        raise http_exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")


@router.post("/power-utilization-5min", response_model=PowerUtilizationResponse_5min)
@inject
def get_power_utilization_5min(request: PowerDataRequest,
                               current_user: User = Depends(get_current_active_user),
                               service: APICService = Depends(Provide[Container.apic_service])):
    power_utilization = service.get_power_utilization_5min(request.apic_controller_ip, request.node)
    return {"apic_controller_ip": request.apic_controller_ip, "node": request.node,
            "power_utilization_5min": round(power_utilization, 1)}


@router.post("/power-utilization-per-day", response_model=PowerUtilizationResponse_per_day)
@inject
def get_power_utilization_perday(request: PowerDataRequest,
                                 current_user: User = Depends(get_current_active_user),
                                 service: APICService = Depends(Provide[Container.apic_service])):
    power_utilization = service.get_power_utilization_perday(request.apic_controller_ip, request.node)
    return {"apic_controller_ip": request.apic_controller_ip, "node": request.node,
            "power_utilization_per_day": round(power_utilization, 1)}


@router.post("/power-utilization-per-hour", response_model=List[HourlyPowerUtilizationResponse])
@inject
def get_hourly_power_utilization_endpoint(
        request: PowerDataRequest,
        current_user: User = Depends(get_current_active_user),
        service: APICService = Depends(Provide[Container.apic_service])
):
    try:
        return service.get_hourly_power_utilization(request.apic_controller_ip, request.node)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
