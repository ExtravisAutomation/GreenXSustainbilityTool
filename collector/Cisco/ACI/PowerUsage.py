import logging
from collections import defaultdict

import requests

import re

logger = logging.getLogger(__name__)
class Version4:
    def __init__(self, ipaddress, base_url, session):
        """
        Initialize the Version4 class.
        """
        self.ipaddress = ipaddress
        self.base_url = base_url
        self.session = session
        self.error_message=''
        self.get_ipaddress_Response = self.get_mgmtRsOoBStNode_response()

    def powerusage(self):
        try:
            logging.info("Fetching power usage data(version4).")
            url = f"{self.base_url}/node/class/eqptPsPower15min.json?&order-by=eqptPsPower15min.modTs|desc"
            psu_response = self.session.get(url, verify=False)
            psu_response.raise_for_status()
            power_data = psu_response.json()
            processed_psu_data = self.process_powerdata(power_data)
            logging.info("Power usage data (version 4) fetched and processed successfully.")
            return self.error_message,processed_psu_data
        except requests.exceptions.RequestException as e:
            self.error_message=f'Error fetching power usage data: {e}'
            logging.error(f"Error fetching power usage data: {e}")
            raise
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")
            raise
    def get_mgmtRsOoBStNode_response(self):
        """
        Get management out-of-band state node response.
        """
        url =f"{self.base_url}/node/class/mgmtRsOoBStNode.json?&order-by=mgmtRsOoBStNode.modTs|desc"
        # url = f"{self.base_url}{path}"
        try:
            response = self.session.get(url, verify=False)
            response.raise_for_status()
            imdata=response.json()["imdata"]

            node_address_map = {}
            for item in imdata:
                node_info = item['mgmtRsOoBStNode']['attributes']
                dn = node_info['dn']
                addr = node_info['addr'].split('/')[0]
                node_number = dn.split('/node-')[-1].strip(']')
                node_address_map[node_number] = addr

            return node_address_map

        except Exception as e:
            logging.error(f"Error fetching management out-of-band state node response: {e}")
            raise
    def get_ipaddress(self, node_id):

        return self.get_ipaddress_Response.get(node_id, "Node not found")
    def process_powerdata(self, power_data):
        logging.info("Starting to process power data for version 4")
        psu_info_list = power_data.get('imdata', [])
        psu_data = {}
        for psu_info in psu_info_list:
            try:
                attributes = psu_info.get('eqptPsPower15min', {}).get('attributes', {})
                dn = attributes.get('dn', 'N/A')
                node=re.search(r'node-(\d+)', dn).group(1) if re.search(r'node-(\d+)', dn) else 'N/A',

                if isinstance(node, tuple):
                    node = node[0]  # Extract the first element if node is a tuple

                psu_data[dn] = {
                    'pIn': float(attributes.get('suppliedAvg', '0')),
                    'pOut': float(attributes.get('drawnAvg', '0')),
                    'fan_power': float(attributes.get('fanPower', '0')),
                    'power_domain': float(attributes.get('powerDomain', '0')),
                    'fanSpeed': float(attributes.get('fanSpeed', '0')),
                    'psu_value': int(re.search(r'psu-(\d+)', dn).group(1)) if re.search(r'psu-(\d+)', dn) else 'N/A',
                    'node_value': int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else 'N/A',
                    'pod_value': int(re.search(r'pod-(\d+)', dn).group(1)) if re.search(r'pod-(\d+)', dn) else 'N/A',
                    'apic_ipaddress':  self.get_ipaddress(node),
                }
                logging.info(f"Processed data for dn: {dn}")

            except (AttributeError, ValueError) as e:
                logging.error(f"Error processing data for dn: {dn} - {e}")
            except Exception as e:
                logging.error(f"Unexpected error processing data for dn: {dn} - {e}")

        logging.info("Completed processing power data(version 4).")
        return psu_data


    def req_power(self):

        try:
            logging.info("Fetching power usage data(version4).")
            url = f"{self.base_url}/node/class/eqptPsu.json?&order-by=eqptPsu.modTs|desc"
            psu_response = self.session.get(url, verify=False)
            psu_response.raise_for_status()
            power_data = psu_response.json()
            processed_psu_data = self.process_reqPower(power_data)

            logging.info("Power usage data (version 4) fetched and processed successfully.")
            return processed_psu_data
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching power usage data: {e}")
            raise
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")
            raise
    def process_reqPower(self,power_data):
        psu_info_list = power_data.get('imdata', [])
        psu_data = {}

        for psu_info in psu_info_list:
            try:
                attributes = psu_info.get('eqptPsu', {}).get('attributes', {})
                dn = attributes.get('dn', 'N/A')
                logging.info(f"Processed data for dn: {dn}")
                node=re.search(r'node-(\d+)', dn).group(1) if re.search(r'node-(\d+)', dn) else 'N/A',
                if isinstance(node, tuple):
                    node = node[0]  # Extract the first element if node is a tuple
                parts = attributes.get('model').split('-')
                powerdata = ''.join(filter(str.isdigit, parts[2]))
                psu_data[dn] = {
                    'powerdata': powerdata,
                    'ps_health': attributes.get('psHealth',0),
                    'ps_id': attributes.get('psId', '0'),
                    'ps_manufacturer': attributes.get('vendor', '0'),
                    'ps_serial': attributes.get('ser', '0'),
                    'psu_value': int(re.search(r'psuslot-(\d+)', dn).group(1)) if re.search(r'psuslot-(\d+)', dn) else 'N/A',
                    'node_value': int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else 'N/A',
                    'apic_ipaddress': self.get_ipaddress(node),
                }
            except (AttributeError, ValueError) as e:
                logging.error(f"Error processing data for dn: {dn} - {e}")
            except Exception as e:
                logging.error(f"Unexpected error processing data for dn: {dn} - {e}")


        logging.info("Completed processing power data(version 5).")
        return psu_data



