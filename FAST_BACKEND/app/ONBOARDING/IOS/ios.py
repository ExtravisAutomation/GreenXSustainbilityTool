import logging
from sqlalchemy.exc import SQLAlchemyError
import requests
from app.ONBOARDING.Models.model import Device, PasswordGroup, DeviceInventory
from app.ONBOARDING.Database.db_connector import DBConnection
from app.ONBOARDING.datastorage.datastore import DataStorage
from app.ONBOARDING.ssh_command.ssh_cli import sshCommand
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='onboardingDevicesIOS.log',
    filemode='a'
)


class IOSXE:
    def __init__(self, device, password_group):
        self.device = device
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = requests.Session()
        self.db_connection = DBConnection()
        self.rack_id = device.rack_id
        self.site_id = device.site_id

    def log_error(self, message):
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting onboarding process for device {self.device.ip_address}")
            if self.password_group_type.lower() == "ssh":
                logging.info("Using SSH for device management")
                ssh = sshCommand(self.device, self.password_group)
                ssh.getcommands(["show version", "show inventory"])

                # TextFSM template paths
                template_paths = [
                    r"app/ONBOARDING/textfsm/cisco_ios_show_version.textfsm",
                    r"app/ONBOARDING/textfsm/cisco_ios_show_inventory.textfsm",
                ]
                # Execute commands and parse output
                inventory = ssh.main(template_paths)

                # Store parsed data
                data_storage = DataStorage(inventory, self.device, self.password_group.id)
                data_storage.save_data()

                return inventory

        except Exception as e:
            error_message = f"Error in onboarding process for device {self.device.ip_address}: {str(e)}"
            self.log_error(error_message)
            raise