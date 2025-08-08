
import logging
from threading import Thread
from collector.DataStore import DataStorage
from collector.ssh.ssh_commands import sshCommand  # Assuming sshCommand class implementation

import os
# Setup logging
logger = logging.getLogger(__name__)


class mds_Power:
    def __init__(self, device, device_inventory, password_group,session):
        """
        Initialize the NXOS class with device and password group.
        """
        self.device = device
        self.inventory = device_inventory
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = session # Proper initialization of the session
        self.version = device_inventory.software_version
        self.rack_id = device.rack_id
        self.site_id = device.site_id
        self.message=''
        self.baseurl = '/home/dev/DCS-Project/Collectors/textfsm/'

    def log_error(self, message):
        """
        Log an error message.
        """
        logging.error(message)

    def handle_power_data(self):
        if self.password_group_type.lower() == "ssh":
            ssh = sshCommand(self.device, self.password_group)
            ssh.get_commands(["show environment power"])
            template_paths = [
                os.path.join(self.baseurl, "cisco_nxos_show_environment_powerv2.textfsm"),
                # "DCS-Project/Collectors/textfsm/cisco_nxos_show_environment_powerv2.textfsm",
                # "DCS-Project/Collectors/textfsm/cisco_nxos_show_environment_powerv1.textfsm"
            ]

            error_message,power_output = ssh.main(template_paths)
            self.message=error_message
            logging.info(f"dtaa {power_output}, {type(power_output)}")
            powerUasage_data, reqPow_data = self.extract_powerUsage(power_output)
            print(powerUasage_data, reqPow_data)

            if powerUasage_data or reqPow_data:
                try:
                    datastore = DataStorage()
                    datastore.store_Powerdata(powerUasage_data)
                    # datastore.store_ReqPowerdata(reqPow_data)
                    logging.info(f"Power data  of {self.device.ip_address} is saved successfully .")
                except Exception as e:
                    self.log_error(f"Error in saving power data for device {self.device.ip_address}: {str(e)}")
            else:
                self.log_error(f"No power data for device {self.device.ip_address}")



    def log_error(self, message):
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting main process for device at {self.device.ip_address}")
            threads = []
            # Create threads for power data and traffic data retrieval
            thread1 = Thread(target=self.handle_power_data)
            # Starting threads
            threads.append(thread1)
            for thread in threads:
                thread.start()

            # Wait for all threads to complete
            for thread in threads:
                thread.join()
            try:
                self.inventory.error_message = self.message

                self.session.commit()
                logging.info(f"Saved error message to DB for {self.device.ip_address}")
            except Exception as e:
                self.log_error(f"Failed to save error message for {self.device.ip_address}: {str(e)}")
            # self.inventory.error_message=self.message



        except Exception as e:
            self.log_error(f"Error in fetching data for device {self.device.ip_address}: {str(e)}")
            raise  # Re-raise the exception for higher-level handling
        finally:
            logging.info("Process Completed.")


    def extract_powerUsage(self, output):
        aggregated_PowerUsage = {}
        aggregated_reqPow={}
        node = 0
        total_power_in=output.get("total_power_input")
        total_power_out=output.get("total_power_output")
        total_power_in = 0 if not total_power_in else total_power_in
        total_power_out = 0 if not total_power_out else total_power_out
        logging.info(f"{total_power_out},{total_power_in}")
        aggregated_PowerUsage[node] = {
            'ip': self.device.ip_address,
            'total_pIn': total_power_in,
            'total_pOut': total_power_out
        }

        aggregated_reqPow[node] = {
                'ip': self.device.ip_address,
                'total_power': total_power_out,
                'unique_powers': set()
            }
        return aggregated_PowerUsage,aggregated_reqPow