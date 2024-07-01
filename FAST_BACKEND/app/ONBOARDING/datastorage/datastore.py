import random
from datetime import datetime
# Setup logging
import re
import logging

from app.ONBOARDING.Models.model import Device, DeviceInventory, APICController

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='onboardingDevicesApIC.log',  # Specify the file to save the logs
    filemode='a'  # Use 'a' to append to the file or 'w' to write over it
)
from Database.db_connector import DBConnection
class DataStorage:

    def __init__(self, inventorydata,device, passwordID):
        print("datastorage")
        self.db_connection = DBConnection()
        print("datastorage db")
        self.rack_id=device.rack_id
        print("datastorage rack")
        self.site_id=device.site_id
        print("datastorage site")
        self.inventorydata = inventorydata
        print("datastorage inventory data",len(self.inventorydata))
        self.password_id=passwordID
        print("datastorage password")
        self.deviceType=device.device_type
        print("device_done")

    def save_data(self):
        print("Saving data", len(self.inventorydata))

        for node_id, node_info in self.inventorydata.items():
            try:

                with self.db_connection.session_scope() as session:
                    logging.info(f"Processing node {node_id} with info {node_info}")
                    print(node_info['address'])
                    print(node_info['name'])

                    device = session.query(Device).filter(Device.ip_address == node_info['address']).first()

                    if not device:
                        device = Device(
                            ip_address=node_info['address'],
                            device_type=self.deviceType,
                            device_name=node_info['name'],
                            site_id=self.site_id,
                            rack_id=self.rack_id,
                            rack_unit=2,
                            OnBoardingStatus=True,
                            password_group_id=self.password_id,
                            node_id=node_info['id']

                        )
                        session.add(device)
                        logging.info(f"Added new device with IP: {node_info['address']}")
                    else:
                        device.OnBoardingStatus = True
                        device.device_name = node_info['name']
                        logging.info(f"Updated existing device with IP: {node_info['address']}")

                    session.commit()  # Commit each device as it's processed
                    self.add_deviceinventory(device.id, node_info, session)

                    logging.info(f"Finished processing node {node_id}")
            except Exception as e:
                logging.error(f"Error saving data for node {node_id}: {e}")

    def add_deviceinventory(self, device_id, node_info, session):
        try:
            apic = session.query(DeviceInventory).filter(DeviceInventory.apic_controller_id == device_id).first()
            if not apic:
                new_apic = APICController(
                    id=device_id,
                    ip_address=node_info['address'],
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                session.add(new_apic)
                logging.info(f"Added new APIC controller with IP: {node_info['address']}")

                new_device = DeviceInventory(
                    pn_code=node_info['model'],
                    serial_number=node_info['serial'],
                    site_id=self.site_id,
                    rack_id=self.rack_id,
                    software_version=node_info['version'],
                    manufacturer=node_info['vendor'],
                    device_name=node_info['name'],  # Fixed typo
                    status=node_info['status'],
                    apic_controller_id=device_id,
                    role=node_info['role']
                )
                session.add(new_device)
                logging.info(f"Added new device inventory with IP: {node_info['address']}")
            session.commit()
        except Exception as e:
            logging.error(f"Error in add_deviceinventory: {e}")
            raise  # Raise the exception to handle it in the caller or let it propagate


