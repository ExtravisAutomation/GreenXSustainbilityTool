import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from random import random
from typing import Dict, List, Any, Optional
import pandas as pd
from fastapi import HTTPException, status
import traceback

from app.repository.report_repository import ReportRepository
from app.schema.report_schema import ReportCreate

class ReportService:
    def __init__(self, report_repository: ReportRepository):
        self.report_repository = report_repository
        
        pass
    
    def calculate_start_end_dates(self, duration_str: str) -> (datetime, datetime):
        today = datetime.today()

        if duration_str == "First Quarter":
            duration_str = "Last 3 Months"
        elif duration_str == "Second Quarter":
            duration_str = "Last 6 Months"
        elif duration_str == "Third Quarter":
            duration_str = "Last 9 Months"

        if duration_str == "Last 9 Months":
            start_date = (today - timedelta(days=270)).replace(day=1)
            end_date = today
        elif duration_str == "Last 6 Months":
            start_date = (today - timedelta(days=180)).replace(day=1)
            end_date = today
        elif duration_str == "Last 3 Months":
            start_date = (today - timedelta(days=90)).replace(day=1)
            end_date = today
        elif duration_str == "Last Year":
            start_date = (today.replace(day=1, month=1) - timedelta(days=365)).replace(day=1)
            end_date = start_date.replace(month=12, day=31)
        elif duration_str == "Current Year":
            start_date = today.replace(month=1, day=1)
            end_date = today
        elif duration_str == "Current Month":
            start_date = today.replace(day=1)
            end_date = today
        elif duration_str == "Last Month":
            start_date = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
            end_date = (today.replace(day=1) - timedelta(days=1))
        elif duration_str == "7 Days":
            start_date = today - timedelta(days=7)
            end_date = today
        elif duration_str == "24 hours":
            start_date = today - timedelta(days=1)
            end_date = today
        else:
            raise ValueError("Unsupported duration format")

        return start_date, end_date
    
    
    def get_all_reports(self):
        reports = self.report_repository.get_all_reports()
        
        for report in reports:
            starttime, endtime = self.calculate_start_end_dates(report.duration)
            report.starttime = starttime
            report.endtime = endtime
        
        return reports
        
    
    def add_report(self, report: ReportCreate):
        
        if len(report.Duration) == 1:
            duration_str = report.Duration[0]
            print(duration_str)

        else:
            duration_str ='' 
        reports = []
        for report_type in report.ReportType:
            
            print(report)
            new_report = {
                "report_title": report.report_title,
                "report_type": report_type,
                "duration": duration_str,
                "path": '',
                "site_id": report.site_id,
                "entered_on": datetime.now(),
                "Status": True,
                "Message": "Success"
            }
            reports.append(new_report)
            print(f"Report added: {new_report}")  
            data= self.report_repository.create_report(new_report)
            
        return {"message": "Reports added successfully", "data": reports}