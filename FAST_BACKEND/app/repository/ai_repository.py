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
        Parse user input, validate extracted data, and return results as key-value pairs for chatbot response.
        Handle both historical data requests and generic relevant responses.
        """
        logging.info(f"Received user input: {user_input}")
        try:
            # Use the OpenAI API with a structured prompt
            response = self.openai_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Analyze the following input: '{user_input}'. If the input is relevant to data center sustainability:"
                            f"\n1. If it refers to historical data (e.g., contains IP address, duration, and one of the following keywords: "
                            f"PUE, power usage effectiveness, EER, energy efficiency ratio, carbon emissions, data traffic, PCR or power consumption ratio), "
                            f"extract the following information in JSON format: "
                            f"{{'ip_address': 'IP address', 'duration': 'Duration', 'keyword': 'Keyword'}}."
                            f"\n2. If it is relevant but not historical, provide a general response explaining the sustainability concept mentioned."
                            f"\n3. If irrelevant, respond with 'irrelevant'."
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

            # Try parsing response as JSON for historical data
            try:
                # extracted_data = analysis
                json_match = re.search(r'```json\n({.*?})\n```', analysis, re.DOTALL)

                # Extract and parse the JSON
                if json_match:
                    extracted_data = json.loads(json_match.group(1))
                    print(extracted_data)
                else:
                    print("No JSON found in the string.")
                print("Extracted",analysis)
                # Handle potential issues with response formatting
                # extracted_data = json.loads(analysis) if analysis.startswith("{") else json.loads(analysis.strip('`'))

                ip_address = extracted_data.get("ip_address")
                duration = extracted_data.get("duration")
                keyword = extracted_data.get("keyword")
                logging.debug(f"Extracted data: IP={ip_address}, Duration={duration}, Keyword={keyword}")

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

                # Validate keyword
                valid_keywords = ["pue", "power usage effectiveness", "eer", "energy efficiency ratio",
                                  "carbon emissions", "data traffic", "pcr", "power consumption ratio"]
                if not keyword or keyword.lower() not in [k.lower() for k in valid_keywords]:
                    logging.error("Invalid or missing keyword.")
                    return {
                        "status": "error",
                        "message": "Invalid or missing keyword."
                    }

                logging.info("All validations passed. Proceeding with historical data retrieval.")
                # Add further logic for data retrieval here

                return {
                    "status": "success",
                    "data": {
                        "ip_address": ip_address,
                        "duration": duration,
                        "keyword": keyword
                    }
                }

            except json.JSONDecodeError as e:
                logging.error(f"JSON decode error: {e}. Response: {analysis}")
                return {
                    "status": "error",
                    "message": "Failed to parse JSON from OpenAI API response."
                }

        except Exception as e:
            logging.critical(f"Unhandled exception: {traceback.format_exc()}")
            return {
                "status": "error",
                "message": f"An error occurred while parsing input: {str(e)}"
            }

