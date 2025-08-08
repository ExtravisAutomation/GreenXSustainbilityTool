
import logging
from threading import Thread
from collector.DataStore import DataStorage
from collector.Database.db_connector import DBConnection
from collector.ssh.ssh_commands import sshCommand  # Assuming sshCommand class implementation

import os
# Setup logging
logger = logging.getLogger(__name__)

class mds_DataTraffic:
    def __init__(self, device, device_inventory, password_group, session):
        """
        Initialize the NXOS class with device and password group.
        """
        self.db_connection = DBConnection()
        self.device = device
        self.inventory = device_inventory
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = session  # Proper initialization of the session
        self.version = device_inventory.software_version
        self.rack_id = device.rack_id
        self.site_id = device.site_id
        self.query_api = self.db_connection.query_api
        self.message = ''

        self.baseurl = r'C:\Users\saman\PycharmProjects\Collectors_Datacenter\textfsm'

    def log_error(self, message):
        """
        Log an error message.
        """
        logging.error(message)

    def handle_traffic_data(self):
        if self.password_group_type.lower() == "ssh":
            ssh = sshCommand(self.device, self.password_group)
            ssh.get_commands(["show interface", "show interface snmp-ifindex"])

            template_paths = [
                os.path.join(self.baseurl, "cisco_nxos_show_interface.textfsm"),
                os.path.join(self.baseurl, "cisco_nxos_show_interface_snmp-ifindex.textfsm")
            ]

            datatraffic, error_message = ssh.main2(template_paths)
            self.message += error_message if error_message else ""
            data = self.extract_datatraffic(datatraffic)
            logging.info("Traffic data received.")
            print(data)
            datastore = DataStorage()
            datastore.store_DataTraffic(data)

    def log_error(self, message):
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting main process for device at {self.device.ip_address}")
            threads = []
            thread2 = Thread(target=self.handle_traffic_data)
            threads.append(thread2)
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

    def extract_datatraffic(self, data):
        node = 1
        total_input_data = data.get("total_input_data", 0)
        total_output_data = data.get("total_output_data", 0)
        total_input_packets = data.get("total_input_packets", 0)
        total_output_packets = data.get("total_output_packets", 0)
        total_bandwidth = data.get("total_bandwidth", 0)
        print("VKFXk0)))))))))))))))))))))))))))))))))))))))))))))))))))))))")
        print(total_input_data, total_output_data, total_output_packets, total_input_packets)
        # Pre-values from InfluxDB
        pre_total_bytesRateLast = 0
        pre_total_input_bytes = 0
        pre_total_output_bytes = 0
        pre_total_pktsRateLast = 0

        # Correct Flux query with f-string
        query = f'''
        from(bucket: "Dcs_db")
          |> range(start: -5m, stop: now())
          |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
          |> filter(fn: (r) => r["ApicController_IP"] == "{self.device.ip_address}")
          |> last()
        '''

        try:
            result = self.query_api.query(query)
            if result:
                for table in result:
                    for record in table.records:
                        field = record.get_field()
                        value = record.get_value() or 0  # default to 0 if None

                        if field == "total_bytesRateLast":
                            pre_total_bytesRateLast = value
                        elif field == "total_input_bytes":
                            pre_total_input_bytes = value
                        elif field == "total_output_bytes":
                            pre_total_output_bytes = value
                        elif field == "total_pktsRateLast":
                            pre_total_pktsRateLast = value
        except Exception as e:
            logging.error(f"Error in InfluxDB query: {e}")
        print("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        print(pre_total_input_bytes,pre_total_output_bytes,pre_total_pktsRateLast,pre_total_bytesRateLast)
        # Delta calculations
        delta_input_data = abs(pre_total_input_bytes - total_input_data)
        delta_output_data = abs(pre_total_output_bytes - total_output_data)
        delta_pktsRateLast = abs(pre_total_pktsRateLast - (total_input_packets + total_output_packets))
        delta_bytesRateLast = abs(pre_total_bytesRateLast - (total_output_data + total_input_data))

        aggregated_datatraffic_values = {
            node: {
                'ip': self.device.ip_address,
                'bytesLast': 0,
                'bytesRateLast': delta_bytesRateLast,
                'pktsLast': 0,
                'total_input_bytes': delta_input_data,
                'total_output_bytes': delta_output_data,
                'pktsRateLast': delta_pktsRateLast,
                'bandwidth': total_bandwidth
            }
        }
        print(aggregated_datatraffic_values)
        return aggregated_datatraffic_values

    # {1: {'ip': '10.64.252.68', 'bytesLast': 0, 'bytesRateLast': 88317625.0, 'pktsLast': 0,
    #      'total_input_bytes': 38063625.0, 'total_output_bytes': 50254000.0, 'pktsRateLast': 22844478.0,
    #      'bandwidth': 354000000}}




