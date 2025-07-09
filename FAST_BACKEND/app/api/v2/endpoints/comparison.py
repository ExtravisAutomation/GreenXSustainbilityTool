import sys
import time

from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.comparison_schema import CustomResponse,comparisonPayload
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from app.core.dependencies import get_db, get_current_active_user
from app.model.user import User
from logging import getLogger
from starlette.responses import JSONResponse
from app.services.comparison_service import ComparisonService
router = APIRouter(prefix="/comparison", tags=["Comparison Module"])
logger = getLogger(__name__)
@router.post("/compare_data", response_model=CustomResponse)
@inject
def compare_data(
        filter_data: comparisonPayload,
        # current_user: User = Depends(get_current_active_user),
        compare_service: ComparisonService = Depends(Provide[Container.comparison_service])
):
    data = compare_service.get_comparison_response(filter_data)
    return CustomResponse(
        message="data recieved successfully",
        data=data,
        status_code=status.HTTP_200_OK
    )
