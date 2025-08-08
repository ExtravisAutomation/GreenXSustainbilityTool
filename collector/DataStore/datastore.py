import logging
import requests
import re
from sqlalchemy.orm import sessionmaker
from collector.Models.model import Device, PasswordGroup, APICController, DeviceInventory
from collector.Database.db_connector import DBConnection
from influxdb_client import WritePrecision, Point
from collections import defaultdict
from datetime import datetime


# Setup logging
logger = logging.getLogger(__name__)

class DataStorage:
    def __init__(self):
        """
        Initialize the DataStorage class with a database connection.
        """
        self.db_connection = DBConnection()
        self.data_retrieved = 0
        logging.info("Database initialization started.")
        try:
            self.client = self.db_connection.influx_client
            self.write_api = self.db_connection.write_api
            self.query_api = self.db_connection.query_api
            logging.info("Database initialized successfully.")
        except Exception as e:
            logging.error(f"Error during database initialization: {e}")
            raise

    def store_Powerdata(self, psu_data):
        try:
            logging.info("Storing power usage data to InfluxDB.")
            for dn, attributes in psu_data.items():
                point = Point("DevicePSU") \
                    .field("total_PIn", float(attributes['total_pIn'])) \
                    .field("total_POut", float(attributes['total_pOut'])) \
                    .tag("ApicController_IP", attributes['ip']) \
                    .time(datetime.utcnow(), WritePrecision.NS)

                self.db_connection.write_api.write(bucket=self.db_connection.influx_config['bucket'],
                                                   org=self.db_connection.influx_config['org'], record=point)
            logging.info("Power usage data saved successfully.")
        except Exception as e:
            logging.error(f"An error occurred while saving power data to InfluxDB: {e}")
            raise

    def store_ReqPowerdata(self, reqPow_data):
        try:
            logging.info("Storing required power data to InfluxDB.")
            psu = len(reqPow_data)
            for dn, attributes in reqPow_data.items():
                point = Point("device_Total_Power") \
                    .tag("ApicController_IP", attributes['ip']) \
                    .field("total_Power", int(attributes['total_power'])) \
                    .field("total_data_points", int(psu)) \
                    .time(datetime.utcnow(), WritePrecision.NS)

                self.db_connection.write_api.write(bucket=self.db_connection.influx_config['bucket'],
                                                   org=self.db_connection.influx_config['org'], record=point)
            logging.info("Required power data saved successfully.")
        except Exception as e:
            logging.error(f"An error occurred while saving required power data to InfluxDB: {e}")
            raise

    def store_DataTraffic(self, DataTraffic_data):
        try:
            logging.info(f"Storing data traffic to InfluxDB: {DataTraffic_data}")
            psu = len(DataTraffic_data)
            for dn, attributes in DataTraffic_data.items():
                measurement = "DeviceEngreeTraffic"
                # Create a new point
                try:
                    point = Point(measurement) \
                        .field("total_bytesLast", int(attributes['bytesLast'])) \
                        .field("total_bytesRateLast", float(attributes['bytesRateLast'])) \
                        .field("total_pktsLast", float(attributes['pktsLast'])) \
                        .field("total_pktsRateLast", float(attributes['pktsRateLast'])) \
                        .field("total_data_point", psu) \
                        .field("total_input_bytes", float(attributes['total_input_bytes'])) \
                        .field("total_output_bytes", float(attributes['total_output_bytes'])) \
                        .tag("ApicController_IP", attributes['ip']) \
                        .time(datetime.utcnow(), WritePrecision.NS)
                    self.db_connection.write_api.write(bucket=self.db_connection.influx_config['bucket'],
                                                       org=self.db_connection.influx_config['org'], record=point)
                    logging.info("Data traffic saved successfully.")
                except Exception as e:
                    logging.error("Data traffic not saved successfully.")
        except Exception as e:
            logging.error(f"An error occurred while saving data traffic to InfluxDB: {e}")
            raise
    def store_Carbonintensity(self, carbon_data):
        try:
            logging.info("Storing Carbon data to InfluxDB.")
            for item in carbon_data['history']:
                datetime_object = datetime.fromisoformat(item['datetime'].replace('Z', '+00:00'))
                try:
                    point = Point("electricitymap_carbonIntensity") \
                        .tag("zone", item['zone']) \
                        .field("carbonIntensity", int(item['carbonIntensity'])) \
                        .field("isEstimated", item['isEstimated']) \
                        .field("emissionFactorType", str(item['emissionFactorType'])) \
                        .time(datetime_object, WritePrecision.NS)
                    self.db_connection.write_api.write(bucket=self.db_connection.influx_config['bucket'],
                                                   org=self.db_connection.influx_config['org'], record=point)

                    logging.info("Carbon Intensity saved successfully.")
                except Exception as e:
                    logging.error("Carbon Intensity data not saved successfully.")
        except Exception as e:
            logging.error(f"An error occurred while saving data traffic to InfluxDB: {e}")
            raise

    def dataStore_powerConsumption(self, power_data):
        try:
            logging.info("Storing PowerConsumption data to InfluxDB.")
            for item in power_data['history']:
                    datetime_object = datetime.fromisoformat(item['datetime'].replace('Z', '+00:00'))
                    try:
                        point = Point("electricitymap_power") \
                        .tag("zone", item['zone']) \
                        .field("fossilFreePercentage", item['fossilFreePercentage']) \
                        .field("powerConsumptionTotal", item['powerConsumptionTotal']) \
                        .field("powerProductionTotal", item['powerProductionTotal']) \
                        .field("renewablePercentage", item['renewablePercentage']) \
                        .time(datetime_object, WritePrecision.NS)

                        for key in item['powerConsumptionBreakdown']:
                            point.field(f"{key}_consumption", item['powerConsumptionBreakdown'][key])
                        for key in item['powerProductionBreakdown']:
                            point.field(f"{key}_production", item['powerProductionBreakdown'][key])


                        self.db_connection.write_api.write(bucket=self.db_connection.influx_config['bucket'],
                                                       org=self.db_connection.influx_config['org'], record=point)

                        logging.info("PowerConsumption data saved successfully.")
                    except Exception as e:
                        logging.error("PowerConsumption data not saved successfully.")

        except Exception as e:
            logging.error(f"An error occurred while saving data traffic to InfluxDB: {e}")
            raise
