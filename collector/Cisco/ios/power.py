import logging
from threading import Thread
from collector.ssh.show_interface_ssh import SSHCmd


from collector.DataStore import DataStorage
from collector.ssh.ssh_commands2 import sshCommand  # Assuming sshCommand class implementation

import  os
# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='onboardingDevicesApIC.log',
    filemode='a'
)

class ios_Power:
    def __init__(self, device, device_inventory, password_group,session):
        self.device = device
        self.inventory = device_inventory
        self.password_group = password_group
        self.password_group_type = password_group.password_group_type
        self.session = session
        self.rack_id = device.rack_id
        self.site_id = device.site_id
        self.message = ''
        self.baseurl = r"C:\Users\saman\PycharmProjects\Collectors_Datacenter\textfsm"
        self.ip_list=[]

    def log_error(self, message):
        logging.error(message)
    def commands(self,commands,template_paths):
        ssh = sshCommand(self.device, self.password_group)
        ssh.get_commands(commands)
        self.error_message,power_output = ssh.main(template_paths)
        logging.info(f"Data {power_output}, {type(power_output)}")
        power_usage_data, req_power_data = self.extract_power_usage(power_output)
        return power_usage_data, req_power_data

    def fetch_power_data(self, commands, template_paths):
        """ Helper method to fetch power data. """
        # power_output = ssh.main(template_paths)
        # logging.info(f"Data {power_output}, {type(power_output)}")
        return self.commands(commands, template_paths)

    def handle_power_data(self):
        power_usage_data, req_power_data = 0, 0
        if self.password_group_type.lower() == "ssh":

            # ssh = sshCommand(self.device, self.password_group)
            # ssh.get_commands(["show power inline"])
            # """ Main method to process power data. """
            commands = ["show power detail","show power",'show power inline']
            template_paths = [
                os.path.join(self.baseurl, "showpower_details.textfsm"),
                os.path.join(self.baseurl, "show_power_ios_new.textfsm"),
                os.path.join(self.baseurl,"cisco_ios_show_power.textfsm"),
                os.path.join(self.baseurl, "cisco_ios_show_power_inline_v2.textfsm"),
            ]
            # Fetching initial power data
            power_usage_data, req_power_data = self.fetch_power_data(commands, template_paths)
            print("power",power_usage_data, req_power_data)
            if power_usage_data and req_power_data:
                try:

                    datastore = DataStorage()
                    datastore.store_Powerdata(power_usage_data)
                    datastore.store_ReqPowerdata(req_power_data)
                    logging.info("Power data saved successfully.")
                except Exception as e:
                    self.log_error(f"Error in saving power data for device {self.device.ip_address}: {str(e)}")
            else:
                self.log_error(f"No power data for device {self.device.ip_address}")

            # Print IP list
            print(self.ip_list)



    def handle_traffic_data(self):
        if self.password_group_type.lower() == "ssh":
            ssh = SSHCmd(self.device, self.password_group)
            ssh.get_commands(["show interfaces summary"])
            template_paths = [
                os.path.join(self.baseurl, "show_interfaces_summary.textfsm"),

            ]

            self.error_message,data_traffic = ssh.get_traffic(template_paths)
            print(self.error_message, "Issue")
            print(data_traffic,"")
            data = self.extract_data_traffic(data_traffic)
            print(data)
            logging.info(f"Traffic data received: {data}")
            datastore = DataStorage()
            datastore.store_DataTraffic(data)

    def log_error(self, message):
        logging.error(message)

    def main(self):
        try:
            logging.info(f"Starting main process for device at {self.device.ip_address}")
            threads = []

            thread1 = Thread(target=self.handle_power_data)
            # thread2 = Thread(target=self.handle_traffic_data)

            threads.append(thread1)
            # threads.append(thread2)
            for thread in threads:
                thread.start()


            for thread in threads:
                thread.join()
            try:
                self.inventory.error_message = self.error_message
                self.session.commit()
                logging.info(f"Saved error message to DB for {self.device.ip_address}")
            except Exception as e:
                self.log_error(f"Failed to save error message for {self.device.ip_address}: {str(e)}")

        except Exception as e:
            self.log_error(f"Error in fetching data for device {self.device.ip_address}: {str(e)}")
            raise
        finally:
            logging.info("Process Completed.")

    def extract_power_usage(self, output):
        if not output:
            return {}, {}

        aggregated_power_usage = {}
        aggregated_req_power = {}
        node = 0
        if output and len(output) > 0:
            total_power_in = output.get("total_power_input", 0)
            total_power_out = output.get("total_power_output", 0)
        else:
            total_power_in = 0
            total_power_out = 0


        logging.info(f"{total_power_out},{total_power_in}")
        aggregated_power_usage[node] = {
            'ip': self.device.ip_address,
            'total_pIn': total_power_in,
            'total_pOut': total_power_out
        }

        aggregated_req_power[node] = {
            'ip': self.device.ip_address,
            'total_power': total_power_out,
            'unique_powers': set()
        }
        return aggregated_power_usage, aggregated_req_power

    def extract_data_traffic(self, data):
        if not data:
            return {}
        node = 1
        aggregated_data_traffic_values = {}
        # Directly accessing the values from the dictionary
        total_input_data = data.get("total_rxbs", 0)
        total_output_data = data.get("total_txbs", 0)
        total_input_packets = data.get("total_rxps", 0)
        total_output_packets = data.get("total_txps", 0)


        aggregated_data_traffic_values[node] = {
            'ip': self.device.ip_address,
            'bytesLast': 0,
            'total_input_bytes':total_input_data,
            'total_output_bytes':total_output_data,
            'bytesRateLast': total_input_data + total_output_data,
            'pktsLast': 0,
            'pktsRateLast': total_input_packets + total_output_packets,

        }
        return aggregated_data_traffic_values
