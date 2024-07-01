import logging
from sqlalchemy.exc import SQLAlchemyError
import requests
from sqlalchemy.orm import sessionmaker
from app.ONBOARDING.Models.model import Device, PasswordGroup, APICController, DeviceInventory
from app.ONBOARDING.Database.db_connector import DBConnection
import random
from datetime import datetime

from app.ONBOARDING.datastorage import DataStorage
from app.ONBOARDING.ssh_command.ssh_cli import sshCommand  # Assuming sshCommand class implementation
import re

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='onboardingDevicesApIC.log',  # Specify the file to save the logs
    filemode='a'  # Use 'a' to append to the file or 'w' to write over it
)


class NXOS:
    def __init__(self, device, password_group):
        """
        Initialize the NXOS class with device and password group.
        """
        self.device = device
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = requests.Session()  # Correct initialization of the session
        self.db_connection = DBConnection()
        self.rack_id = device.rack_id
        self.site_id = device.site_id

    def log_error(self, message):
        """
        Log an error message.
        """
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting onboarding process for device {self.device.ip_address}")
            if self.password_group_type.lower() == "ssh":
                logging.info("Using SSH for device management")
                ssh = sshCommand(self.device, self.password_group)
                ssh.getcommands(["show version", "show inventory"])
                template_paths = [
                    "textfsm/cisco_nxos_show_version.textfsm",
                    "textfsm/cisco_nxos_show_inventory.textfsm"
                ]

                inventory = ssh.main(template_paths)

                data_storage = DataStorage(inventory, self.device, self.password_group.id)
                data_storage.save_data()

                # logging.info("Data saved successfully.")

                return inventory

        except Exception as e:
            error_message = f"Error in onboarding process for device {self.device.ip_address}: {str(e)}"
            self.log_error(error_message)
            raise  # Re-raise the exception for higher-level handling

        finally:
            # Clean up resources if needed
            logging.info("Onboarding process completed.")


