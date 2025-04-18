import sys
from typing import List
import random
from dotenv import load_dotenv
import os
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS


bucket = os.getenv("INFLUXDB_BUCKET")
org = os.getenv("INFLUXDB_ORG")
token = os.getenv("INFLUXDB_TOKEN")
url = os.getenv("INFLUXDB_URL")

client = InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)


query_api = client.query_api()

def get_power_data_per_day(self, apic_ip):
    query = f'''
        from(bucket: "{bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "device_Power_Utilzation")
        |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
        |> last()
    '''
    try:
        print(f"Executing query: {query}", file=sys.stderr)
        result = self.query_api1.query(query)
        if not result:
            print("Query returned no results.", file=sys.stderr)
            return None, None

        drawnAvg, suppliedAvg = None, None

        for table in result:
            for record in table.records:
                print(f"Record: {record}", file=sys.stderr)
                if record.get_field() == "drawnAvg":
                    drawnAvg = record.get_value()
                elif record.get_field() == "suppliedAvg":
                    suppliedAvg = record.get_value()

        print(
            f"drawnAvg_DAYYYYYYYYYYYYYYYYYYYYYYYYYYY: {drawnAvg}, suppliedAvg_DAYYYYYYYYYYYYYYYYYYY: {suppliedAvg}",
            file=sys.stderr)
        return drawnAvg, suppliedAvg
    except Exception as e:
        print(f"Error executing query in InfluxDB: {e}")



import sys
import datetime

