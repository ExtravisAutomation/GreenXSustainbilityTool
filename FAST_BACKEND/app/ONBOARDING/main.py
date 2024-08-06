import logging
from app.ONBOARDING.Database.db_connector import DBConnection  # Import DBConnection correctly based on your project structure
from app.ONBOARDING.Models.model import Device, PasswordGroup
from app.ONBOARDING.ACI.APIC import APIClient
from app.ONBOARDING.NXos.nxos import NXOS
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
                    print(f"Fetching devices for IDs: {device_ids}")
                    devices = session.query(Device).filter(Device.id.in_(device_ids)).all()
                    print(len(devices), " devices")
                    if devices:
                        for device in devices:
                            if device.device_type:
                                self.handle_device_type(device, session)
                            else:
                                self.handle_device_vendor(device, session)
                    else:
                        logging.warning("No devices found for the provided IDs.")
                else:
                    logging.error("No device IDs provided for query.")
            except Exception as e:
                logging.error(f"An error occurred while fetching devices: {e}")

    def get_password(self, device, session):
        """Retrieve associated password group for the device."""
        try:
            print("Processing device", device.password_group_id)
            password_group = session.query(PasswordGroup).filter(PasswordGroup.id == device.password_group_id).first()
            if password_group:
                print("Processing password")
                logging.info(f"Processing device ID {device.id} with type {device.device_type}")
                return password_group
            else:
                logging.warning(f"No password group found for device ID {device.id}")
                return None
        except Exception as e:
            logging.error(f"Error processing device ID {device.id}: {e}")
            return None

    def handle_device_type(self, device, session):
        """Handle specific actions based on device type."""
        device_type = (device.device_type).lower()
        print("Handling device type", device_type)
        if device_type == 'apic':
            print("Device type")
            password_group = self.get_password(device, session)
            if password_group:
                aci = APIClient(device, password_group)
                aci.get_inventory()
                print(f"Device type is {device_type} and password is {password_group.username}")
                logging.info(f"Handling APIC device: {device.id}")
        elif device_type == "cisco_nxos":
            password_group = self.get_password(device, session)
            if password_group:
                print(f"Device type is {device_type} and password is {password_group.password_group_type}")
                nx = NXOS(device, password_group)
                print("Working")
                nx.main()
                logging.info(f"Handling NX-os device: {device.id}")

    def handle_device_vendor(self, device, session):
        """Handle devices by trying different device types based on vendor."""
        device_types = self.get_device_types_for_vendor(device.device_name)  # Get device types for the given vendor
        for device_type in device_types:
            if self.try_device_type(device, device_type, session):
                device.device_type = device_type  # Set the device type based on successful connection
                session.commit()
                self.handle_device_type(device, session)
                break
        else:
            logging.error(f"Failed to onboard device {device.id} for all tried device types")

    def try_device_type(self, device, device_type, session):
        """Try to connect to the device using a specific device type."""
        try:
            if device_type == 'apic':
                password_group = self.get_password(device, session)
                if password_group:
                    aci = APIClient(device, password_group)
                    aci.get_inventory()
                    return True
            elif device_type == "cisco_nxos":
                password_group = self.get_password(device, session)
                if password_group:
                    nx = NXOS(device, password_group)
                    nx.main()
                    return True
        except Exception as e:
            logging.error(f"Failed to onboard device {device.id} with type {device_type}: {e}")
        return False

    def get_device_types_for_vendor(self, vendor):
        """Return device types based on vendor."""
        vendor_device_types = {
            "cisco": ["apic", "cisco_nxos"],
            # Add other vendors and their device types here
        }
        return vendor_device_types.get(vendor.lower(), [])


processor = DeviceProcessor()
if len(sys.argv) > 1:
    try:
        # Using `ast.literal_eval` to safely evaluate the string as a Python literal
        device_ids = ast.literal_eval(sys.argv[1])
        if isinstance(device_ids, list) and all(isinstance(id, int) for id in device_ids):
            print("List of device IDs:", device_ids)
            processor.get_devices_by_ids(device_ids)
    except Exception as e:
        print(f"Exception: {e}")
        logging.error(f"Exception: {e}")





















