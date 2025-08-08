import logging
from Database.db_connector import DBConnection
from Models.model import Device, PasswordGroup, DeviceInventory, Vendor,DeviceType
from Cisco.ACI.APIC import APIClient
# from ACI.testingapic import APIClient
from Cisco.mds.datatraffic import mds_DataTraffic
from Cisco.ios.datatraffic import ios_DataTraffic

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='DataTraffic.log',
    filemode='a'
)

class DeviceProcessor:
    def __init__(self):
        self.db_connection = DBConnection()

    def get_devices(self):
        """Retrieve devices with collection status set to True."""
        with self.db_connection.session_scope() as session:
            logging.info("Retrieving devices with collection status True")
            try:
                device_type_ids=[2,3,4]
                pn_code_list=['C6807-XL']

                devices = (
                    session.query(Device, DeviceInventory, Vendor,
                                  DeviceType)  # Ensure DeviceType is included in the query
                    .join(DeviceInventory, Device.id == DeviceInventory.apic_controller_id)
                    .join(Vendor, Device.vendor_id == Vendor.id)
                    .join(DeviceType, Device.device_type_id == DeviceType.id)  # Ensure this join is correct
                    # .filter(Device.collection_status.is_(True))
                    # .filter(Device.OnBoardingStatus.is_(True))
                    .filter(Device.ip_address=='10.64.252.68')



                    # .filter(DeviceInventory.pn_code.like('%C9300%'))
                    .all()
                )
                print(len(devices))

                if devices:
                    logging.info("Devices found")


                    for device, device_inventory, vendor, devicetype in devices:
                        print(device.ip_address)
                        self.process_device(vendor, device, device_inventory, devicetype, session)
                else:
                    logging.warning("No devices found with collection status True")
            except Exception as e:
                logging.error(f"An error occurred while fetching devices: {e}")

    def get_password(self, device, session):
        """Retrieve the password group for a given device."""
        try:
            logging.info(f"Processing device ID {device.id} with password group ID {device.password_group_id}")
            password_group = session.query(PasswordGroup).filter_by(id=device.password_group_id).first()
            if password_group:
                logging.info("Password group found")
                return password_group
            logging.warning(f"No password group found for device ID {device.id}")
        except Exception as e:
            logging.error(f"Error processing device ID {device.id}: {e}")
        return None

    def process_device(self, vendor, device, device_inventory, devicetype,session):
        """Handle specific actions based on vendor and device type."""
        missing_attributes = []
        if not vendor.vendor_name:
            missing_attributes.append("vendor_name")
        if not devicetype.device_type:
            missing_attributes.append("device_type")
        if missing_attributes:
            logging.error(f"Device ID {device.id} is missing attributes: {', '.join(missing_attributes)}")
            return
        # Extract values after validation
        vendor_name = vendor.vendor_name.lower()
        device_type = devicetype.device_type.lower()
        print("Device Type", device_type)
        device_role = device_inventory.role.lower() if device_inventory.role else ""  # Handle optional role

        # Debugging Logs
        logging.info(f"Processing Device - Vendor: {vendor_name}, Type: {device_type}, Role: {device_role}")

        device_handlers = {
            "cisco": {
                "cisco_mds": self.handle_mds,  # No lambda needed, direct function reference
                "cisco_ios": self.handle_ios,
                "cisco_xe": self.handle_ios,
            }
    #         ,"huawei": {
    #     "huawei_cloudengine": self.handle_huawei_cloudengine,
    #     "huawei_ar": self.handle_huawei_ar,
    # }
        }
        handler = device_handlers.get(vendor_name, {}).get(device_type, None)
        if handler:

            handler(device, device_inventory, session)  # Pass required parameters
        else:
            self.log_unhandled_device(device, device_type)

    def handle_apic(self, device, device_inventory, session):
        logging.info(f"Handling APIC device: {device.ip_address}")
        password_group = self.get_password(device, session)
        aci = APIClient(device, device_inventory, password_group,session)
        aci.main()


    def handle_mds(self, device, device_inventory, session):
        logging.info(f"Handling Mds device: {device.ip_address}")
        password_group = self.get_password(device, session)
        mds = mds_DataTraffic(device, device_inventory, password_group,session).main()


    def handle_ios(self, device, device_inventory, session):
        logging.info(f"Handling IOS device: {device.ip_address}")
        password_group = self.get_password(device, session)
        if password_group:
            ios = mds_DataTraffic(device, device_inventory, password_group,session).main()

    def handle_iosxe(self, device, device_inventory, session):
        logging.info(f"Handling IOSXE device: {device.ip_address}")
        password_group = self.get_password(device, session)
        if password_group:
            ios_xe = mds_DataTraffic(device, device_inventory, password_group,session).main()

    def log_unhandled_role(self, role, device_type):
        logging.warning(f"Device role {role} is not 'controller' for {device_type} device")

    def log_unhandled_device(self, device, device_type):
        logging.warning(f"Unhandled device type: {device_type} for device ID {device.id}")

if __name__ == "__main__":
    processor = DeviceProcessor()

    processor.get_devices()
