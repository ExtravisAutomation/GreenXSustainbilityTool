import sys
import time
from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.admin_schema import CustomResponse,RoleCreate,RoleUpdate
from app.services.admin_service import AdminPanelService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from logging import getLogger
from starlette.responses import JSONResponse

from app.services.ai_service import AIService
router = APIRouter(prefix="/admin", tags=["Admin Panel"])
logger = getLogger(__name__)



@router.post("/addrole", response_model=CustomResponse)
@inject
def add_roles(
        role_data: RoleCreate,
        # current_user: User = Depends(get_current_active_user),
        admin_service: AdminPanelService = Depends(Provide[Container.admin_service])
):
    role = admin_service.add_role(role_data)
    return CustomResponse(
        message="Role created successfully",
        data=role,
        status_code=status.HTTP_200_OK
    )

@router.post("/updaterole/{id}", response_model=CustomResponse)
@inject
def update_roles(
        id: int,
        role_data: RoleUpdate,
        current_user: User = Depends(get_current_active_user),
        admin_service: AdminPanelService = Depends(Provide[Container.admin_service])
):
    try:
        role = admin_service.update_role(id, role_data)
        return CustomResponse(
            message="Role updated successfully",
            data=role,
            status_code=status.HTTP_200_OK
        )
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})

@router.post("/deleterole")
@inject
def delete_roles(
        request: List[int],
        current_user: User = Depends(get_current_active_user),
        admin_service: AdminPanelService = Depends(Provide[Container.admin_service])
):
    return admin_service.delete_role(request)

@router.get("/getroles", response_model=CustomResponse)
@inject
def get_roles(
        current_user: User = Depends(get_current_active_user),
        admin_service: AdminPanelService = Depends(Provide[Container.admin_service])
):
    role=admin_service.get_role()
    return CustomResponse(
        message="Site updated successfully",
        data=role,
        status_code=status.HTTP_200_OK
    )
@router.post("/adduser", response_model=CustomResponse)
@inject
def add_roles(
        role_data: RoleCreate,
        # current_user: User = Depends(get_current_active_user),
        admin_service: AdminPanelService = Depends(Provide[Container.admin_service])
):
    role = admin_service.add_role(role_data)
    return CustomResponse(
        message="Role created successfully",
        data=role,
        status_code=status.HTTP_200_OK
    )