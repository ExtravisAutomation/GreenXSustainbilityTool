from contextlib import AbstractContextManager
from typing import Callable, List
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.repository.dataquery_repository import DataQueryRepository
from app.repository.site_repository import SiteRepository
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash
import logging
from app.model.APIC_controllers import APICControllers as Devices
from app.model.device_inventory import DeviceInventory
from app.model.rack import Rack
from app.model.site import Site

from app.schema.dashboard_schema import MetricsDetail

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DashboardRepository(object):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 dataquery_repository: DataQueryRepository,site_repository: SiteRepository,):
        self.session_factory = session_factory
        self.dataquery_repository = dataquery_repository
        self.site_repository = site_repository


    def get_devices_by_site_id(self, site_id: int) -> List[Devices]:
        with self.session_factory() as session:
            query = (
                session.query(
                    Devices.id.label('device_id'),
                    Devices.ip_address,
                    DeviceInventory.total_interface,
                    DeviceInventory.up_link,
                    DeviceInventory.down_link,
                    DeviceInventory.stack,
                    DeviceInventory.active_psu,
                    DeviceInventory.non_active_psu,
                )
                .join(DeviceInventory, DeviceInventory.device_id == Devices.id)
                .join(Site, DeviceInventory.site_id == Site.id)
                .join(Rack, DeviceInventory.rack_id == Rack.id)
                .filter(Devices.OnBoardingStatus == True)
                .filter(Devices.collection_status == True)
                .filter(DeviceInventory.pn_code.notlike('%IE%'))
                .filter(DeviceInventory.site_id == site_id)
            )
            # Execute the query
            results = query.all()
            if not results:
                logger.info(f"Fetching devices for site ID: {site_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No devices found for site {site_id}"
                )
            return results
    def calculate_eer(self,output_kw, input_kw):
        return round((output_kw / input_kw) * 100, 2) if input_kw and output_kw else 0.0

    def calculate_pue(self,input_kw, output_kw):
        return round(input_kw / output_kw, 3) if input_kw and output_kw else 0.0

    def calculate_utilization(self,consumed, allocated):
        return round((consumed / allocated) * 100, 6) if allocated else 0.0

    def calculate_pcr(self,input_kw, consumed_gb):
        return round(input_kw / consumed_gb, 4) if input_kw and consumed_gb else 0.0
    def calculate_cost_estimation(self,input_kw, cost_factor):
        return round((input_kw * cost_factor), 2)if input_kw else 0.0
    def calculate_traffic_throughput(self,consumed_gb, input_kw):
        return round(consumed_gb / input_kw, 4) if input_kw and consumed_gb else 0.0  # GB/W
    def calculate_emmision_kg(self,output_kw, default_emission):
        return round((output_kw * default_emission), 2) if output_kw else 0.0
    def get_metrics_info(self, payload):
        # Validate site_id and fetch device IPs
        try:

            if not payload.site_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Site ID is required."
                )
            logger.info(f"Fetching devices for site ID: {payload.site_id}")
            results = self.get_devices_by_site_id(payload.site_id)
            device_ips = [result.ip_address for result in results if result.ip_address]

            # Calculate totals
            total_devices = len({result.device_id for result in results})
            total_up_links = sum(result.up_link for result in results if result.up_link)
            total_down_links = sum(result.down_link for result in results if result.down_link)
            total_interfaces = total_up_links+total_down_links
            stacked = sum(result.stack == True for result in results if hasattr(result, 'stack'))
            unstacked = sum(result.stack == False for result in results if hasattr(result, 'stack'))
            total_active_psu = sum(result.active_psu for result in results if result.active_psu)
            total_in_active_psu = sum(result.non_active_psu for result in results if result.non_active_psu)

            if payload.duration:
                logger.info(f"Fetching power and traffic data for duration: {payload.duration}")

                metrics_data = self.dataquery_repository.get_power_traffic_data(
                    device_ips, payload.duration
                )
                if not metrics_data:
                    logger.warning("No metrics data returned from repository")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"No metrics data available for the given parameters"
                    )
                logger.info("Processing and aggregating metrics data")
                aggregated_data =self.get_aggregatted_data(metrics_data)
                stack_data={
                    "stacked":stacked,
                    "unstacked":unstacked,
                }
                psu_stats={
                    "active_psu":total_active_psu,
                    "non_active_psu":total_in_active_psu,
                }
                interface_stats={
                "total_up_links":total_up_links,
                "total_up_links" : total_up_links,
                "total_down_links" : total_down_links,
                "total_interface" : total_interfaces,
                "up_link_percentage" : round((total_up_links / total_interfaces) * 100, 2),
                "down_link_percentage" : round((total_down_links / total_interfaces) * 100, 2),
                }
                # Create MetricsDetail response
                response = MetricsDetail(
                    site_id=payload.site_id,
                    total_devices=total_devices,
                    total_up_links=total_up_links,
                    total_down_links=total_down_links,
                    total_interface=total_interfaces,
                    up_link_percentage=round((total_up_links/total_interfaces) * 100,2),
                    down_link_percentage=round((total_down_links/total_interfaces) * 100,2),
                    duration=payload.duration,
                    pue=aggregated_data.get('pue', 0.0),
                    eer_per=aggregated_data.get('eer', 0.0),
                    input_power_kw=aggregated_data.get('input_kw', 0.0),
                    output_power_kw=aggregated_data.get('output_kw', 0.0),
                    co_em_factor=aggregated_data.get('default_emission', 0.4041),
                    co2_em_kg=aggregated_data.get('carbon_emission_kg', 0.0),
                    co2_em_tons=aggregated_data.get('carbon_emission_tons', 0.0),
                    cost_factor=aggregated_data.get('default_cost', 0.37),
                    cost_unit="AED",
                    cost_estimation=aggregated_data.get('cost_estimation', 0.0),
                    datatraffic_allocated_gb=aggregated_data.get('traffic_allocated_gb', 0.0),
                    datatraffic_consumed_gb=aggregated_data.get('traffic_consumed_gb', 0.0),
                    total_input_bytes_gb=aggregated_data.get('total_input_bytes_gb', 0.0),
                    total_output_bytes_gb=aggregated_data.get('total_output_bytes_gb', 0.0),
                    datautilization_per=3.6 ,#aggregated_data.get('data_utilization', 0.0),
                    pcr_kw_per_gb=aggregated_data.get('pcr', 0.0),
                    traffic_throughput_gb_per_watt=aggregated_data.get('throughput', 0.0),
                    co2_flights_avoided=aggregated_data.get('co2_flights_avoided', 0.0),
                    co2_car_trip_km=aggregated_data.get('co2_car_trip_km', 0.0),
                    power_usage_percentage=aggregated_data.get('power_usage_percentage', 0.0),
                    stack_stats=stack_data,
                    psu_stats=psu_stats,
                    interface_stats=interface_stats
                )
                logger.info("Successfully generated Metrics Response")
                return response

        except Exception as e:
            logger.error(f"Error in get_metrics_info found: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}

    def get_aggregatted_data(self,metrics):
            # Extract base power values
        input_kw = metrics.get("total_PIn_kw")
        output_kw = metrics.get("total_POut_kw")
        days_count = metrics.get("day_count")
        # Convert traffic to GB
        traffic_allocated_gb = round((metrics.get("traffic_allocated_mb") or 0) / 1024, 2)
        total_input_bytes_gb = round((metrics.get("total_input_bytes") or 0) / (1024 ** 3), 2)
        total_output_bytes_gb = round((metrics.get("total_output_bytes") or 0) / (1024 ** 3), 2)
        traffic_consumed_gb = round(total_input_bytes_gb+total_output_bytes_gb, 2)

        default_cost = 0.37
        default_emission = 0.4041
        default_cost_unit = "AED"

        eer = self.calculate_eer(output_kw, input_kw)
        pue = self.calculate_pue(input_kw, output_kw)
        pcr = self.calculate_pcr(input_kw, traffic_consumed_gb)
        throughput = self.calculate_traffic_throughput(traffic_consumed_gb, input_kw)
        cost_estimation = self.calculate_cost_estimation(input_kw, default_cost)
        carbon_emission_kg=self.calculate_emmision_kg(output_kw, default_emission)
        carbon_emission_tons= round(carbon_emission_kg/1000,2) if carbon_emission_kg else 0
        data_utilization = self.calculate_utilization(traffic_consumed_gb, traffic_allocated_gb)
        # Calculate equivalents
        flights_avoided = round(carbon_emission_kg / 700 ,4) # NYC-Dubai flight equivalent
        car_trip_km = round(carbon_emission_kg / 0.25 ,4) # Petrol car km equivalent
        return {
            'input_kw': input_kw,
            'output_kw': output_kw,
            'traffic_consumed_gb': round(traffic_consumed_gb,2),
            'traffic_allocated_gb': round(traffic_allocated_gb,2),
            'total_input_bytes_gb': round(total_input_bytes_gb,2),
            'total_output_bytes_gb': round(total_output_bytes_gb,2),
            'eer': eer,
            'power_usage_percentage':round((output_kw / (input_kw+output_kw)) * 100, 2),
            'pue': pue,
            'pcr': pcr,
            'throughput': throughput,
            'cost_estimation': cost_estimation,
            'carbon_emission_kg': carbon_emission_kg,
            'carbon_emission_tons': carbon_emission_tons,
            'data_utilization': data_utilization,
            'default_cost': default_cost,
            'default_emission': default_emission,
            'co2_flights_avoided':flights_avoided,
            'co2_car_trip_km':car_trip_km

        }

    def get_energy_traffic_data_timeline(self,payload):
        try:
            if not payload.site_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Site ID is required."
                )
            logger.info(f"Fetching devices for site ID: {payload.site_id}")
            results = self.get_devices_by_site_id(payload.site_id)
            device_ips = [result.ip_address for result in results if result.ip_address]
            logger.info(f"Fetching device_ips: {device_ips}")

            if payload.duration:
                logger.info(f"Fetching power and traffic data for duration: {payload.duration}")

                metrics_data = self.dataquery_repository.get_cumulative_energy_traffic_timeline(
                    device_ips, payload.duration
                )
                print(metrics_data)
                print("Metrics data:")


                if not metrics_data:
                    logger.warning("No metrics data returned from repository")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"No metrics data available for the given parameters"
                    )
                metrics_data=self.get_time_wise_metrics(metrics_data)
                return metrics_data

        except Exception as e:
            logger.error(f"Error in get_metrics_info found: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}

    def get_time_wise_metrics(self,metrics_list):
        results = []
        for metrics in metrics_list:
            # Extract base power values

            input_kw = metrics.get("total_PIn_kw", 0)
            output_kw = metrics.get("total_POut_kw", 0)
            print(input_kw, output_kw)
            # Convert traffic to GB
            traffic_allocated_gb = round(metrics.get("traffic_allocated_mb", 0) / 1024,4)
            print(metrics.get("traffic_allocated_mb"))
            print(traffic_allocated_gb)
            total_input_bytes_gb = metrics.get("total_input_bytes", 0) / (1024 ** 3)
            total_output_bytes_gb = metrics.get("total_output_bytes", 0) / (1024 ** 3)
            traffic_consumed_gb = total_input_bytes_gb + total_output_bytes_gb

            default_cost = 0.37  # AED per kWh
            default_emission = 0.4041  # kg CO2 per kWh

            # Calculate metrics
            eer = output_kw / input_kw if input_kw else 0
            pue = input_kw / output_kw if output_kw else 0
            pcr = input_kw / traffic_consumed_gb if traffic_consumed_gb else 0
            throughput = traffic_consumed_gb / (input_kw * 24) if input_kw else 0  # GB/kW/day
            cost_estimation = input_kw * default_cost * 24  # Daily cost
            carbon_emission_kg = input_kw * default_emission * 24  # Daily emissions
            carbon_emission_tons = carbon_emission_kg / 1000
            data_utilization = (traffic_consumed_gb / traffic_allocated_gb) * 100 if traffic_allocated_gb else 0


            results.append({
                'time': metrics.get('time'),
                'input_kw': input_kw,
                'output_kw': output_kw,
                'traffic_consumed_gb': round(traffic_consumed_gb, 4),
                'traffic_allocated_gb': round(traffic_allocated_gb, 2),
                'eer': round(eer, 4),
                'pue': round(pue, 4),
                'pcr': round(pcr, 4),
                'throughput': round(throughput, 4),
                'cost_estimation': round(cost_estimation, 2),
                'carbon_emission_kg': round(carbon_emission_kg, 2),
                'carbon_emission_tons': round(carbon_emission_tons, 4),
                'data_utilization': round(data_utilization, 6),  # Very small percentage

            })
        return results

        # Usage example:




