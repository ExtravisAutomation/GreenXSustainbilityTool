import logging
from app.ONBOARDING.Database.db_connector import DBConnection  # Import DBConnection correctly based on your project structure
from app.ONBOARDING.Models.model import Device, PasswordGroup
from app.ONBOARDING.ACI.APIC import APIClient
import sys
import ast
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='main.log',  # Specify the file to save the logs
    filemode='a'  # Use 'a' to append to the file or 'w' to write over it
)
class DeviceProcessor:
    def __init__(self):
        """Initialize the DeviceProcessor with a DBConnection instance."""
        self.db_connection = DBConnection()

    def get_devices_by_ids(self, device_ids):
        """Retrieve specified devices from the database based on their IDs and process them."""
        with self.db_connection.session_scope() as session:
            try:
                if device_ids:
                    logging.info(f"Fetching devices for IDs: {device_ids}")
                    devices = session.query(Device).filter(Device.id.in_(device_ids)).all()
                    if devices:
                        for device in devices:
                            print("Device")
                            self.process_device(device, session)

                    else:
                        logging.warning("No devices found for the provided IDs.")
                else:
                    logging.error("No device IDs provided for query.")
            except Exception as e:
                logging.error(f"An error occurred while fetching devices: {e}")

    def process_device(self, device, session):
        """Process individual devices by fetching associated password group and handling based on device type."""
        try:
            print("Processing device")
            password_group = session.query(PasswordGroup).filter(Device.password_group_id == PasswordGroup.id).first()
            if password_group:
                print("Processing password",)
                logging.info(f"Processing device ID {device.id} with type {device.device_type}")
                self.handle_device_type(device, password_group)
            else:
                logging.warning(f"No password group found for device ID {device.id}")
        except Exception as e:
            logging.error(f"Error processing device ID {device.id}: {e}")

    def handle_device_type(self, device, password_group):
        """Handle specific actions based on device type."""
        print("Handling device type",(device.device_type).lower())
        if (device.device_type).lower() == 'apic':
            print("Device type")
            aci=APIClient(device, password_group)
            data=aci.get_fabricNodes()

            print(data)
            logging.info(f"Handling APIC device: {device.id}")

# Example usage
processor = DeviceProcessor()
if len(sys.argv) > 1:
    try:
        # Using `ast.literal_eval` to safely evaluate the string as a Python literal
        device_ids = ast.literal_eval(sys.argv[1])
        if isinstance(device_ids, list) and all(isinstance(id, int) for id in device_ids):
            print("List of device IDs:", device_ids)
            processor.get_devices_by_ids(device_ids)

    except Exception as e:
        print("Exception")
# device_ids = [4392]  # Example list of device IDs you want to retrieve

