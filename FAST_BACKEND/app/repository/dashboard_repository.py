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
                    DeviceInventory.down_link

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
        return round((consumed / allocated) * 100, 4) if allocated else 0.0

    def calculate_pcr(self,input_kw, consumed_gb):
        return round(input_kw / consumed_gb, 4) if input_kw and consumed_gb else 0.0
    def calculate_cost_estimation(self,input_kw, cost_factor):
        return round((input_kw * cost_factor), 2)if input_kw else 0.0
    def calculate_traffic_throughput(self,consumed_gb, input_kw):
        return round(consumed_gb / input_kw, 4) if input_kw and consumed_gb else 0.0  # GB/W
    def calculate_emmision_kg(self,output_kw, default_emission):
        return round((output_kw * default_emission), 2) if output_kw else 0.0
    def get_metrics_info(self, metrics):
        # Validate site_id and fetch device IPs
        try:

            if not metrics.site_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Site ID is required."
                )
            logger.info(f"Fetching devices for site ID: {metrics.site_id}")
            results = self.get_devices_by_site_id(metrics.site_id)
            device_ips = [result.ip_address for result in results if result.ip_address]

            # Calculate totals
            total_devices = len({result.device_id for result in results})
            total_up_links = sum(result.up_link for result in results if result.up_link)
            total_down_links = sum(result.down_link for result in results if result.down_link)
            total_interfaces = total_up_links+total_down_links


            if metrics.duration:
                logger.info(f"Fetching power and traffic data for duration: {metrics.duration}")

                metrics_data = self.dataquery_repository.get_power_traffic_data(
                    device_ips, metrics.duration
                )
                if not metrics_data:
                    logger.warning("No metrics data returned from repository")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"No metrics data available for the given parameters"
                    )
                logger.info("Processing and aggregating metrics data")
                aggregated_data =self.get_aggregatted_data(metrics_data)
                # Create MetricsDetail response
                response = MetricsDetail(
                    site_id=metrics.site_id,
                    total_devices=total_devices,
                    total_up_links=total_up_links,
                    total_down_links=total_down_links,
                    duration=metrics.duration,
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
                    datautilization_per=aggregated_data.get('data_utilization', 0.0),
                    pcr_kw_per_gb=aggregated_data.get('pcr', 0.0),
                    traffic_throughput_gb_per_watt=aggregated_data.get('throughput', 0.0),
                    co2_flights_avoided=aggregated_data.get('co2_flights_avoided', 0.0),
                    co2_car_trip_km=aggregated_data.get('co2_car_trip_km', 0.0),

                )
                logger.info("Successfully generated metrics response")
                return response

        except Exception as e:
            logger.error(f"Error in get_metrics_info: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}

    def get_aggregatted_data(self,metrics):
            # Extract base power values
        input_kw = metrics.get("total_PIn_kw")
        output_kw = metrics.get("total_POut_kw")
        days_count = metrics.get("day_count")
        # Convert traffic to GB
        traffic_consumed_gb = round((metrics.get("traffic_consumed_mb") or 0) / 1024, 2)
        traffic_allocated_gb = round((metrics.get("total_traffic__mb") or 0) / 1024, 2)

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
            'traffic_consumed_gb': traffic_consumed_gb,
            'traffic_allocated_gb': traffic_allocated_gb,
            'eer': eer,
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




