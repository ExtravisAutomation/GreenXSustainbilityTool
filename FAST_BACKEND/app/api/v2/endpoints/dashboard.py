import sys
import time

from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.dashboard_schema import CustomResponse
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from logging import getLogger

from requests import Session
from starlette.responses import JSONResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard Module"])


@router.get("/getsitedetails", response_model=CustomResponse)
@inject
def get_site_detailsss(
    dashboard_service: DashboardService = Depends(Provide[Container.dashboard_services])):

    data=dashboard_service.get_dashboard_info(2)
    print(data,"datata")
    return CustomResponse(
        message="*Data Retrieved Successfully*",
        data=data,
        status_code=status.HTTP_200_OK
    )