class Version5:
    def __init__(self, ipaddress, base_url, session):
        """
        Initialize the Version5 class.
        """
        self.ipaddress = ipaddress
        self.base_url = base_url
        self.session = session

    def powerusage(self):
        try:
            logging.info("Fetching power usage data(version 5).")
            url = f"{self.base_url}/node/class/piePsuPowerInfo.json?order-by=piePsuPowerInfo.modTs|desc"

            psu_response = self.session.get(url, verify=False)
            psu_response.raise_for_status()
            power_data = psu_response.json()
            processed_psu_data = self.process_data(power_data)

            logging.info("Power usage data (version 5) fetched and processed successfully.")
            return processed_psu_data
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching power usage data: {e}")
            raise
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")
            raise

    def process_data(self, power_data):

        psu_info_list = power_data.get('imdata', [])
        psu_data = {}

        for psu_info in psu_info_list:
            try:

                attributes = psu_info.get('piePsuPowerInfo', {}).get('attributes', {})
                dn = attributes.get('dn', 'N/A')
                psu_data[dn] = {
                    'pIn': float(attributes.get('pIn', '0')),
                    'pOut': float(attributes.get('pOut', '0')),
                    'fan_power': float(attributes.get('fanPower', '0')),
                    'power_domain': float(attributes.get('powerDomain', '0')),
                    'fanSpeed': float(attributes.get('fanSpeed', '0')),
                    'psu_value': int(re.search(r'psu-(\d+)', dn).group(1)) if re.search(r'psu-(\d+)', dn) else 'N/A',
                    'node_value': int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else 'N/A',
                    'pod_value': int(re.search(r'pod-(\d+)', dn).group(1)) if re.search(r'pod-(\d+)', dn) else 'N/A',
                    'apic_ipaddress': self.ipaddress
                }
                # print(psu_data)
                logging.info(f"Processed data for dn: {dn}")

            except (AttributeError, ValueError) as e:
                logging.error(f"Error processing data for dn: {dn} - {e}")
            except Exception as e:
                logging.error(f"Unexpected error processing data for dn: {dn} - {e}")

        logging.info("Completed processing power data(version 5).")
        return psu_data



    def req_power(self):
        try:
            logging.info("Fetching power usage data(version5).")
            url = f"{self.base_url}/node/class/piePsu.json?&order-by=piePsu.modTs|desc"
            psu_response = self.session.get(url, verify=False)
            psu_response.raise_for_status()

            power_data = psu_response.json()
            processed_psu_data = self.process_reqPower(power_data)
            # print(psu_response)
            logging.info("Power usage data (version 4) fetched and processed successfully.")
            return processed_psu_data
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching power usage data: {e}")
            raise
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")
            raise
    # def process_reqPower(self,power_data):
    #     psu_info_list = power_data.get('imdata', [])
    #     psu_data = {}
    #
    #     for psu_info in psu_info_list:
    #         try:
    #             attributes = psu_info.get('piePsu', {}).get('attributes', {})
    #             dn = attributes.get('dn', 'N/A')
    #
    #             parts = attributes.get('prodId').split('-')
    #             powerdata = ''.join(filter(str.isdigit, parts[2]))
    #
    #             psu_data[dn] = {
    #                 'psu_model':attributes.get('prodId'),
    #                 'powerdata': powerdata,
    #                 'ps_health': attributes.get('psHealth'),
    #                 'ps_id': attributes.get('psId', '0'),
    #                 'ps_manufacturer': attributes.get('psMfr', '0'),
    #                 'ps_serial': attributes.get('psSerial', '0'),
    #                 'psu_value': int(re.search(r'psu-(\d+)', dn).group(1)) if re.search(r'psu-(\d+)', dn) else 'N/A',
    #                 'node_value': int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else 'N/A',
    #                 'apic_ipaddress': self.ipaddress
    #             }
    #
    #
    #         except (AttributeError, ValueError) as e:
    #             logging.error(f"Error processing data for dn: {dn} - {e}")
    #         except Exception as e:
    #             logging.error(f"Unexpected error processing data for dn: {dn} - {e}")
    #
    #
    #     logging.info("Completed processing power data(version 5).")
    #     return psu_data


    def process_reqPower(self,power_data):
        psu_info_list = power_data.get('imdata', [])
        psu_data = {}
        node_psu_count = defaultdict(int)  # node_id -> count of PSUs

        for psu_info in psu_info_list:
            try:
                attributes = psu_info.get('piePsu', {}).get('attributes', {})
                dn = attributes.get('dn', 'N/A')
                prod_id = attributes.get('prodId', '')

                # Extract power rating digits from prodId (e.g. "NXA-PAC-1100W-PI2" -> 1100)
                parts = prod_id.split('-')
                powerdata = ''
                if len(parts) > 2:
                    powerdata = ''.join(filter(str.isdigit, parts[2]))

                # Extract PSU number from dn (e.g. "psu-0" -> 0)
                psu_value = int(re.search(r'psu-(\d+)', dn).group(1)) if re.search(r'psu-(\d+)', dn) else None

                # Extract node number from dn (e.g. "node-201" -> 201)
                node_value = int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else None

                # Increment count for this node
                if node_value is not None:
                    node_psu_count[node_value] += 1

                psu_data[dn] = {
                    'psu_model': prod_id,
                    'powerdata': int(powerdata) if powerdata else None,
                    'ps_health': attributes.get('psHealth'),
                    'ps_id': attributes.get('psId', '0'),
                    'ps_manufacturer': attributes.get('psMfr', ''),
                    'ps_serial': attributes.get('psSerial', ''),
                    'psu_value': psu_value,
                    'node_value': node_value,
                    'apic_ipaddress': self.ipaddress
                }
            except Exception as e:
                # Handle or log parsing error for this PSU entry
                print(f"Error parsing PSU entry: {e}")
        # print(psu_data, node_psu_count)

        return psu_data

    # Usage example
    # psu_data_dict, psu_counts_per_node = parse_psu_data(power_data, "10.10.10.10")
    # print("PSU counts per node:", psu_counts_per_node)
    # print("PSU details example:", next(iter(psu_data_dict.values())))




