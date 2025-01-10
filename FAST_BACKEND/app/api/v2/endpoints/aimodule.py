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
from app.services.ai_service import AIService
router = APIRouter(prefix="/ai", tags=["AI module"])
logger = getLogger(__name__)


@router.get("/getai", response_model=CustomResponse)
@inject
def get_all_reports(
        question: str,
        # current_user: User = Depends(get_current_active_user),
        ai_module_service: AIService = Depends(Provide[Container.ai_service])


):
    print("Gettingsads")

    data = ai_module_service.get_chatbot_response(question)
    return CustomResponse(
        message=" response of chatbot",
        data=data,
        status_code=status.HTTP_200_OK
    )
