from datetime import datetime
from typing import List
from app.repository.device_inventory_repository import DeviceInventoryRepository

from app.schema.device_inventory_schema import DeviceInventoryCreate, DeviceInventoryUpdate, DeviceInventoryInDB


class DeviceInventoryService:
    def __init__(self, device_inventory_repository: DeviceInventoryRepository):
        self.device_inventory_repository = device_inventory_repository

    def to_datetime(self, value):
        
        return datetime.combine(value, datetime.min.time()) if value else None

    # def get_all_devices(self) -> List[dict]:
    #
    #     devices = self.device_inventory_repository.get_all_devices()
    #
    #     enriched_devices = []
    #
    #     for device in devices:
    #
    #         enriched_device = {
    #             "id": device.get("id"),
    #             "cisco_domain": device.get("cisco_domain"),
    #             "contract_expiry": device.get("contract_expiry"),
    #             "contract_number": device.get("contract_number"),
    #             "created_at": device.get("created_at"),
    #             "criticality": device.get("criticality"),
    #             "department": device.get("department"),
    #             "device_id": device.get("device_id"),
    #             "device_name": device.get("device_name"),
    #             "device_ru": device.get("device_ru"),
    #             "domain": device.get("domain"),
    #             "hardware_version": device.get("hardware_version"),
    #             "hw_eol_date": device.get("hw_eol_date"),
    #             "hw_eos_date": device.get("hw_eos_date"),
    #             "item_code": device.get("item_code"),
    #             "item_desc": device.get("item_desc"),
    #             "manufacturer_date": device.get("manufacturer_date"),
    #             "manufacturer": device.get("manufacturer"),
    #             "modified_by": device.get("modified_by"),
    #             "parent": device.get("parent"),
    #             "patch_version": device.get("patch_version"),
    #             "pn_code": device.get("pn_code"),
    #             "site_id": device.get("site_id"),
    #             "rack_id": device.get("rack_id"),
    #             "rfs_date": device.get("rfs_date"),
    #             "section": device.get("section"),
    #             "serial_number": device.get("serial_number"),
    #             "software_version": device.get("software_version"),
    #             "source": device.get("source"),
    #             "stack": device.get("stack"),
    #             "status": device.get("status"),
    #             "sw_eol_date": device.get("sw_eol_date"),
    #             "sw_eos_date": device.get("sw_eos_date"),
    #             "tag_id": device.get("tag_id"),
    #             "apic_controller_id": device.get("apic_controller_id"),
    #
    #
    #             "hw_eol_ad": device.get("hw_eol_ad"),
    #             "hw_eos": device.get("hw_eos"),
    #             "sw_EoSWM": device.get("sw_EoSWM"),
    #             "hw_EoRFA": device.get("hw_EoRFA"),
    #             "sw_EoVSS": device.get("sw_EoVSS"),
    #             "hw_EoSCR": device.get("hw_EoSCR"),
    #             "hw_ldos": device.get("hw_ldos"),
    #
    #
    #             "site_name": device.get("site_name"),
    #             "rack_name": device.get("rack_name"),
    #             "device_ip": device.get("device_ip"),
    #             "device_type": device.get("device_type"),
    #
    #
    #             "power_utilization": device.get("power_utilization"),
    #             "pue": device.get("pue"),
    #             "power_input": device.get("power_input"),
    #             "datatraffic": device.get("datatraffic"),
    #         }
    #
    #
    #         if "datatraffic" in device:
    #             enriched_device["datatraffic"] = device["datatraffic"]
    #
    #         enriched_devices.append(enriched_device)
    #
    #     return enriched_devices
    from typing import List

    def get_all_devices(self, page) -> dict:


        devices = self.device_inventory_repository.get_all_devices(page)
        print("all devices",devices)
        print("type" ,type(devices))


        enriched_devices = []


        for device in devices['devices']:
            enriched_device = {
                "id": device.get("id"),
                "criticality": device.get("criticality"),
                "department": device.get("department"),
                "device_name": device.get("device_name"),
                "hardware_version": device.get("hardware_version"),
                "manufacturer_date": device.get("manufacturer_date"),
                "manufacturer": device.get("manufacturer"),
                "modified_by": device.get("modified_by"),
                "pn_code": device.get("pn_code"),
                "site_id": device.get("site_id"),
                "rack_id": device.get("rack_id"),
                "section": device.get("section"),
                "serial_number": device.get("serial_number"),
                "software_version": device.get("software_version"),
                "status": device.get("status"),
                "apic_controller_id": device.get("apic_controller_id"),
                "hw_eol_ad": device.get("hw_eol_ad"),
                "hw_eos": device.get("hw_eos"),
                "sw_EoSWM": device.get("sw_EoSWM"),
                "hw_EoRFA": device.get("hw_EoRFA"),
                "sw_EoVSS": device.get("sw_EoVSS"),
                "hw_EoSCR": device.get("hw_EoSCR"),
                "hw_ldos": device.get("hw_ldos"),
                "site_name": device.get("site_name"),
                "rack_name": device.get("rack_name"),
                "device_ip": device.get("device_ip"),
                "device_type": device.get("device_type"),
                "power_utilization": device.get("power_utilization"),
                "pue": device.get("pue"),
                "power_input": device.get("power_input"),
                "datatraffic": device.get("datatraffic"),
                "bandwidth_utilization": device.get("bandwidth_utilization") ,
                "power_output": device.get("power_output"),
                "carbon-emmison" : round(((device.get("power_input")/ 1000) * 0.4041) ,2),
                "pcr":round(device.get("power_input") / device.get("datatraffic"),2) if device.get("datatraffic") else None
            }

            enriched_devices.append(enriched_device)

        return {
            "page": devices['page'],
            "page_size": devices['page_size'],
            "total_devices": devices['total_devices'],
            "total_pages": devices['total_pages'],
            "devices": enriched_devices
        }

    def get_device_by_id(self, device_id: int) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.get_device_by_id(device_id)
        return DeviceInventoryInDB.from_orm(device)

    def create_device(self, device_data: DeviceInventoryCreate) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.add_device(device_data)
        return DeviceInventoryInDB.from_orm(device)

    def update_device(self, device_id: int, device_data: DeviceInventoryUpdate) -> DeviceInventoryInDB:
        device = self.device_inventory_repository.update_device(device_id, device_data)
        return DeviceInventoryInDB.from_orm(device)

    def delete_device(self, device_id: int) -> None:
        self.device_inventory_repository.delete_device(device_id)

    def get_device_inventory_with_power_utilization(self) -> List[DeviceInventoryInDB]:
        devices = self.device_inventory_repository.get_device_inventory_with_power_utilization()
        return [DeviceInventoryInDB.from_orm(device) for device in devices]
    
    def chasis(self):
        return self.device_inventory_repository.chasis()
    
    def modules(self):
        return self.device_inventory_repository.modules()
    
    def power_supply(self):
        return self.device_inventory_repository.power_supply()
    
    def fans(self):
        return self.device_inventory_repository.fans()
    
    def device_power(self, apic_api: str):
        return self.device_inventory_repository.device_power(apic_api)
    
    def get_spcific_devices(self, device_ip: str):
        return self.device_inventory_repository.get_spcific_devices(device_ip)

    def get_models(self,model_data):
        return self.device_inventory_repository.get_models_data(model_data)

    def get_device_type(self, model_data):
        return self.device_inventory_repository.get_device_type(model_data)

    def get_vendor(self,site_id,rack_id):
        return self.device_inventory_repository.get_vendors(site_id,rack_id)
    def get_count(self):
        return self.device_inventory_repository.get_count()
    def get_device_nature(self,model_data):
        return self.device_inventory_repository.get_device_natures(model_data)
    def get_vendor_count(self):
        return self.device_inventory_repository.get_vendor_device_count()

    def get_notifications(self,site):
        return self.device_inventory_repository.get_notifications(site)

    # def classify_performance(self,avg_energy_efficiency, avg_power_efficiency, avg_data_traffic, avg_pcr, avg_co2_emissions):
    #     score = 0
    #
    #     # **Energy Efficiency Score (Higher is better)**
    #     if avg_energy_efficiency >= 0.90:
    #         score += 2  # Good
    #     elif 0.80 <= avg_energy_efficiency < 0.90:
    #         score += 1  # Moderate
    #
    #     # **Power Efficiency Score (Lower is better, closer to 1 is ideal)**
    #     if avg_power_efficiency <= 1.10:
    #         score += 2  # Good
    #     elif 1.11 <= avg_power_efficiency <= 1.20:
    #         score += 1  # Moderate
    #
    #     # **Data Traffic Score (Higher is better)**
    #     if avg_data_traffic >= 2500:
    #         score += 2  # Good
    #     elif 1500 <= avg_data_traffic < 2500:
    #         score += 1  # Moderate
    #
    #     # **Power Consumption Ratio (PCR) Score (Lower is better)**
    #     if avg_pcr <= 1.5:
    #         score += 2  # Good
    #     elif 1.6 <= avg_pcr <= 2.5:
    #         score += 1  # Moderate
    #
    #     # **CO₂ Emissions Score (Lower is better)**
    #     if avg_co2_emissions <= 2.0:
    #         score += 2  # Good
    #     elif 2.01 <= avg_co2_emissions <= 3.0:
    #         score += 1  # Moderate
    #     else:
    #         score -= 1  # Minor penalty for CO₂ > 3.0 to prevent downgrading too much
    #
    #     # **Final Classification**
    #     if score >= 8:
    #         return score, "This device is highly efficient, demonstrating optimal power usage, low CO₂ emissions, and strong data performance."
    #     elif 5 <= score < 8:
    #         return score, "This device offers moderate efficiency, performing well in key areas but with some potential for optimization."
    #     else:
    #         return score, "This device has a lower efficiency and may require optimization to improve performance and resource utilization."

    def classify_performance(self, avg_energy_efficiency, avg_power_efficiency, avg_data_traffic, avg_pcr,
                             avg_co2_emissions, thresholds=None):
        if thresholds is None:
            # Default thresholds for different metrics
            thresholds = {
                "energy_efficiency": [0.80, 0.90],  # Moderate, Good
                "power_efficiency": [1.10, 1.20],  # Good, Moderate
                "data_traffic": [1500, 2500],  # Moderate, Good
                "pcr": [1.5, 2.5],  # Good, Moderate
                "co2_emissions": [2.0, 3.0]  # Good, Moderate
            }

        score = 0

        # **Energy Efficiency Score**
        if avg_energy_efficiency >= thresholds["energy_efficiency"][1]:
            score += 2
        elif thresholds["energy_efficiency"][0] <= avg_energy_efficiency < thresholds["energy_efficiency"][1]:
            score += 1

        # **Power Efficiency Score**
        if avg_power_efficiency <= thresholds["power_efficiency"][0]:
            score += 2
        elif thresholds["power_efficiency"][0] < avg_power_efficiency <= thresholds["power_efficiency"][1]:
            score += 1

        # **Data Traffic Score**
        if avg_data_traffic >= thresholds["data_traffic"][1]:
            score += 2
        elif thresholds["data_traffic"][0] <= avg_data_traffic < thresholds["data_traffic"][1]:
            score += 1

        # **Power Consumption Ratio (PCR) Score**
        if avg_pcr <= thresholds["pcr"][0]:
            score += 2
        elif thresholds["pcr"][0] < avg_pcr <= thresholds["pcr"][1]:
            score += 1

        # **CO₂ Emissions Score**
        if avg_co2_emissions <= thresholds["co2_emissions"][0]:
            score += 2
        elif thresholds["co2_emissions"][0] < avg_co2_emissions <= thresholds["co2_emissions"][1]:
            score += 1
        elif avg_co2_emissions > thresholds["co2_emissions"][1]:
            score -= 2

        # **Final Classification**
        if score >= 8:
            return score, "Highly efficient device with optimal power usage, low CO₂ emissions, and strong data performance."
        elif 5 <= score < 8:
            return score, "Moderate efficiency device with some areas for improvement."
        else:
            return score, "Low efficiency device that may require significant optimization."

    # def get_all_devices_test(self, filter_data) -> dict:
    #
    #     devices = self.device_inventory_repository.get_all_devices_test(filter_data)
    #     print("all devices", devices)
    #
    #     print("type", type(devices))
    #     # score=filter_data.score
    #
    #     enriched_devices = []
    #
    #     for device in devices['devices']:
    #         power_input = device.get("power_input") or 0
    #         power_output = device.get("power_output") or 0
    #         if  power_output > power_input:
    #             power_output=power_input
    #         power_utilization = device.get("power_utilization") or 0
    #         pue = device.get("pue") or 0
    #         datatraffic = device.get("datatraffic") or 0
    #         bandwidth_utilization = device.get("bandwidth_utilization") or 0
    #         bandwidth = device.get("bandwidth_gbps") or 0
    #
    #
    #         pcr = device.get("pcr") or 0
    #         carbon_emission=device.get("carbon_emission") or 0
    #         # Carbon Emissions Calculation
    #         # carbon_emission = round(((power_input / 1000) * 0.4041), 2)
    #
    #         # Power Consumption Ratio (PCR) Calculation
    #         # pcr = round(power_input *1000 / datatraffic, 4) if datatraffic else None
    #
    #         # Classify device performance and power consumption
    #         # performance_score, performance_description = self.classify_performance(
    #         #     power_utilization, pue, datatraffic, pcr or 0, carbon_emission
    #         # )
    #         enriched_device = {
    #             "id": device.get("id"),
    #             "criticality": device.get("criticality"),
    #             "department": device.get("department"),
    #             "device_name": device.get("device_name"),
    #             "hardware_version": device.get("hardware_version"),
    #             "manufacturer_date": device.get("manufacturer_date"),
    #             "manufacturer": device.get("manufacturer"),
    #             "modified_by": device.get("modified_by"),
    #             "pn_code": device.get("pn_code"),
    #             "site_id": device.get("site_id"),
    #             "rack_id": device.get("rack_id"),
    #             "section": device.get("section"),
    #             "stack":device.get('stack'),
    #             "total_power_capacity": device.get('total_power_capacity'),
    #             "psu_count": device.get('psu_count'),
    #             "psu_model": device.get('psu_model'),
    #             "serial_number": device.get("serial_number"),
    #             "software_version": device.get("software_version"),
    #             "status": device.get("status"),
    #             "apic_controller_id": device.get("apic_controller_id"),
    #             "hw_eol_ad": device.get("hw_eol_ad"),
    #             "hw_eos": device.get("hw_eos"),
    #             "sw_EoSWM": device.get("sw_EoSWM"),
    #             "hw_EoRFA": device.get("hw_EoRFA"),
    #             "sw_EoVSS": device.get("sw_EoVSS"),
    #             "hw_EoSCR": device.get("hw_EoSCR"),
    #             "hw_ldos": device.get("hw_ldos"),
    #             "site_name": device.get("site_name"),
    #             "rack_name": device.get("rack_name"),
    #             "device_ip": device.get("device_ip"),
    #             "device_type": device.get("device_type"),
    #             "power_utilization": power_utilization,
    #             "pue": pue,
    #             "power_input": power_input,
    #             "datatraffic": datatraffic,
    #             "bandwidth":bandwidth,
    #             "bandwidth_utilization": round(bandwidth_utilization,4),
    #             "power_output":power_output,
    #             "carbon-emmison": round(carbon_emission, 4),
    #             "pcr": pcr ,
    #             "score_num": device.get("performance_score"),
    #             "score_desc":device.get("performance_description"),
    #
    #         }
    #
    #         enriched_devices.append(enriched_device)
    #
    #     return {
    #         "page": devices['page'],
    #
    #         "page_size": devices['page_size'],
    #         "total_devices": devices['total_devices'],
    #         "total_pages": devices['total_pages'],
    #         "devices": enriched_devices
    #     }
    def get_all_devices_test(self, filter_data) -> dict:
        devices = self.device_inventory_repository.get_all_devices_test(filter_data)
        print("all devices")
        print("type", type(devices))

        enriched_devices = []

        for device in devices['devices']:
            # Convert numpy types to native Python types
            power_input = int(device.get("power_input") or 0) if hasattr(device.get("power_input"),
                                                                         '__int__') else device.get("power_input") or 0
            power_output = int(device.get("power_output") or 0) if hasattr(device.get("power_output"),
                                                                           '__int__') else device.get(
                "power_output") or 0
            if power_output > power_input:
                power_output = power_input

            power_utilization = float(device.get("power_utilization") or 0) if hasattr(device.get("power_utilization"),
                                                                                       '__float__') else device.get(
                "power_utilization") or 0
            pue = float(device.get("pue") or 0) if hasattr(device.get("pue"), '__float__') else device.get("pue") or 0
            datatraffic = float(device.get("datatraffic") or 0) if hasattr(device.get("datatraffic"),
                                                                           '__float__') else device.get(
                "datatraffic") or 0
            bandwidth_utilization = float(device.get("bandwidth_utilization") or 0) if hasattr(
                device.get("bandwidth_utilization"), '__float__') else device.get("bandwidth_utilization") or 0
            bandwidth = float(device.get("bandwidth_gbps") or 0) if hasattr(device.get("bandwidth_gbps"),
                                                                            '__float__') else device.get(
                "bandwidth_gbps") or 0

            pcr = float(device.get("pcr") or 0) if hasattr(device.get("pcr"), '__float__') else device.get("pcr") or 0
            carbon_emission = float(device.get("carbon_emission") or 0) if hasattr(device.get("carbon_emission"),
                                                                                   '__float__') else device.get(
                "carbon_emission") or 0

            enriched_device = {
                "id": device.get("id"),
                "criticality": device.get("criticality"),
                "department": device.get("department"),
                "device_name": device.get("device_name"),
                "hardware_version": device.get("hardware_version"),
                "manufacturer_date": device.get("manufacturer_date"),
                "manufacturer": device.get("manufacturer"),
                "modified_by": device.get("modified_by"),
                "pn_code": device.get("pn_code"),
                "site_id": device.get("site_id"),
                "rack_id": device.get("rack_id"),
                "section": device.get("section"),
                "serial_number": device.get("serial_number"),
                "software_version": device.get("software_version"),
                "status": device.get("status"),
                "apic_controller_id": device.get("apic_controller_id"),
                "hw_eol_ad": device.get("hw_eol_ad"),
                "hw_eos": device.get("hw_eos"),
                "sw_EoSWM": device.get("sw_EoSWM"),
                "hw_EoRFA": device.get("hw_EoRFA"),
                "sw_EoVSS": device.get("sw_EoVSS"),
                "hw_EoSCR": device.get("hw_EoSCR"),
                "hw_ldos": device.get("hw_ldos"),
                "site_name": device.get("site_name"),
                "rack_name": device.get("rack_name"),
                "device_ip": device.get("device_ip"),
                "device_type": device.get("device_type"),
                "power_utilization": power_utilization,
                "pue": pue,

                "power_input": power_input,
                "datatraffic": datatraffic,
                "power_output": power_output,
                "carbon-emmison": round(float(carbon_emission), 4) if carbon_emission is not None else 0,
                "pcr": pcr,
                "score_num": float(device.get("performance_score")) if hasattr(device.get("performance_score"),
                                                                               '__float__') else device.get(
                    "performance_score"),
                "score_desc": device.get("performance_description"),
            }
            enriched_devices.append(enriched_device)

        return {
            "page": devices['page'],

            "page_size": devices['page_size'],
            "total_devices": devices['total_devices'],
            "total_pages": devices['total_pages'],
            "devices": enriched_devices
        }
    def generate_excel(self,filter_data):
        return self.device_inventory_repository.generate_excel(filter_data)
    def get_hardware_versions(self):
        return self.device_inventory_repository.get_hardware_versions()
    def get_software_versions(self):
        return self.device_inventory_repository.get_software_versions()
    def add_vendor(self,vendor):
        return self.device_inventory_repository.add_vendor(vendor)
    def add_device_type(self,device_type):
        return self.device_inventory_repository.add_device_type(device_type)
    def generate_excel1(self,filter_data):
        return self.device_inventory_repository.generate_excel1(filter_data)