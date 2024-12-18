import sys
from contextlib import AbstractContextManager
from datetime import datetime
from typing import Callable, Dict, List, Optional, Any, Tuple

from sqlalchemy import desc, func
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session, joinedload, aliased
from fastapi import HTTPException, status
from app.model.report import Reports
from app.schema.report_schema import ReportCreate
from app.repository.base_repository import BaseRepository


class ReportRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Reports)
        
        
    def get_all_reports(self):
        with self.session_factory() as session:
            reports = session.query(Reports).order_by(desc(Reports.entered_on)).all()
            return reports
    
    
    def create_report(self, report_data: ReportCreate):
        try:
            with self.session_factory() as session:
            
                new_report = Reports(**report_data)
                session.add(new_report)
                session.commit()
                session.refresh(new_report)
                return new_report
        except Exception as e:
            session.rollback()
            raise HTTPException(status_code=500, detail=str(e))