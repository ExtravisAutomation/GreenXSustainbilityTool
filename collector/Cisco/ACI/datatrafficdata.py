import json
import logging
import requests
import re
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class APICAuthenticator:
    """Handles authentication with Cisco APIC"""

    def __init__(self, base_url: str, username: str, password: str):
        """
        Initialize APIC authenticator

        Args:
            base_url: Base URL of the APIC (e.g., "https://10.64.150.8/api")
            username: APIC username
            password: APIC password
        """
        self.base_url = base_url
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.token = None
        self.error_message=''


    def login(self) -> bool:
        """Authenticate with APIC and get session token"""
        login_url = f"{self.base_url}/aaaLogin.json"
        auth_data = {
            "aaaUser": {
                "attributes": {
                    "name": self.username,
                    "pwd": self.password
                }
            }
        }

        try:
            response = self.session.post(
                login_url,
                json=auth_data,
                verify=False,  # In production, use proper certificate verification
                timeout=10
            )
            response.raise_for_status()

            # Extract token from response
            self.token = response.json()['imdata'][0]['aaaLogin']['attributes']['token']

            # Set cookie for subsequent requests
            self.session.cookies.update({'APIC-cookie': self.token})

            logger.info("Successfully authenticated with APIC")
            return True

        except requests.exceptions.RequestException as e:
            logger.error(f"Authentication failed: {e}")
            raise Exception(f"Authentication failed: {e}") from e