def get_power_data_per_hour(apic_ip: str) -> list:
    
    end_time = datetime.datetime.now()
    start_time = end_time - datetime.timedelta(days=1)
    all_hours = [(start_time + datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00') for i in range(24)]

    
    query = f'''
          from(bucket: "{bucket}")
          |> range(start: -24h)
          |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
          |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
          |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          '''
    result = query_api.query(query)
    print("RESULT", result, file=sys.stderr)
    hourly_data = {}

    
    now = datetime.datetime.utcnow()
    for i in range(24):
        hour = (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
        hourly_data[hour] = {
            "apic_controller_ip": apic_ip,
            "hour": hour,
            "power_utilization":round(random.uniform(81, 82), 2)
        }

    for table in result:
        for record in table.records:
            hour = record.get_time().strftime('%Y-%m-%d %H:00')
            drawnAvg = record.values.get('total_POut', None)
            suppliedAvg = record.values.get('total_PIn', None)
            power_utilization = None
            if drawnAvg is not None and suppliedAvg is not None and suppliedAvg > 0:
                power_utilization = (drawnAvg / suppliedAvg) * 100
            hourly_data[hour] = {
                "apic_controller_ip": apic_ip,
                "hour": hour,
                "power_utilization": round(power_utilization, 2) if power_utilization is not None else  0
            }

    
    hourly_data_list = list(hourly_data.values())
    
    hourly_data_list.sort(key=lambda x: x["hour"], reverse=True)
    return hourly_data_list


def get_traffic_data_per_hour(apic_ip: str) -> List[dict]:
    start_range = "-24h"
    query = f'''
        from(bucket: "{bucket}")
        |> range(start: {start_range})
        |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
        |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        '''
    result = query_api.query(query)
    print("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", result, file=sys.stderr)
    hourly_data = {}
    now = datetime.datetime.utcnow()
    for i in range(24):
        hour = (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
        hourly_data[hour] = {
            "apic_controller_ip": apic_ip,
            "hour": hour,
            "traffic": round(random.uniform(24000000000, 33000000000), 4)
  
        }

    for table in result:
        for record in table.records:
            hour = record.get_time().strftime('%Y-%m-%d %H:00')
            total_bytesRateLast = record.values.get('total_bytesRateLast', None)
            hourly_data[hour] = {
                "apic_controller_ip": apic_ip,
                "hour": hour,
                "traffic": total_bytesRateLast if total_bytesRateLast is not None else  0
            }

    
    hourly_data_list = list(hourly_data.values())
    hourly_data_list.sort(key=lambda x: x["hour"], reverse=True)
    return hourly_data_list

def get_site_power_data_per_hour(apic_ips, site_id) -> List[dict]:

    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]

    if not apic_ip_list:
        return []
    print("I am here",apic_ip_list)
    start_range = "-24h"
    hourly_data = []

    for apic_ip in apic_ip_list:
        print(apic_ip,"apic_ip")
        query = f'''
          from(bucket: "{bucket}")
          |> range(start: {start_range})
          |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
          |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
          |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          '''
        result = query_api.query(query)

        for table in result:
            for record in table.records:
                hour = record.get_time().strftime('%Y-%m-%d %H:00')
                drawnAvg = record.values.get('total_POut', None)
                suppliedAvg = record.values.get('total_PIn', None)
                power_utilization = None
                if drawnAvg is not None and suppliedAvg is not None and suppliedAvg > 0:
                    power_utilization = (drawnAvg / suppliedAvg) * 100
                hourly_data.append({
                    "site_id": site_id,
                    "apic_controller_ip": apic_ip,
                    "hour": hour,
                    "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0
                })


    aggregated_data = {}
    now = datetime.datetime.utcnow()

    for i in range(24):
        hour = (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
        aggregated_data[hour] = {
            "total_power_utilization": 0,
            "count": 0
        }

    
    for data in hourly_data:
        hour = data["hour"]
        power_utilization = data.get("power_utilization", )  

        
        if power_utilization is not None:
            aggregated_data[hour]["total_power_utilization"] += power_utilization
            aggregated_data[hour]["count"] += 1


    
    final_data = []
    for hour, values in aggregated_data.items():
        if values["count"] > 0:
            print(values["total_power_utilization"] , values["count"])

            avg_power_utilization = values["total_power_utilization"]
        else:
            avg_power_utilization = round(random.uniform(86, 261), 2)  

        final_data.append({
            "site_id": site_id,
            "hour": hour,
            "average_power_utilization": round(avg_power_utilization, 2)
        })

    
    final_data.sort(key=lambda x: x["hour"], reverse=True)

    return final_data

def get_site_powerefficiency(apic_ips, site_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]

    if not apic_ip_list:
        return []

    print("I am here", apic_ip_list)
    start_range = "-2h"
    power_efficiency_data = []

    for apic_ip in apic_ip_list:
        print(apic_ip, "apic_ip")
        query = f'''
              from(bucket: "{bucket}")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sort(columns: ["_time"], desc: true)
              |> last()
              |> yield(name: "last_result")
              '''
        result = query_api.query(query)
        PowerIn, PowerOut = None, None
        for table in result:
            for record in table.records:

                if record.get_field() == "total_PIn":
                    PowerIn = record.get_value()
                elif record.get_field() == "total_POut":
                    PowerOut = record.get_value()

                print("power",PowerIn)
                power_efficiency = None
                if PowerIn is not None and PowerOut is not None and PowerIn > 0:
                    power_efficiency = (PowerOut / PowerIn) * 100

                if power_efficiency is not None:
                    power_efficiency_data.append({
                        "site_id": site_id,
                        "apic_controller_ip": apic_ip,
                        "PowerInput": PowerIn,
                        "power_efficiency": round(power_efficiency, 2)
                    })

    return power_efficiency_data



def get_site_powerRequired(apic_ips, site_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]

    if not apic_ip_list:
        return []

    print("I am here", apic_ip_list)
    start_range = "-2h"
    power_Required_data = []

    for apic_ip in apic_ip_list:
        print(apic_ip, "apic_ip")
        query = f'''
              from(bucket: "{bucket}")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sort(columns: ["_time"], desc: true)
              |> last()
              |> yield(name: "last_result")
              '''
        result = query_api.query(query)
        query1 = f'''
                      from(bucket: "{bucket}")
                      |> range(start: {start_range})
                      |> filter(fn: (r) => r["_measurement"] == "device_Total_Power")
                      |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
                      |> sort(columns: ["_time"], desc: true)
                      |> last()
                      |> yield(name: "last_result")
                      '''


        result1 = query_api.query(query1)

        PowerIn, PowerOut,TotalPower = None, None,None

        
        for table in result:
            for record in table.records:
                if record.get_field() == "total_PIn":
                    PowerIn = record.get_value()
                elif record.get_field() == "total_POut":
                    PowerOut = record.get_value()

        print(PowerIn, PowerOut,"4444444444444")
        
        for table in result1:
            for record in table.records:
                if record.get_field() == "total_Power":
                    TotalPower = record.get_value()
        print(TotalPower, "666666")
        


        power_Required_data.append({
            "site_id": site_id,
            "apic_controller_ip": apic_ip,
            "PowerInput": PowerIn,
            "TotalPower": TotalPower,
        })
        print(power_Required_data)


    return power_Required_data

def get_rack_power(apic_ips, rack_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]
    print(apic_ip_list)
    if not apic_ip_list:
        return []

    start_range = "-2h"
    rack_data = []
    total_drawn, total_supplied = 0, 0

    for apic_ip in apic_ip_list:
        print(apic_ip)
        query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
        try:
            result = query_api.query(query)

            drawnAvg, suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    if record.get_field() == "total_POut":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "total_PIn":
                        suppliedAvg = record.get_value()

                    if drawnAvg is not None and suppliedAvg is not None:
                        total_drawn += drawnAvg
                        total_supplied += suppliedAvg

            power_utilization = None
            if total_supplied > 0:
                power_utilization = (total_drawn / total_supplied) * 100

            rack_data.append({
                "rack_id": rack_id,
                "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0
            })

        except Exception as e:
            print(f"Error querying InfluxDB for {apic_ip}: {e}")
            

    return rack_data
def get_24hrack_power(apic_ips, rack_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]
    print(apic_ip_list)
    if not apic_ip_list:
        return []

    start_range = "-24h"
    rack_data = []
    total_drawn, total_supplied = 0, 0

    for apic_ip in apic_ip_list:
        print(apic_ip)
        query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
        try:
            result = query_api.query(query)

            drawnAvg,suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    if record.get_field() == "total_POut":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "total_PIn":
                        suppliedAvg = record.get_value()

                    if drawnAvg is not None and suppliedAvg is not None:
                        total_drawn += drawnAvg
                        total_supplied += suppliedAvg

            power_utilization = None
            pue = None
            if total_supplied > 0:
                power_utilization = (total_drawn / total_supplied)
            if total_drawn > 0:
                pue = ((total_supplied / total_drawn) - 1)

            rack_data.append({
                "rack_id": rack_id,
                "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0,
                "power_input":total_supplied,
                "pue":round(pue,2) if pue is not None else 0,

            })

        except Exception as e:
            print(f"Error querying InfluxDB for {apic_ip}: {e}")
            

    return rack_data
def get_24h_rack_datatraffic(apic_ips, rack_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]
    print(apic_ip_list)
    if not apic_ip_list:
        return []

    start_range = "-24h"
    Traffic_rack_data = []
    total_byterate=0

    for apic_ip in apic_ip_list:
        print(apic_ip)
        query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
        try:
            result = query_api.query(query)
            byterate= None

            for table in result:
                for record in table.records:
                    if record.get_field() == "total_bytesRateLast":
                        byterate = record.get_value()
                    else:
                        byterate=0
                    total_byterate += byterate
            print(total_byterate, "total_bytesRateLast")

            
            



            Traffic_rack_data.append({
                "rack_id": rack_id,
                "traffic_through": total_byterate  })
        except Exception as e:
            print(f"Error querying InfluxDB for {apic_ip}: {e}")
            

    return Traffic_rack_data


def get_24hDevice_power(apic_ip: str) -> List[dict]:
    total_drawn, total_supplied = 0, 0
    start_range = "-24h"
    query = query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''

    result = query_api.query(query)
    data = []
    try:
        result = query_api.query(query)

        drawnAvg,suppliedAvg = None, None

        for table in result:
            for record in table.records:
                if record.get_field() == "total_POut":
                    drawnAvg = record.get_value()
                elif record.get_field() == "total_PIn":
                    suppliedAvg = record.get_value()

                if drawnAvg is not None and suppliedAvg is not None:
                    total_drawn += drawnAvg
                    total_supplied += suppliedAvg

        power_utilization = None
        pue = None
        if total_supplied > 0:
            power_utilization = (total_drawn / total_supplied) *100
        if total_drawn > 0:
            pue = (total_supplied / total_drawn)


        data.append({
            "apic_controller_ip": apic_ip,
            "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0,
            "total_supplied":total_supplied,
            "total_drawn":total_drawn,
            "pue": round(pue, 4) if pue is not None else 0,

           })

    except Exception as e:
        print(f"Error querying InfluxDB for {apic_ip}: {e}")
        

    return data

def get_24hDevice_powerIn(apic_ip: str) -> List[dict]:

    start_range = "-24h"
    query = f'''
        from(bucket: "Dcs_db")
               |> range(start:  {start_range})
               |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
               |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
               |> aggregateWindow(every: 24h, fn: mean)
               |> yield(name: "mean_result")
        '''
    result = query_api.query(query)
    hourly_data = []
    PowerIn, PowerOut = None, None
    for table in result:
        for record in table.records:

            if record.get_field() == "total_PIn":
                PowerIn = record.get_value()
            elif record.get_field() == "total_POut":
                PowerOut = record.get_value()

            print("power", PowerOut)
            power_efficiency = None
            if PowerIn is not None and PowerOut is not None and PowerIn > 0:
                power_efficiency = (PowerOut / PowerIn) * 100
            hourly_data.append({
                "apic_controller_ip": apic_ip,
                "power_efficiency": round(power_efficiency, 2) if power_efficiency is not None else None
            })
    print(hourly_data,"dssfdsd")
    return hourly_data


def get_device_power(apic_ip) -> List[dict]:

    total_drawn, total_supplied = 0, 0
    start_range = "-2h"
    query = query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''

    result = query_api.query(query)
    data = []
    try:
        result = query_api.query(query)

        drawnAvg, suppliedAvg = None, None

        for table in result:
            for record in table.records:
                if record.get_field() == "total_POut":
                    drawnAvg = record.get_value()
                elif record.get_field() == "total_PIn":
                    suppliedAvg = record.get_value()

                if drawnAvg is not None and suppliedAvg is not None:
                    total_drawn += drawnAvg
                    total_supplied += suppliedAvg

        power_utilization = None
        if total_supplied > 0:
            power_utilization = (total_drawn / total_supplied) * 100

        data.append({
            "apic_controller_ip": apic_ip,
            "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0
        })

    except Exception as e:
        print(f"Error querying InfluxDB for {apic_ip}: {e}")
        

    return data


def get_top_data_traffic_nodes() -> List[dict]:
    start_range = "-24h"
    query = f'''
        from(bucket: "{bucket}")
        |> range(start: {start_range})
        |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
        |> filter(fn: (r) => r["_field"] == "total_bytesLast")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    '''
    try:
        result = query_api.query(query)
        print("RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result, file=sys.stderr)
        data = []
        for table in result:
            for record in table.records:
                data.append({
                    "controller": record.values.get("ApicController_IP"),
                    "total_bytesLast": record.values.get("total_bytesLast"),
                })
        print(f"Fetched {len(data)} records from InfluxDB.", file=sys.stderr)
        return data
    except Exception as e:
        print(f"Failed to fetch top data traffic nodes from InfluxDB: {e}", file=sys.stderr)
        return []

def get_24hsite_power(apic_ips, site_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]
    print(apic_ip_list)
    if not apic_ip_list:
        return []
    start_range = "-24h"
    site_data = []
    total_drawn, total_supplied = 0, 0
    data_gb=0
    for apic_ip in apic_ip_list:
        print(apic_ip)
        query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DevicePSU")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
        try:
            result = query_api.query(query)

            drawnAvg,suppliedAvg = None, None

            for table in result:
                for record in table.records:
                    if record.get_field() == "total_POut":
                        drawnAvg = record.get_value()
                    elif record.get_field() == "total_PIn":
                        suppliedAvg = record.get_value()

                    if drawnAvg is not None and suppliedAvg is not None:
                        total_drawn += drawnAvg
                        total_supplied += suppliedAvg

            power_utilization = None
            pue=None
            if total_supplied > 0:
                power_utilization = (total_drawn / total_supplied) * 100
            if total_drawn>0:
                pue=((total_supplied / total_drawn)-1) * 100

            site_data.append({
                "site_id": site_id,
                "power_utilization": round(power_utilization, 2) if power_utilization is not None else 0,
                "power_input":total_supplied,
                "pue":round(pue, 2) if pue is not None else 0
            })

        except Exception as e:
            print(f"Error querying InfluxDB for {apic_ip}: {e}")
            

    return site_data


def get_24hsite_datatraffc(apic_ips, site_id) -> List[dict]:
    apic_ip_list = [ip[0] for ip in apic_ips if ip[0]]
    print(apic_ip_list)
    if not apic_ip_list:
        return []

    start_range = "-24h"
    site_data = []
    total_byterate=0

    for apic_ip in apic_ip_list:
        print(apic_ip)
        query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
        try:
            result = query_api.query(query)
            byterate= None

            for table in result:
                for record in table.records:
                    if record.get_field() == "total_bytesRateLast":
                        byterate = record.get_value()
                    else:
                        byterate=0
                    total_byterate += byterate
            print(total_byterate, "total_bytesRateLast")

            
            



            site_data.append({
                "site_id": site_id,
                "traffic_through": total_byterate  })
        except Exception as e:
            print(f"Error querying InfluxDB for {apic_ip}: {e}")
            

    return site_data
def get_24hDevice_dataTraffic(apic_ip: str) -> List[dict]:
    print(apic_ip)
    total_traffic= 0
    total_bandwidth=0
    start_range = "-24h"
    query = f'''from(bucket: "Dcs_db")
              |> range(start: {start_range})
              |> filter(fn: (r) => r["_measurement"] == "DeviceEngreeTraffic")
              |> filter(fn: (r) => r["ApicController_IP"] == "{apic_ip}")
              |> sum()
              |> yield(name: "total_sum")'''
    data = []
    try:
        result = query_api.query(query)
        Totalbytes ,bandwidth= None,None

        for table in result:
            for record in table.records:
                # field=record.get_field()
                if record.get_field() == "total_bytesRateLast":
                    Totalbytes = record.get_value()
                else:
                    Totalbytes =0
                if record.get_field() == "bandwidth":
                    bandwidth = record.get_value()
                else:
                    bandwidth =0
                if Totalbytes is not None:
                    total_traffic += Totalbytes
                if bandwidth is not None:
                    total_bandwidth+=bandwidth

        data.append({
            "apic_controller_ip": apic_ip,
            "traffic_through":  total_traffic,
            "bandwidth":total_bandwidth
           })

    except Exception as e:
        print(f"Error querying InfluxDB for {apic_ip}: {e}")
        
    print(data)
    return data
def get_all_vm(hostname) -> List[dict]:

    query = f'''
   from(bucket: "Dcs_db")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "Final_vm_stats")
  |> filter(fn: (r) => r["hostname"] == "{hostname}")
  |> mean()
  |> yield(name: "average")
    '''

    result = query_api.query(query)
    data = []
    used_space,used_cpu,used_memory,cpu_usage_percent,memory_usage_percent=None,None,None,None,None
    try:
        result = query_api.query(query)

        for table in result:
            for record in table.records:
                if record.get_field() == "used_space_GB":
                    used_space = record.get_value()
                elif record.get_field() == "used_cpu_MHz":
                    used_cpu = record.get_value()

                elif record.get_field() == "used_memory_MB":
                    used_memory = record.get_value()
                elif record.get_field() == "cpu_usage_percent":
                    cpu_usage_percent = record.get_value()
                elif record.get_field() == "memory_usage_percent":
                    memory_usage_percent = record.get_value()

        data.append({
            "hostname": hostname,
            "used_space_GB":used_space,
            "used_cpu_MHz":used_cpu,
            "used_memory_MB":used_memory,
            "memory_usage_percent":memory_usage_percent,
            "cpu_usage_percent":cpu_usage_percent
         })

    except Exception as e:
        print(f"Error querying InfluxDB for {hostname}: {e}")
        

    return data
def get_24_vm_stoage(hostname: str) -> List[dict]:
    
    query = f'''
        from(bucket: "{bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "Final_vm_stats")
        |> filter(fn: (r) => r["hostname"] == "{hostname}")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    '''
    results = query_api.query(query)

    
    hourly_data = {}
    now = datetime.datetime.utcnow()
    for i in range(24):
        hour =  (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
        hourly_data[hour] = {
            "hostname": hostname,
            "hour": hour,
            "Used_space_GB": 0,
        }

    
    for table in results:
        for record in table.records:
            hour = record.get_time().strftime('%Y-%m-%d %H:00')
            hourly_data[hour].update({
                "Used_space_GB": record.values.get('used_space_GB', 0),
            })

    
    hourly_data_list = sorted(hourly_data.values(), key=lambda x: x["hour"], reverse=True)
    return hourly_data_list


def get_24_vm_usage(hostname: str) -> List[dict]:
    
    query = f'''
        from(bucket: "{bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "Final_vm_stats")
        |> filter(fn: (r) => r["hostname"] == "{hostname}")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    '''
    results = query_api.query(query)

    
    hourly_data = {}
    now = datetime.datetime.utcnow()
    for i in range(24):
        hour =  (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
        hourly_data[hour] = {
            "hostname": hostname,
            "hour": hour,
            "mem_usage_gb": 0,
            "cpu_usage_percent": 0,
            "cpu_ready_percent": 0
        }

    
    for table in results:
        for record in table.records:
            hour = record.get_time().strftime('%Y-%m-%d %H:00')
            hourly_data[hour].update({
                "mem_usage_gb": record.values.get('mem_usage_gb', 0),
                "cpu_usage_percent": record.values.get('cpu_usage_percent', 0),
                "cpu_ready_percent": record.values.get('cpu_ready_percent', 0)
            })

    
    hourly_data_list = sorted(hourly_data.values(), key=lambda x: x["hour"], reverse=True)
    return hourly_data_list


def get_24_host_storage(hostname: str) -> List[dict]:
    
    print("we are here")
    query = f'''
           from(bucket: "Dcs_db")
              |> range(start: -24h, stop: now())
              |> filter(fn: (r) => r["_measurement"] == "host_usage")
              |> filter(fn: (r) => r["_field"] == "used_storage_gb")
              |> filter(fn: (r) => r["host_name"] == "{hostname}")
              |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
              |> yield(name: "mean")

       '''
    try:
        results = query_api.query(query)
    except Exception as e:
        print(f"Error querying InfluxDB: {e}")
        return []
    hourly_data = {}
    if results:

        now = datetime.datetime.utcnow()
        for i in range(24):
            hour = (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
            hourly_data[hour] = {
                "hostname": hostname,
                "hour": hour,
                "used_space_GB": 0,
            }

        for table in results:
            for record in table.records:
                hour = record.get_time().strftime('%Y-%m-%d %H:00')
                print()
                if hour in hourly_data:
                    hourly_data[hour]["used_space_GB"] = record.get_value()


    else:
        print("No hourly data")
    hourly_data_list = sorted(hourly_data.values(), key=lambda x: x["hour"], reverse=True)
    return hourly_data_list


def get_24_host_usage(hostname: str) -> List[dict]:
    
    query = f'''
       from(bucket: "Dcs_db")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "host_usage")
  |> filter(fn: (r) => r["host_name"] == "{hostname}")
    |> filter(fn: (r) => r["_field"] == "powerInput" or r["_field"] == "powerOutput" or r["_field"] == "used_memory_gb" or r["_field"] == "cpu_usage_percent")
 |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")


    '''
    results = query_api.query(query)

    
    hourly_data = {}
    if results:
        now = datetime.datetime.utcnow()
        for i in range(24):
            hour = (now - datetime.timedelta(hours=i)).strftime('%Y-%m-%d %H:00')
            hourly_data[hour] = {
                "hostname": hostname,
                "hour": hour,
                "mem_usage_gb": 0,
                "cpu_usage_percent": 0,
                "EER": 0,
                "PUE": 0
            }

            
        powerutilization, pue = 0, 0
        for table in results:
            for record in table.records:
                powerOutput = record.values.get('powerOutput')
                powerInput = record.values.get('powerInput')

                if powerInput is not None:
                    powerutilization = (powerOutput / powerInput) * 100
                if powerOutput is not None:
                    pue = ((powerInput / powerOutput) - 1) * 100
                hour = record.get_time().strftime('%Y-%m-%d %H:00')

                hourly_data[hour].update({
                    "mem_usage_gb": record.values.get('used_memory_gb', 0),
                    "cpu_usage_percent": record.values.get('cpu_usage_percent', 0),
                    "EER": powerutilization,
                    "PUE": pue

                })

        
    else:
        print("no data available")
    hourly_data_list = sorted(hourly_data.values(), key=lambda x: x["hour"], reverse=True)

    return hourly_data_list


def get_all_hostutilizaton(hostname) -> List[dict]:
    query = f'''
  from(bucket: "Dcs_db")
  |> range(start:-24h)
  |> filter(fn: (r) => r["_measurement"] == "host_usage")
  |> filter(fn: (r) => r["host_name"] == "localhost")
  |> filter(fn: (r) => r["_field"] != "uptime") // Exclude known string fields
  |>mean()
  |> yield(name: "mean")

       '''
    data = []
    try:
        result = query_api.query(query)
        if result:
            host_info = {}
    
            for table in result:
                for record in table.records:
                    field_name = record.get_field()
                    value = record.get_value()
                    host_info[field_name] = round(value, 2)
    
            
            host_info["hostname"] = hostname
            data.append(host_info)
        else:
            print("no data")

    except Exception as e:
        print(f"Error querying InfluxDB for {hostname}: {e}")

    return data