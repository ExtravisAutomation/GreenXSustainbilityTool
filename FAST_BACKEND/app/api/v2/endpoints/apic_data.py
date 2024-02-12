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

router = APIRouter(prefix="/apic", tags=["APIC"])


class APICDataRequest(BaseModel):
    apic_ips: List[str] = Field(..., example=["10.14.106.4", "10.14.106.6", "10.14.106.8"])
    username: str = Field(..., example="ciscotac")
    password: str = Field(..., example="C15c0@mob1ly")


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
