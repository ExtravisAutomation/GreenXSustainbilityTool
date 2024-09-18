import sys
import time
from typing import List, Optional, Dict, Any, Union
from app.api.v2.endpoints.test_script import main
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schema.site_schema import CustomResponse
from app.schema.report_schema import ReportCreate
from app.services.report_service import ReportService
from app.core.container import Container
from dependency_injector.wiring import Provide, inject
from logging import getLogger



router = APIRouter(prefix="/reports", tags=["REPORT"])
logger = getLogger(__name__)


@router.get("/getallreports", response_model=CustomResponse)
@inject
def get_all_reports(
        # current_user: User = Depends(get_current_active_user),
        report_service: ReportService = Depends(Provide[Container.report_service])
):
    report_data = report_service.get_all_reports()
    return CustomResponse(
        message="Fetched all reports successfully",
        data=report_data,
        status_code=status.HTTP_200_OK
    )
    

@router.post("/addReport", response_model=dict)
@inject
def add_report(
    report_data: ReportCreate,
    # current_user: User = Depends(get_current_active_user),
    report_service: ReportService = Depends(Provide[Container.report_service])
):
    return report_service.add_report(report_data)