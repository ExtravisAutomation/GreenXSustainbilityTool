import logging
from app.ONBOARDING.Database.db_connector import DBConnection  # Import DBConnection correctly based on your project structure
from app.ONBOARDING.Models.model import Device, PasswordGroup
from app.ONBOARDING.ACI.APIC import APIClient
from app.ONBOARDING.NXos.nxos import NXOS
from app.ONBOARDING.IOS.ios import IOSXE
import sys
import ast
import concurrent.futures

from app.ONBOARDING.testing1 import get_devices

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
                    print(device_ids)
                    logging.info(f"Fetching devices for IDs: {device_ids}")
                    devices = session.query(Device).filter(Device.id.in_(device_ids)).all()
                    logging.info(f"{len(devices)} devices found")
                    if devices:
                        print(len(devices))
                        self.run_device_processing(devices)
                    else:
                        logging.warning("No devices found for the provided IDs.")
                else:
                    logging.error("No device IDs provided for query.")
            except Exception as e:
                logging.error(f"An error occurred while fetching devices: {e}")

    def process_device(self, device_id):
        """Process a single device in its own thread with its own session."""
        with self.db_connection.session_scope() as session:
            try:
                # Retrieve the device

                device = session.query(Device).filter_by(id=device_id).first()
                if not device:
                    logging.warning(f"Device with ID {device_id} not found.")
                    return

                password_group = self.get_password(device, session)

                if not device.device_type:
                    logging.info(f"Device type for {device.ip_address} not found, fetching...")
                    device_type = get_devices(device, session, password_group)

                    logging.info(f"Fetched device type for {device.ip_address}: {device_type}")
                    device.device_type = device_type
                    session.commit()  # Commit only when device type is updated

                # Handle the device type (whether newly fetched or already existing)
                self.handle_device_type(device, session, password_group)

            except Exception as e:
                logging.error(f"An error occurred while processing device {device_id}: {e}")

    def run_device_processing(self, devices):
        """Run multithreaded device processing."""
        with concurrent.futures.ThreadPoolExecutor() as executor:
            device_ids = [device.id for device in devices]
            # Submit each device to be processed in a separate thread
            futures = [executor.submit(self.process_device, device_id) for device_id in device_ids]

            # Wait for all threads to complete and handle exceptions
            for future in concurrent.futures.as_completed(futures):
                try:
                    future.result()  # This will raise any exceptions encountered during execution
                except Exception as exc:
                    logging.error(f"An error occurred during device processing: {exc}")

    def get_password(self, device, session):
        """Retrieve associated password group for the device."""
        try:
            password_group = session.query(PasswordGroup).filter_by(id=device.password_group_id).first()
            if password_group:
                logging.info(f"Processing device ID {device.id} with type {device.device_type}")
                return password_group
            else:
                logging.warning(f"No password group found for device ID {device.id}")
                return None
        except Exception as e:
            logging.error(f"Error processing device ID {device.id}: {e}")
            return None

    def handle_device_type(self, device, session, password_group):
        """Handle specific actions based on device type."""
        if device.device_type:
            device_type = device.device_type.lower()
            if device_type == 'apic':
                if password_group:
                    aci = APIClient(device, password_group)
                    aci.get_inventory()
                    logging.info(f"Handling APIC device: {device.id}")
            elif device_type == "cisco_nxos":
                if password_group:
                    nx = NXOS(device, password_group)
                    nx.main()
                    logging.info(f"Handling NX-OS device: {device.id}")
            elif device_type in ["cisco_ios", "cisco_xe", "cisco_xr"]:
                if password_group:
                    ios = IOSXE(device, password_group)
                    ios.main()
                    logging.info(f"Handling IOS device: {device.id}")


# Main execution block

processor = DeviceProcessor()
if len(sys.argv) > 1:
    try:
        device_ids = ast.literal_eval(sys.argv[1])
        if isinstance(device_ids, list) and all(isinstance(id, int) for id in device_ids):
            processor.get_devices_by_ids(device_ids)
    except Exception as e:
        logging.error(f"Exception: {e}")