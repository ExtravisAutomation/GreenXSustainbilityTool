import logging
from Database.db_connector import DBConnection
from Models.model import Device, PasswordGroup, DeviceInventory, Vendor, DeviceType

from collector.Cisco.MDS.mds import MDS
from collector.Cisco.IOS.iosxe import IOS

from collector.Cisco.ACI.APIC import APIClient

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='powerUsage.log',
    filemode='a'
)

class DeviceProcessor:
    def __init__(self):
        self.db_connection = DBConnection()

    def get_devices(self):
        with self.db_connection.session_scope() as session:
            try:
                logging.info("Fetching active devices for processing")
                devices = (
                    session.query(Device, DeviceInventory, Vendor, DeviceType)
                    .join(DeviceInventory, Device.id == DeviceInventory.apic_controller_id)
                    .join(Vendor, Device.vendor_id == Vendor.id)
                    .join(DeviceType, Device.device_type_id == DeviceType.id)
                    .filter(Device.collection_status.is_(True))
                    .filter(Device.OnBoardingStatus.is_(True))
                    .all()
                )

                if not devices:
                    logging.warning("No devices found with collection enabled")
                    return

                logging.info(f"Found {len(devices)} devices")
                for device, inv, vendor, dtype in devices:
                    self.process_device(vendor, device, inv, dtype, session)

            except Exception as e:
                logging.error(f"Device fetching failed: {e}")

    def get_password_group(self, device: Device, session) -> PasswordGroup:
        try:
            return session.query(PasswordGroup).get(device.password_group_id)
        except Exception as e:
            logging.error(f"Failed to fetch password group: {e}")
            return None

    def process_device(self, vendor, device, inventory, devicetype, session):
        vendor_name = (vendor.vendor_name or "").lower()
        device_type = (devicetype.device_type or "").lower()
        role = (inventory.role or "").lower()

        logging.info(f"Processing {vendor_name} device: {device.ip_address}, Type: {device_type}, Role: {role}")

        handler_map = {
            "cisco": {
                "apic": lambda: self.handle_apic(device, inventory,
                                                 session) if role == "controller" else self.log_unhandled_role(role,
                                                                                                               "APIC"),
                "cisco_mds": lambda: self.handle_mds(device, inventory, session),
                "cisco_ios": lambda: self.handle_ios(device, inventory, session),
                "cisco_xe": lambda: self.handle_ios(device, inventory, session),
            }
        }

        handler = handler_map.get(vendor_name, {}).get(device_type)
        if handler:
            handler()
        else:
            self.log_unhandled_device(device, device_type)

    def handle_apic(self, device, inventory, session):
        password = self.get_password_group(device, session)
        if password:
            APIClient(device, inventory, password, session).main()

    def handle_mds(self, device, inventory, session):
        password = self.get_password_group(device, session)
        if password:
            MDS(device, inventory, password, session).main()

    def handle_ios(self, device, inventory, session):
        password = self.get_password_group(device, session)
        if password:
            IOS(device, inventory, password, session).main()

    def log_unhandled_role(self, role, dtype):
        logging.warning(f"Role '{role}' not valid for {dtype}")

    def log_unhandled_device(self, device, dtype):
        logging.warning(f"No handler for {dtype} - Device {device.ip_address}")
