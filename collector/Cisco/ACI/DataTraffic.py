import logging

import requests

import re

class DataTraffic:
    def __init__(self, ipaddress, base_url, session):
        """
        Initialize the Version4 class.
        """
        self.ipaddress = ipaddress
        self.base_url = base_url
        self.session = session
        self.get_ipaddress_Response = self.get_mgmtRsOoBStNode_response()

    def Data_traffic(self):
        try:
            url = f"{self.base_url}/node/class/eqptEgrTotal1h.json"
            traffic_response = self.session.get(url, verify=False)
            traffic_response.raise_for_status()
            traffic_data = traffic_response.json()
            processed_traffic_data = self.process_data(traffic_data)
            return processed_traffic_data
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching data traffic: {e}")
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
    def process_data(self, traffic_data):
        dataTraffic_info_list = traffic_data.get('imdata', [])
        dataTraffic_data = {}
        # self.store_data_in_influx(dataTraffic_info_list,api)
        for dataTraffic_info in dataTraffic_info_list:
            attributes = dataTraffic_info.get('eqptEgrTotal1h', {}).get('attributes', {})
            dn = attributes.get('dn', 'N/A')
            node = re.search(r'node-(\d+)', dn).group(1) if re.search(r'node-(\d+)', dn) else 'N/A',

            if isinstance(node, tuple):
                node = node[0]  # Extract the first element if node is a tuple
            # Set the measurement name to "datatrafic_Ingr"
            dataTraffic_data[dn] = {
                'bytesLast': attributes.get('bytesLast', '0'),
                'bytesRateLast': attributes.get('bytesRateLast', '0'),
                'pktsLast': attributes.get('pktsLast', '0'),
                'pktsRateLast': attributes.get('pktsRateLast', '0'),
                'node_value': int(re.search(r'node-(\d+)', dn).group(1)) if re.search(r'node-(\d+)', dn) else 'N/A',
                'apic_ipaddress': self.get_ipaddress(node),
            }
        return dataTraffic_data
