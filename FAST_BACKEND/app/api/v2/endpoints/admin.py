import sys
import time
from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.admin_schema import CustomResponse,RoleCreate
from app.services.admin_service import AdminPanelService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from logging import getLogger
from app.services.ai_service import AIService
router = APIRouter(prefix="/admin", tags=["Admin Panel"])
logger = getLogger(__name__)



@router.post("/addrole", response_model=CustomResponse)
@inject
def add_role(
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

