import sys
import traceback
from contextlib import AbstractContextManager
from datetime import timedelta, datetime
from typing import Callable, List
import json
import re
from sqlalchemy.orm import Session, joinedload
from app.model.apic_controller import APICController
from app.model.fabric_node import FabricNode
from app.model.APIC_controllers import APICControllers, Vendor
from app.schema.fabric_node import FabricNodeCreate
from app.repository.base_repository import BaseRepository
from app.repository.influxdb_repository import InfluxDBRepository
from openai import OpenAI
import os
from app.core.config import configs
import logging
from fastapi import HTTPException, status
# Configure logging
logging.basicConfig(
    filename='ai_repository.log',  # Log file name
    filemode='a',  # Append mode
    level=logging.DEBUG,  # Log level
    format='%(asctime)s - %(levelname)s - %(message)s'  # Log format
)

class AIRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 influxdb_repository: InfluxDBRepository):
        self.session_factory = session_factory
        self.influxdb_repository = influxdb_repository

        # Initialize OpenAI client
        self.openai_client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY") or configs.OPENAI_API_KEY
        )

    def check_ip(self, ip_address):
        with self.session_factory() as session:
            result = session.query(APICControllers).filter(APICControllers.ip_address == ip_address).first()
            return bool(result)

    def parse_input(self, user_input):
        """
        Parse user input, classify it into one of three categories (irrelevant, historical, or relevant but not historical),
        and return results based on classification.
        """
        logging.info(f"Received user input: {user_input}")
        try:
            # Use the OpenAI API with a structured prompt
            response = self.openai_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content":(
                f"Analyze the following input: '{user_input}'."
                f"\n1. If the input is irrelevant to data center sustainability, respond with 'irrelevant'."
                f"\n2. If it refers to historical data (e.g., contains IP address, duration, and one or more of the following keywords: "
                f"PUE, power usage effectiveness, EER, energy efficiency ratio, carbon emissions, data traffic, PCR, or power consumption ratio), "
                f"extract the following information in JSON format: "
                f"{{'ip_address': 'IP address', 'duration': 'Duration', 'keywords': ['Keyword1', 'Keyword2', ...]}}."
                f"\n3. If it is relevant to data center sustainability but not historical, provide a concise answer to the query without categorizing it."
            )

                    }
                ],
                model="gpt-4o"
            )

            # Extract OpenAI response content
            analysis = response.choices[0].message.content.strip()
            logging.debug(f"OpenAI response: {analysis}")

            # Check if response is irrelevant
            if analysis.lower() == "irrelevant":
                logging.info("Input deemed irrelevant to data center sustainability.")
                return {
                    "status": "error",
                    "message": "Your input is not relevant to data center sustainability."
                }

            # Check for historical data
            try:
                json_match = re.search(r'```json\n({.*?})\n```', analysis, re.DOTALL)

                if json_match:
                    # Historical data: Parse JSON and validate
                    extracted_data = json.loads(json_match.group(1))
                    ip_address = extracted_data.get("ip_address")
                    duration = extracted_data.get("duration")
                    keywords = extracted_data.get("keywords", [])
                    logging.debug(f"Extracted data: IP={ip_address}, Duration={duration}, Keywords={keywords}")

                    # Validate IP address format
                    ip_pattern = r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                    if not ip_address or not re.match(ip_pattern, ip_address):
                        logging.error("Invalid or missing IP address.")
                        return {
                            "status": "error",
                            "message": "Invalid or missing IP address."
                        }

                    # Check if IP address exists in the database
                    if not self.check_ip(ip_address):
                        logging.warning(f"IP address '{ip_address}' not found in the database.")
                        return {
                            "status": "error",
                            "message": f"IP address '{ip_address}' not found in our database."
                        }

                    # Validate duration
                    if not duration:
                        logging.error("Duration not found or ambiguous.")
                        return {
                            "status": "error",
                            "message": "Duration not found or ambiguous."
                        }

                    # Validate keywords
                    valid_keywords = ["pue", "power usage effectiveness", "eer", "energy efficiency ratio",
                                      "carbon emissions", "data traffic", "pcr", "power consumption ratio"]
                    invalid_keywords = [kw for kw in keywords if kw.lower() not in [k.lower() for k in valid_keywords]]

                    if invalid_keywords:
                        logging.error(f"Invalid keywords: {invalid_keywords}")
                        return {
                            "status": "error",
                            "message": f"Invalid keywords provided: {', '.join(invalid_keywords)}"
                        }

                    logging.info("All validations passed. Proceeding with historical data retrieval.")
                    return {
                        "status": "success",
                        "data": {
                            "ip_address": ip_address,
                            "duration": duration,
                            "keywords": keywords
                        }
                    }

            except json.JSONDecodeError:
                logging.error("Failed to parse JSON for historical data.")

            # Relevant but not historical: Provide a generic response
            logging.info("Input is relevant to data center sustainability but not historical.")
            return {
                "status": "ai",
                "message": analysis,  # Return the generic response from OpenAI
                "data": None
            }

        except Exception as e:
            logging.critical(f"Unhandled exception: {traceback.format_exc()}")
            return {
                "status": "error",
                "message": f"An error occurred while parsing input: {str(e)}"
            }

    def get_devide_data_by_site_id(self, device_data):
        # Input validation
        if not device_data.site_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="site_id is required"
            )
        if not device_data.device_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="device_id is required"
            )
        try:
            with self.session_factory() as session:
                # Query database
                existing_device = session.query(APICControllers).filter(
                    APICControllers.id == device_data.device_id,
                    APICControllers.site_id == device_data.site_id
                ).first()
                # Handle not found case
                if not existing_device:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Device {device_data.device_id} not found at site {device_data.site_id}"
                    )
                # Return successful response
                return existing_device.to_dict()  # Assuming model has serialization method
        except HTTPException:
            raise  # Re-raise HTTP exceptions we created
        except Exception as e:
            # Log the actual error here (recommended)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching device data"
            )
