import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
from random import random
from typing import Dict, List, Any, Optional

from starlette.responses import JSONResponse
import pandas as pd
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository
import traceback

from app.repository.influxdb_repository import InfluxDBRepository
from app.repository.ai_repository import AIRepository
from app.schema.site_schema import DeviceEnergyMetric, HourlyEnergyMetricsResponse
from app.schema.site_schema import HourlyDevicePowerMetricsResponse, DevicePowerMetric
from app.schema.site_schema import TopDevicesPowerResponse, DevicePowerConsumption
from app.schema.site_schema import DeviceTrafficThroughputMetric1, TrafficThroughputMetricsResponse
from app.schema.site_schema import DevicePowerComparisonPercentage
from app.schema.site_schema import ComparisonDeviceMetricsDetails
from app.schema.site_schema import SiteDetails_get
import math
from app.model.site import PasswordGroup
from app.schema.site_schema import PasswordGroupCreate
from app.model.APIC_controllers import APICControllers
from app.schema.site_schema import APICControllersCreate, APICControllersUpdate
from app.schema.site_schema import APICControllersResponse
from app.schema.site_schema import PasswordGroupUpdate
from app.schema.site_schema import RackResponse
from app.schema.site_schema import DeviceEnergyDetailResponse123
from app.schema.site_schema import DeviceCreateRequest
import pandas as pd
from io import BytesIO
from app.schema.site_schema import CSPCDevicesWithSntcResponse
from app.schema.ai_schema import *
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    filename="ai_service.log",
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self, site_repository: SiteRepository, influxdb_repository: InfluxDBRepository, ai_repository):
        self.site_repository = site_repository
        self.influxdb_repository = influxdb_repository
        self.ai_repository = ai_repository

    def ask_openai_questions(self, question: str) -> str:
        return self.ai_repository.get_chatbot_response(question)

    def get_chatbot_response(self, question: str) -> str:
        try:
            logger.info(f"Received question: {question}")

            # Parse input to extract structured information
            parsed_response = self.ai_repository.parse_input(question)
            logger.debug(f"Parsed response: {parsed_response}")

            if parsed_response["status"] == "error":
                logger.error(f"Error in parsing input: {parsed_response['message']}")
                return {"status": "error", "message": parsed_response["message"]}

            # Extract validated data
            ip_address = parsed_response["data"].get("ip_address")
            duration = parsed_response["data"].get("duration")
            keywords = parsed_response["data"].get("keywords")  # Now handles multiple keywords

            # Process the request using extracted data
            results = {}
            for keyword in keywords:
                try:
                    result = self.process_request(ip_address, duration, keyword)
                    results[keyword] = result
                    logger.info(f"Processed {keyword} successfully for IP {ip_address}.")
                except Exception as e:
                    logger.error(f"Error processing keyword {keyword}: {e}")
                    results[keyword] = {"status": "error", "message": str(e)}

            # Format the response
            formatted_message = f"Results for {ip_address} over {duration}:\n"
            for keyword, result in results.items():
                if isinstance(result, dict) and "status" in result and result["status"] == "error":
                    formatted_message += f"  - {keyword}: {result['message']}\n"
                else:
                    formatted_message += f"  - {keyword}: {result['data']}\n"

            logger.debug(f"Final formatted message: {formatted_message}")
            return {"status": "success", "message": formatted_message, "data": results}

        except ValueError as e:
            logger.error(f"ValueError occurred: {e}")
            return {"status": "error", "message": str(e)}
        except Exception as e:
            logger.critical(f"Unexpected error: {traceback.format_exc()}")
            return {"status": "error", "message": f"An unexpected error occurred: {str(e)}"}

    def calculate_start_end_dates(self, duration_str):
        logger.info(f"Calculating start and end dates for duration: {duration_str}")
        today = datetime.today()
        try:
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
            elif duration_str == "24 hours" or duration_str == "last 24 hours":
                start_date = today - timedelta(days=1)
                end_date = today
            else:
                raise ValueError("Unsupported duration format")

            logger.debug(f"Calculated dates - Start: {start_date}, End: {end_date}")
            return start_date, end_date

        except Exception as e:
            logger.error(f"Error in calculating dates: {e}")
            raise

    def get_data_traffic(self, ip_address, start_date, end_date):
        logger.info(f"Fetching data traffic for IP: {ip_address} from {start_date} to {end_date}.")
        return f"Fetching Data Traffic for IP: {ip_address} from {start_date} to {end_date}."

    def get_pcr_data(self, ip_address, start_date, end_date):
        logger.info(f"Fetching PCR data for IP: {ip_address} from {start_date} to {end_date}.")
        return f"Fetching PCR data for IP: {ip_address} from {start_date} to {end_date}."

    def process_request(self, ip_address, duration, keyword):
        logger.info(f"Processing request with IP: {ip_address}, Duration: {duration}, Keyword: {keyword}")
        start_date, end_date = self.calculate_start_end_dates(duration)
        try:
            if keyword.lower() in ["pue", "power usage effectiveness"]:
                logger.info(f"Fetching PUE for {ip_address}")
                result = self.influxdb_repository.get_metrics(ip_address, start_date, end_date, duration, "pue")
            elif keyword.lower() in ["eer", "energy efficiency ratio"]:
                logger.info(f"Fetching EER for {ip_address}")
                result = self.influxdb_repository.get_metrics(ip_address, start_date, end_date, duration, "eer")
            elif keyword.lower() in ["carbon emissions"]:
                logger.info(f"Fetching Carbon Emissions for {ip_address}")
                result = self.influxdb_repository.get_metrics(ip_address, start_date, end_date, duration,
                                                              "carbon emissions")
            elif keyword.lower() in ["data traffic"]:
                logger.info(f"Fetching Data Traffic for {ip_address}")
                result = self.get_data_traffic(ip_address, start_date, end_date)
            elif keyword.lower() in ["pcr", "power consumption ratio"]:
                logger.info(f"Fetching PCR for {ip_address}")
                result = self.get_pcr_data(ip_address, start_date, end_date)
            else:
                logger.error("Invalid keyword provided.")
                raise ValueError("Invalid keyword provided.")

            logger.debug(f"Processed result for {keyword}: {result}")
            return result

        except Exception as e:
            logger.error(f"Error in processing request for {keyword}: {e}")
            raise