class DataTraffic:
    """Collects and processes data from Cisco APIC"""

    def __init__(self,ip_address, base_url: str, session: requests.Session):
        """
        Initialize data collector

        Args:
            base_url: Base URL of the APIC
            session: Authenticated session
        """
        self.base_url = base_url
        self.error_message=''
        self.session = session
        self.get_ipaddress_Response = self.get_mgmtRsOoBStNode_response()

    def get_mgmtRsOoBStNode_response(self):
        """
        Get management out-of-band state node response.
        """
        url = f"{self.base_url}/node/class/mgmtRsOoBStNode.json?&order-by=mgmtRsOoBStNode.modTs|desc"
        # url = f"{self.base_url}{path}"
        try:
            response = self.session.get(url, verify=False)
            response.raise_for_status()
            imdata = response.json()["imdata"]
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

    def get_traffic_data(self) -> Dict[str, Dict[str, Any]]:

        try:
            # Get both ingress and egress traffic data
            egress_data = self._get_traffic_data("eqptEgrTotal1h.json")
            ingress_data = self._get_traffic_data("eqptIngrTotal1h.json")

            # Aggregate data
            aggregated_data = self._aggregate_traffic_data(egress_data, ingress_data)
            print(aggregated_data)

            # Save to database (simulated)

            print("aggregated_data")

            return self.error_message,aggregated_data

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching traffic data: {e}")
            raise Exception(f"Failed to get traffic data: {e}") from e

    def _get_traffic_data(self, endpoint: str) -> Dict[str, Dict[str, Any]]:
        """Fetch traffic data for specific endpoint"""
        url = f"{self.base_url}/node/class/{endpoint}"

        try:
            response = self.session.get(
                url,
                verify=False,  # In production, use proper certificate verification
                timeout=10
            )
            response.raise_for_status()
            traffic_data = response.json()
            filename = f"{endpoint}.txt"
            with open(filename, "w") as f:
                f.write(json.dumps(traffic_data, indent=2))
            return self._process_traffic_data(traffic_data)


        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {endpoint}: {e}")
            raise

    def _process_traffic_data(self, raw_data: Dict) -> Dict[str, Dict[str, Any]]:
        """Process raw traffic data into structured format"""
        processed_data = {}

        for item in raw_data.get('imdata', []):
            attributes = list(item.values())[0].get('attributes', {})
            dn = attributes.get('dn', 'N/A')

            # Extract node ID from DN
            node_match = re.search(r'node-(\d+)', dn)
            node_id = node_match.group(1) if node_match else 'N/A'

            processed_data[dn] = {
                'bytesLast': attributes.get('bytesLast', 0),
                'bytesRateLast': attributes.get('bytesRateLast', 0),
                'pktsLast': attributes.get('pktsLast', 0),
                'pktsRateLast': attributes.get('pktsRateLast', 0),
                'node_value': int(node_id) if node_id.isdigit() else node_id,
                'apic_ipaddress': self.get_ipaddress_Response.get(node_id, "Node not found"),
            }


        # print(processed_data)
        # print("ldzflsgkl")
        return processed_data



    # def _aggregate_traffic_data(self, *data_sets: Dict) -> Dict[str, Dict[str, Any]]:
    #     """Aggregate multiple traffic data sets"""
    #     aggregated = {}
    #     for data in data_sets:
    #         for dn, metrics in data.items():
    #             node_id = metrics['node_value']
    #
    #             if node_id not in aggregated:
    #                 aggregated[node_id] = {
    #                     'node_value': node_id,
    #                     'ip': metrics['apic_ipaddress'],
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 }
    #
    #             # Sum all metrics
    #             aggregated[node_id]['bytesLast'] += float(metrics['bytesLast'])
    #             aggregated[node_id]['bytesRateLast'] += float(metrics['bytesRateLast'])
    #             aggregated[node_id]['pktsLast'] += float(metrics['pktsLast'])
    #             aggregated[node_id]['pktsRateLast'] += float(metrics['pktsRateLast'])
    #
    #     return aggregated

    def _aggregate_traffic_data(self, egress_data: Dict, ingress_data: Dict) -> Dict[str, Dict[str, Any]]:
        """Aggregate traffic data with separate ingress/egress totals and combined metrics"""
        aggregated = {}

        # Process egress data (output)
        for dn, metrics in egress_data.items():
            node_id = metrics['node_value']

            if node_id not in aggregated:
                aggregated[node_id] = {
                    'node_value': node_id,
                    'ip': metrics['apic_ipaddress'],
                    'bytesLast': 0,  # total bytes (input + output)
                    'total_input_bytes': 0,  # ingress bytes
                    'total_output_bytes': 0,  # egress bytes
                    'bytesRateLast': 0,  # sum of input_rate + output_rate
                    'pktsLast': 0,
                    'pktsRateLast': 0,  # sum of input_pkt_rate + output_pkt_rate
                    'input_bytes_rate': 0,  # ingress rate (from ingress_data)
                    'output_bytes_rate': 0,  # egress rate (from egress_data)
                }
            # Store egress (output) metrics
            aggregated[node_id]['total_output_bytes'] = float(metrics['bytesLast'])
            aggregated[node_id]['output_bytes_rate'] = float(metrics['bytesRateLast'])

            # Sum rates (will add ingress later)
            aggregated[node_id]['bytesRateLast'] += float(metrics['bytesRateLast'])
            aggregated[node_id]['pktsRateLast'] += float(metrics['pktsRateLast'])

        # Process ingress data (input)
        for dn, metrics in ingress_data.items():
            node_id = metrics['node_value']

            if node_id not in aggregated:
                aggregated[node_id] = {
                    'node_value': node_id,
                    'ip': metrics['apic_ipaddress'],
                    'bytesLast': 0,
                    'total_input_bytes': 0,
                    'total_output_bytes': 0,
                    'bytesRateLast': 0,
                    'pktsLast': 0,
                    'pktsRateLast': 0,
                    'input_bytes_rate': 0,
                    'output_bytes_rate': 0,
                }

            # Store ingress (input) metrics
            aggregated[node_id]['total_input_bytes'] = float(metrics['bytesLast'])
            aggregated[node_id]['input_bytes_rate'] = float(metrics['bytesRateLast'])

            # Sum rates (adds to egress rates if they exist)
            aggregated[node_id]['bytesLast'] += float(metrics['bytesRateLast'])
            aggregated[node_id]['pktsRateLast'] += float(metrics['pktsRateLast'])

            # Calculate total bytes (input + output)
            aggregated[node_id]['bytesRateLast'] = (
                    aggregated[node_id]['total_input_bytes'] +
                    aggregated[node_id]['total_output_bytes']
            )

        return aggregated
    # def _aggregate_traffic_data(self, egress_data: Dict, ingress_data: Dict) -> Dict[str, Dict[str, Any]]:
    #     """Aggregate traffic data keeping separate ingress/egress metrics and their sums"""
    #     aggregated = {}
    #
    #     # Process egress data
    #     for dn, metrics in egress_data.items():
    #         node_id = metrics['node_value']
    #
    #         if node_id not in aggregated:
    #             aggregated[node_id] = {
    #                 'node_value': node_id,
    #                 'ip': metrics['apic_ipaddress'],
    #                 'egress': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 },
    #                 'ingress': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 },
    #                 'total': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 }
    #             }
    #
    #         # Add egress metrics
    #         aggregated[node_id]['egress']['bytesLast'] = float(metrics['bytesLast'])
    #         aggregated[node_id]['egress']['bytesRateLast'] = float(metrics['bytesRateLast'])
    #         aggregated[node_id]['egress']['pktsLast'] = float(metrics['pktsLast'])
    #         aggregated[node_id]['egress']['pktsRateLast'] = float(metrics['pktsRateLast'])
    #
    #         # Add to totals
    #         aggregated[node_id]['total']['bytesLast'] += float(metrics['bytesLast'])
    #         aggregated[node_id]['total']['bytesRateLast'] += float(metrics['bytesRateLast'])
    #         aggregated[node_id]['total']['pktsLast'] += float(metrics['pktsLast'])
    #         aggregated[node_id]['total']['pktsRateLast'] += float(metrics['pktsRateLast'])
    #
    #     # Process ingress data
    #     for dn, metrics in ingress_data.items():
    #         node_id = metrics['node_value']
    #
    #         if node_id not in aggregated:
    #             aggregated[node_id] = {
    #                 'node_value': node_id,
    #                 'ip': metrics['apic_ipaddress'],
    #                 'egress': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 },
    #                 'ingress': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 },
    #                 'total': {
    #                     'bytesLast': 0,
    #                     'bytesRateLast': 0,
    #                     'pktsLast': 0,
    #                     'pktsRateLast': 0,
    #                 }
    #             }
    #
    #         # Add ingress metrics
    #         aggregated[node_id]['ingress']['bytesLast'] = float(metrics['bytesLast'])
    #         aggregated[node_id]['ingress']['bytesRateLast'] = float(metrics['bytesRateLast'])
    #         aggregated[node_id]['ingress']['pktsLast'] = float(metrics['pktsLast'])
    #         aggregated[node_id]['ingress']['pktsRateLast'] = float(metrics['pktsRateLast'])
    #
    #         # Add to totals
    #         aggregated[node_id]['total']['bytesLast'] += float(metrics['bytesLast'])
    #         aggregated[node_id]['total']['bytesRateLast'] += float(metrics['bytesRateLast'])
    #         aggregated[node_id]['total']['pktsLast'] += float(metrics['pktsLast'])
    #         aggregated[node_id]['total']['pktsRateLast'] += float(metrics['pktsRateLast'])
    #
    #     return aggregated