# import logging
# from app.ONBOARDING.Database.db_connector import \
#     DBConnection  # Import DBConnection correctly based on your project structure
# from app.ONBOARDING.Models.model import Device, PasswordGroup
# from app.ONBOARDING.ACI.APIC import APIClient
# from app.ONBOARDING.NXos.nxos import NXOS
# import sys
# import ast
#
# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     filename='main.log',  # Specify the file to save the logs
#     filemode='a'  # Use 'a' to append to the file or 'w' to write over it
# )
#
#
# class DeviceProcessor:
#     def __init__(self):
#         """Initialize the DeviceProcessor with a DBConnection instance."""
#         self.db_connection = DBConnection()
#
#     def get_devices_by_ids(self, device_ids):
#         """Retrieve specified devices from the database based on their IDs and process them."""
#         with self.db_connection.session_scope() as session:
#             try:
#                 if device_ids:
#                     print(f"Fetching devices for IDs: {device_ids}")
#                     devices = session.query(Device).filter(Device.id.in_(device_ids)).all()
#                     print(len(devices), " devices")
#                     if devices:
#                         for device in devices:
#                             print("Device")
#                             self.handle_device_type(device, session)
#                     else:
#                         self.handle_device_vendor(device, session)
#                 else:
#                     logging.error("No device IDs provided for query.")
#             except Exception as e:
#                 logging.error(f"An error occurred while fetching devices: {e}")
#
#     def get_password(self, device, session):
#         """Process individual devices by fetching associated password group and handling based on device type."""
#         try:
#             print("Processing device", device.password_group_id)
#             password_group = session.query(PasswordGroup).filter(PasswordGroup.id == device.password_group_id).first()
#             if password_group:
#                 print("Processing password", )
#                 logging.info(f"Processing device ID {device.id} with type {device.device_type}")
#                 return password_group
#             else:
#                 logging.warning(f"No password group found for device ID {device.id}")
#         except Exception as e:
#             logging.error(f"Error processing device ID {device.id}: {e}")
#
#     def handle_device_type(self, device, session):
#         """Handle specific actions based on device type."""
#         print("Handling device type", (device.device_type).lower())
#         deviceType = (device.device_type).lower()
#         if deviceType == 'apic':
#             print("Device type")
#             password_group = self.get_password(device, session)
#
#             aci = APIClient(device, password_group)
#
#             aci.get_inventory()
#
#             print(f"Device type is {deviceType} and password is {password_group.username}")
#             logging.info(f"Handling APIC device: {device.id}")
#         elif deviceType == "cisco_nxos":
#
#             password_group = self.get_password(device, session)
#             print(f"Device type is {deviceType} and password is {password_group.password_group_type}")
#             nx = NXOS(device, password_group)
#             print("Wokring")
#             nx.main()
#             logging.info(f"Handling NX-os device: {device.id}")
#
#     def handle_device_vendor(self, device, session):
#         device_types = self.get_device_types_for_vendor(device.vendor)  # Get device types for the given vendor
#         for device_type in device_types:
#             if self.try_device_type(device, device_type, session):
#                 device.device_type = device_type  # Set the device type based on successful connection
#                 self.handle_device_type(device, device_type, session)
#                 break
#         else:
#             logging.error(f"Failed to onboard device {device.id} for all tried device types")
#
#     def try_device_type(self, device, device_type, session):
#         try:
#             if device_type == 'apic':
#                 password_group = self.get_password(device, session)
#                 aci = APIClient(device, password_group)
#                 aci.get_inventory()
#                 return True
#             elif device_type == "cisco_nxos":
#                 password_group = self.get_password(device, session)
#                 nx = NXOS(device, password_group)
#                 nx.main()
#                 return True
#         except Exception as e:
#             logging.error(f"Failed to onboard device {device.id} with type {device_type}: {e}")
#             return False
#
#     def get_device_types_for_vendor(self, vendor):
#         # Add logic to return device types based on vendor
#         vendor_device_types = {
#             "cisco": ["apic", "cisco_nxos"],
#             # Add other vendors and their device types here
#         }
#         return vendor_device_types.get(vendor.lower(), [])
#
#
# processor = DeviceProcessor()
# if len(sys.argv) > 1:
#     try:
#         # Using `ast.literal_eval` to safely evaluate the string as a Python literal
#         device_ids = ast.literal_eval(sys.argv[1])
#         if isinstance(device_ids, list) and all(isinstance(id, int) for id in device_ids):
#             print("List of device IDs:", device_ids)
#             processor.get_devices_by_ids(device_ids)
#
#     except Exception as e:
#         print("Exception")
# # device_ids = [4392]  # Example list of device IDs you want to retrieve
