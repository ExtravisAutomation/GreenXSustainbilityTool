from contextlib import AbstractContextManager
from typing import Callable, List, Optional
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.repository.dataquery_repository import DataQueryRepository
from app.repository.site_repository import SiteRepository
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash
import logging
from app.model.devices import   Devices
from app.model.device_inventory import DeviceInventory
from app.model.rack import Rack
from app.model.site import Site

from app.schema.dashboard_schema import MetricsDetail


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from concurrent.futures import ThreadPoolExecutor, as_completed
class DashboardRepository(object):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 dataquery_repository: DataQueryRepository,site_repository: SiteRepository,):
        self.session_factory = session_factory
        self.dataquery_repository = dataquery_repository
        self.site_repository = site_repository
        self.default_cost = 0.32
        self.default_emission = 0.4041
        self.default_cost_unit = "AED"



    def get_devices_inventory(
            self,
            site_id: Optional[int] = None,
            rack_id: Optional[int] = None,
            device_id: Optional[int] = None,
            ip_address: Optional[str] = None
    ) -> List[dict]:
        with self.session_factory() as session:
            query = (
                session.query(
                    Devices.id.label('device_id'),
                    Devices.ip_address,
                    Devices.device_name,
                    Devices.rack_id,
                    Devices.vendor_id,
                    Site.site_name,
                    Rack.rack_name,
                    DeviceInventory.pn_code
                )
                .join(DeviceInventory, DeviceInventory.device_id == Devices.id)
                .join(Site, Devices.site_id == Site.id)
                .join(Rack, Devices.rack_id == Rack.id)
                .filter(Devices.OnBoardingStatus == True)
                .filter(Devices.collection_status == True)
                .filter(DeviceInventory.pn_code.notlike('%IE%'))
            )
            # Optional filters
            if site_id is not None:
                query = query.filter(Devices.site_id == site_id)
            if rack_id is not None:
                query = query.filter(Devices.rack_id == rack_id)
            if device_id is not None:
                query = query.filter(Devices.id == device_id)
            if ip_address is not None:
                query = query.filter(Devices.ip_address == ip_address)

            results = query.first()
            print(results,"wefkjkfdddddddddddddddddddddddddddddddddddddddddd")

            if not results:
                logger.info(
                    f"No devices found for given filters: site_id={site_id}, rack_id={rack_id}, device_id={device_id}, ip_address={ip_address}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No devices found for given filter(s)"
                )

            # Return as list of dicts
            return results

    def get_device(self,ip_address: Optional[str] = None,device_id: Optional[int] = None) ->Devices:
        print("tell here Everything is fine")
        if not ip_address and not device_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either 'ip_address' or 'device_id' must be provided."
            )
        with self.session_factory() as session:
            query = session.query(
                Devices.id,
                Devices.ip_address,
                Devices.device_name,
                Devices.rack_id,
                Devices.site_id,
            )
            if ip_address:
                query = query.filter(Devices.ip_address == ip_address)
            elif device_id:
                query = query.filter(Devices.id == device_id)
            result = query.first()
            if not result:
                identifier = ip_address or device_id
                logger.info(f"No device found for identifier: {identifier}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No device found for given identifier: {identifier}"
                )
            logger.info(f"Devices Data: {result}")
            return result
    def get_devices_by_site_id(self, site_id: int) -> List[Devices]:
        with self.session_factory() as session:
            query = (
                session.query(
                    Devices.id.label('device_id'),
                    Devices.ip_address,
                    Devices.device_name,
                    DeviceInventory.total_interface,
                    DeviceInventory.up_link,
                    DeviceInventory.down_link,
                    DeviceInventory.stack,
                    Devices.rack_id,
                    Devices.vendor_id,
                    DeviceInventory.active_psu,
                    DeviceInventory.non_active_psu,
                )
                .join(DeviceInventory, DeviceInventory.device_id == Devices.id)
                .join(Site, Devices.site_id == Site.id)
                .join(Rack, Devices.rack_id == Rack.id)
                .filter(Devices.OnBoardingStatus == True)
                .filter(Devices.collection_status == True)
                .filter(DeviceInventory.pn_code.notlike('%IE%'))
                .filter(Devices.site_id == site_id)
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

            distinct_rack_ids = set([row.rack_id for row in results])

            rack_count = len(distinct_rack_ids)
            distinct_vendor_ids = set([row.vendor_id for row in results])
            vendor_count = len(distinct_vendor_ids)

            # Calculate totals
            total_devices = len({result.device_id for result in results})
            total_rack=rack_count
            total_vendor=vendor_count

            total_up_links = sum(result.up_link for result in results if result.up_link)
            total_down_links = sum(result.down_link for result in results if result.down_link)
            total_interfaces = total_up_links+total_down_links
            stacked = sum(result.stack == True for result in results if hasattr(result, 'stack'))
            unstacked = sum(result.stack == False for result in results if hasattr(result, 'stack'))
            total_active_psu = sum(result.active_psu for result in results if result.active_psu)
            total_in_active_psu = sum(result.non_active_psu for result in results if result.non_active_psu)

            if payload.duration:
                logger.info(f"Fetching power and traffic data for duration: {payload.duration}")

                metrics_data = self.dataquery_repository.get_cumulative_power_traffic_data(
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
                    total_rack=total_rack,
                    total_vendor=total_vendor,
                    pue=aggregated_data.get('pue', 0.0),
                    eer_per=aggregated_data.get('eer', 0.0),
                    input_power_kw=aggregated_data.get('input_kw', 0.0),
                    output_power_kw=aggregated_data.get('output_kw', 0.0),
                    co_em_factor=aggregated_data.get('default_emission', 0.4041),
                    co2_em_kg=aggregated_data.get('carbon_emission_kg', 0.0),
                    co2_em_tons=aggregated_data.get('carbon_emission_tons', 0.0),
                    cost_factor=aggregated_data.get('default_cost', 0.32),
                    cost_unit="AED",
                    cost_estimation=aggregated_data.get('cost_estimation', 0.0),
                    datatraffic_allocated_gb=aggregated_data.get('traffic_allocated_gb', 0.0),
                    datatraffic_consumed_gb=aggregated_data.get('traffic_consumed_gb', 0.0),
                    total_input_bytes_gb=aggregated_data.get('total_input_bytes_gb', 0.0),
                    total_output_bytes_gb=aggregated_data.get('total_output_bytes_gb', 0.0),
                    datautilization_per=aggregated_data.get('data_utilization', 0.0),
                    pcr_kw_per_gb=aggregated_data.get('pcr', 0.0),
                    traffic_throughput_kw_per_gb=aggregated_data.get('throughput', 0.0),
                    co2_flights_avoided=aggregated_data.get('co2_flights_avoided', 0.0),
                    co2_car_trip_km=aggregated_data.get('co2_car_trip_km', 0.0),
                    power_usage_percentage=aggregated_data.get('power_usage_percentage', 0.0),
                    stack_stats=stack_data,
                    psu_stats=psu_stats,
                    interface_stats=interface_stats,
                    cost_analysis=aggregated_data.get('cost_analysis',{}),
                    c02_emmision_analysis=aggregated_data.get('c02_emmision_analysis',{}),

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
        # traffic_allocated_gb = round((metrics.get("traffic_allocated_mb") or 0) / 1024, 2)
        total_input_bytes_gb = round((metrics.get("total_input_bytes") or 0) / (1024 ** 3), 2)
        total_output_bytes_gb = round((metrics.get("total_output_bytes") or 0) / (1024 ** 3), 2)
        traffic_consumed_gb = round(total_input_bytes_gb+total_output_bytes_gb, 2)
        traffic_allocated_gb = 10

        eer = self.calculate_eer(output_kw, input_kw)
        pue = self.calculate_pue(input_kw, output_kw)
        pcr = self.calculate_pcr(input_kw, traffic_consumed_gb)
        throughput = self.calculate_traffic_throughput(traffic_consumed_gb, input_kw)
        cost_estimation = self.calculate_cost_estimation(input_kw, self.default_cost)
        carbon_emission_kg=self.calculate_emmision_kg(output_kw, self.default_emission)
        carbon_emission_tons= round(carbon_emission_kg/1000,2) if carbon_emission_kg else 0
        data_utilization = self.calculate_utilization(traffic_consumed_gb, traffic_allocated_gb)
        # Calculate equivalents
        flights_avoided = round(carbon_emission_kg / 700 ,4) # NYC-Dubai flight equivalent
        car_trip_km = round(carbon_emission_kg / 0.25 ,4) # Petrol car km equivalent
        cost_analysis,c02_emmision_analysis=self.get_cost_co2_analysis(metrics.get('day_count'), input_kw, output_kw)
        print(type(c02_emmision_analysis))
        print(type(cost_analysis))
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
            'default_cost': self.default_cost,
            'default_emission': self.default_emission,
            'co2_flights_avoided':flights_avoided,
            'co2_car_trip_km':car_trip_km,
            'cost_analysis':cost_analysis,
            'c02_emmision_analysis':c02_emmision_analysis,
        }
    def get_cost_co2_analysis(self,days_count,input_kw,output_kw):
        daily_input_value = input_kw / days_count
        daily_output_value = output_kw / days_count
        cost_estimation_daily = self.calculate_cost_estimation(daily_input_value, self.default_cost)
        cost_estimation_monthly = self.calculate_cost_estimation(daily_input_value*30, self.default_cost)
        cost_estimation_yearly = self.calculate_cost_estimation(daily_input_value *365, self.default_cost)
        cost_estimation_five_year = self.calculate_cost_estimation(daily_input_value * 365*5, self.default_cost)

        co2_estimation_daily_kg = self.calculate_emmision_kg(daily_output_value, self.default_emission)
        co2_estimation_monthly_kg = self.calculate_emmision_kg(daily_output_value * 30, self.default_emission)
        co2_estimation_yearly_kg = self.calculate_emmision_kg(daily_output_value * 365, self.default_emission)
        co2_estimation_five_year_kg = self.calculate_emmision_kg(daily_output_value * 365*5, self.default_emission)

        cost_analysis={
            "cost_estimation_daily": cost_estimation_daily,
            "cost_estimation_monthly": cost_estimation_monthly,
            "cost_estimation_yearly":cost_estimation_yearly,
            "cost_estimation_five_year":cost_estimation_five_year
        }
        c02emmision_analysis={
            "co2_kgs":
                {"co2_estimation_daily_kg": co2_estimation_daily_kg,
            "co2_estimation_monthly_kg": co2_estimation_monthly_kg,
            "co2_estimation_yearly_kg": co2_estimation_yearly_kg,
            "co2_estimation_five_year_kg":co2_estimation_five_year_kg
                 },
            "co2_tons":{
            "co2_estimation_daily_tons": co2_estimation_daily_kg/1000,
            "co2_estimation_monthly_tons": co2_estimation_monthly_kg/1000,
            "co2_estimation_yearly_tons": co2_estimation_yearly_kg/1000,
            "co2_estimation_five_year_tons": co2_estimation_five_year_kg/1000,}
        }
        print(cost_analysis,c02emmision_analysis)
        print(type(c02emmision_analysis))
        print(type(cost_analysis))
        return cost_analysis,c02emmision_analysis


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

    def compute_metrics(self,metrics):
        input_kw = metrics.get("total_PIn_kw", 0)
        output_kw = metrics.get("total_POut_kw", 0)
        # Fixed value or replace with metrics.get("traffic_allocated_mb", 0) / 1024 if dynamic
        traffic_allocated_gb = 10
        total_input_bytes_gb = metrics.get("total_input_bytes", 0) / (1024 ** 3)
        total_output_bytes_gb = metrics.get("total_output_bytes", 0) / (1024 ** 3)
        traffic_consumed_gb = total_input_bytes_gb + total_output_bytes_gb

        eer = self.calculate_eer(output_kw, input_kw)
        pue = self.calculate_pue(input_kw, output_kw)
        pcr = self.calculate_pcr(input_kw, traffic_consumed_gb)
        throughput = self.calculate_traffic_throughput(traffic_consumed_gb, input_kw)
        cost_estimation = self.calculate_cost_estimation(input_kw, self.default_cost)
        carbon_emission_kg = self.calculate_emmision_kg(output_kw, self.default_emission)
        carbon_emission_tons = round(carbon_emission_kg / 1000, 2) if carbon_emission_kg else 0
        data_utilization = self.calculate_utilization(traffic_consumed_gb, traffic_allocated_gb)

        return {
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
            'data_utilization': round(data_utilization, 6),
        }

    def get_time_wise_metrics(self, metrics_list):

        results = []
        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = [executor.submit(self.compute_metrics, m) for m in metrics_list]
            for future in as_completed(futures):
                results.append(future.result())

        # Optionally sort by time if needed
        results.sort(key=lambda x: x['time'])
        return results

        # Usage example:
    def get_peak_low_devices(self,payload):
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
                devices_data = self.dataquery_repository.get_device_wise_power_traffic_data(
                    device_ips, payload.duration
                )
                top5_power_output= sorted(devices_data, key=lambda x: x["total_POut_kw"], reverse=True)[:5]

                top5_power_input = sorted(devices_data, key=lambda x: x["total_PIn_kw"], reverse=True)[:5]

                final_mertric_response=[]
                with ThreadPoolExecutor(max_workers=8) as executor:
                    futures = [executor.submit(self.compute_power_traffic_metrics_per_devices, m) for m in devices_data]
                    for future in as_completed(futures):
                        final_mertric_response.append(future.result())
                # with ThreadPoolExecutor(max_workers=8) as executor:
                #     futures = [executor.submit(self.compute_power_traffic_metrics_per_devices, m) for m in top5_power_input]
                #     for future in as_completed(futures):
                #         top_cost_devices.append(future.result())

                # print(top_cost_devices,top_carbon_emmision)
                result=self.response_detail(final_mertric_response)




                return result
        except Exception as e:
            logger.error(f"Error in get_metrics_info found: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}


    def compute_power_traffic_metrics_per_devices(self,metrics):
        input_kw = metrics.get("total_PIn_kw", 0)
        output_kw = metrics.get("total_POut_kw", 0)
        ip_address=metrics.get("ip", 0)
        device_data=self.get_device(ip_address=ip_address)
        total_input_bytes_gb = round((metrics.get("total_input_bytes") or 0) / (1024 ** 3), 2)
        total_output_bytes_gb = round((metrics.get("total_output_bytes") or 0) / (1024 ** 3), 2)
        traffic_consumed_gb = round(total_input_bytes_gb + total_output_bytes_gb, 2)
        traffic_allocated_gb = round((metrics.get("traffic_allocated_mb") or 0) / (1024 ** 3), 2)


        eer = self.calculate_eer(output_kw, input_kw)
        pue = self.calculate_pue(input_kw, output_kw)
        pcr = self.calculate_pcr(input_kw, traffic_consumed_gb)
        data_utilization = self.calculate_utilization(traffic_consumed_gb, traffic_allocated_gb)

        cost_estimation = self.calculate_cost_estimation(input_kw, self.default_cost)
        carbon_emission_kg = self.calculate_emmision_kg(output_kw,self.default_emission)
        carbon_emission_tons = round(carbon_emission_kg / 1000, 2) if carbon_emission_kg else 0

        return {
            'ip_address':metrics.get("ip", 0),
            'device_id':device_data.id,
            'device_name':device_data.device_name,
            'input_kw': input_kw,
            'output_kw': output_kw,
            'eer': round(eer, 4),
            'pue': round(pue, 4),
            'pcr': round(pcr, 4),
            'cost_estimation': round(cost_estimation, 2),
            'carbon_emission_kg': round(carbon_emission_kg, 2),
            'carbon_emission_tons': round(carbon_emission_tons, 4),
            'traffic_consumed_gb': round(traffic_consumed_gb, 4),
            'traffic_allocated_gb': round(traffic_allocated_gb, 2),
            'data_utilization_per': round(data_utilization, 6),
        }

    def get_devices_co2emmision_pcr(self, payload):
        try:
            if not payload.site_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Site ID is required."
                )
            logger.info(f"Fetching devices for site ID: {payload.site_id}")
            results = self.get_devices_by_site_id(payload.site_id)
            device_ips = [result.ip_address for result in results if result.ip_address]
            logger.info(f"Fetching device_ips: {device_ips}")
            logger.info(f"Fetching power and traffic data for duration: {payload.duration}")
            if not payload.duration:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Duration is required."
                )
            # Case 1: All devices in site
            if not payload.device_ids:
                logger.info(f"Fetching data for all devices in site {payload.site_id}")
                devices_data = self.dataquery_repository.get_device_wise_power_traffic_data(
                    device_ips, payload.duration
                )
                get_metrics_data = []
                with ThreadPoolExecutor(max_workers=8) as executor:
                    futures = [executor.submit(self.compute_power_traffic_metrics_per_devices, m) for m in devices_data]
                    for future in as_completed(futures):
                        get_metrics_data.append(future.result())

                return {"devices_data": get_metrics_data}


            # Case 2: Specific device_ids provided
            devices_comparison = {}
            if payload.comparison:
                for id in payload.device_ids:
                    logger.info(f"Processing device ID: {id}")
                    device_data = self.get_device(device_id=id)

                    if not device_data or not device_data.ip_address:
                        logger.warning(f"Device not found or missing IP for ID: {id}")
                        continue

                    metrics_data = self.dataquery_repository.get_cumulative_energy_traffic_timeline(
                        [device_data.ip_address], payload.duration
                    )
                    if not metrics_data:
                        logger.warning("No metrics data returned from repository")
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No metrics data available for the given parameters"
                        )
                    metrics_data = self.get_time_wise_metrics(metrics_data)
                    if not metrics_data:
                        logger.warning("No metrics data returned from repository")
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No metrics data available for the given parameters"
                        )
                    devices_comparison[str(device_data.id)] = {
                        "device_name": device_data.device_name,
                        "ip_address": device_data.ip_address,
                        "metrics_data": metrics_data
                    }
                    logger.info(f"Added metrics for: {device_data.device_name}")
                    print(devices_comparison)

                return devices_comparison

        except Exception as e:
            logger.error(f"Error in get_metrics_info: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}

    def response_detail(self,final_mertric_response):
        # Sort by data utilization %
        sorted_by_utilization = sorted(final_mertric_response, key=lambda x: x['data_utilization_per'],
                                       reverse=True)
        # Top 5 Peak Utilization
        top5_utilization = [{
            "device_name": d["device_name"],
            "traffic_consumed_gb": d["traffic_consumed_gb"],
            "traffic_allocated_gb": d["traffic_allocated_gb"],
            "data_utilization_per": d["data_utilization_per"]
        } for d in sorted_by_utilization[:5]]

        # Bottom 5 Utilization
        bottom5_utilization = [{
            "device_name": d["device_name"],
            "traffic_consumed_gb": d["traffic_consumed_gb"],
            "traffic_allocated_gb": d["traffic_allocated_gb"],
            "data_utilization_per": d["data_utilization_per"]
        } for d in sorted_by_utilization[-5:]]

        # Sort by EER
        sorted_by_eer = sorted(final_mertric_response, key=lambda x: x['eer'], reverse=True)

        # Top 5 EER
        top5_eer = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "eer": d["eer"]
        } for d in sorted_by_eer[:5]]

        # Bottom 5 EER
        bottom5_eer = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "eer": d["eer"]
        } for d in sorted_by_eer[-5:]]
        sorted_by_cost = sorted(final_mertric_response, key=lambda x: x['cost_estimation'], reverse=True)

        top5_cost = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "cost_estimation": d["cost_estimation"]
        } for d in sorted_by_cost[:5]]

        bottom5_cost = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "cost_estimation": d["cost_estimation"]
        } for d in sorted_by_cost[-5:]]

        # Sort by carbon emission
        sorted_by_emission = sorted(final_mertric_response, key=lambda x: x['carbon_emission_kg'], reverse=True)

        top5_emission = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "carbon_emission_kg": d["carbon_emission_kg"]
        } for d in sorted_by_emission[:5]]

        bottom5_emission = [{
            "device_name": d["device_name"],
            "power_input_kw": d["input_kw"],
            "power_output_kw": d["output_kw"],
            "carbon_emission_kg": d["carbon_emission_kg"]
        } for d in sorted_by_emission[-5:]]
        response = {
            "data_utilization": {
                "top": top5_utilization,
                "bottom": bottom5_utilization
            },
            "eer": {
                "top": top5_eer,
                "bottom": bottom5_eer
            },
            "cost_estimation": {
                "top": top5_cost,
                "bottom": bottom5_cost
            },
            "carbon_emission": {
                "top": top5_emission,
                "bottom": bottom5_emission
            }
        }
        return response

    def get_metric_details(self, payload):
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
                metrics_data = self.dataquery_repository.get_device_energy_traffic_details(
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
                metrics_data = self.get_detail_time_wise_metrics(metrics_data)
                return metrics_data

        except Exception as e:
            logger.error(f"Error in get_metrics_info found: {str(e)}", exc_info=True)
            return {"error": "An unexpected error occurred while processing metrics"}

    def get_detail_time_wise_metrics(self, metrics_list: List[dict]) -> List[dict]:
        results = []

        # Step 1: Build a device info map {ip: device_metadata_dict}
        unique_ips = list(set([m['ip'] for m in metrics_list if m.get('ip')]))
        device_info_map = {}

        for ip in unique_ips:
            try:
                device_data = self.get_devices_inventory(ip_address=ip)
                print(device_data.site_name)
                print(device_data.rack_name)
                print(device_data.pn_code)


                device_info_map[ip] = {
                    "device_name": device_data.device_name,
                    "device_id": device_data.device_id,
                    "site_name": device_data.site_name,
                    "pn_code": device_data.pn_code,
                    "rack_name": device_data.rack_name
                }
            except Exception as e:
                logger.warning(f"Could not fetch device info for IP {ip}: {str(e)}")
                device_info_map[ip] = {}

        # Step 2: Compute metrics with enrichment using pre-fetched data
        def wrap_with_enrichment(metrics):
            result = self.compute_metrics(metrics)
            ip = metrics.get("ip")

            enrichment = device_info_map.get(ip, {})
            print("enrichment:", enrichment)
            result["ip_address"] = ip
            result.update(enrichment)
            return result
        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = [executor.submit(wrap_with_enrichment, m) for m in metrics_list]
            for future in as_completed(futures):
                results.append(future.result())

        results.sort(key=lambda x: x['time'])
        return results
