# GreenX Sustainability Tool

The GreenX Sustainability Tool is an integrated platform that collects and processes network power usage, PSU health, and data traffic metrics from Cisco and other supported devices.
It uses Docker to run a complete stack such as database, backend API, frontend dashboard, and time-series storage, making it easy to deploy and operate.

Beyond simple monitoring, the tool provides real-time sustainability insights through a modern, interactive dashboard.
It enables you to:

* Track Power Usage Effectiveness (PUE) for overall energy efficiency evaluation

* Monitor carbon emissions (CO₂e) with equivalent real-world impact (e.g., flights, car mileage)

* Analyze energy source contributions (coal, solar, wind, hydro) through visual metrics

* View rack utilization heatmaps to optimize physical infrastructure usage

* Measure data utilization and interface uptime percentages

* Compare device-level performance, including carbon footprint, cost estimation, and throughput

* Identify top carbon-emitting devices over selected time frames

* Gain actionable recommendations for consolidation, decommissioning, and efficiency improvements

With these features, GreenX Sustainability Tool not only monitors your infrastructure but also helps you optimize operations, reduce energy waste, and achieve sustainability goals.

![Dashboard Screenshot](assets/dashboard.jpeg)
![Onboarding Devices Screenshot](assets/onboarding.png)
![Inventory Dashboard Screenshot](assets/inventory.png)
![PUE Screenshot](assets/pue.png)
![AI Screenshot](assets/ai.png)
![Reporting Screenshot](assets/report.png)


# 1. Get the code

        # Clone the repo
        git clone https://github.com/Extravis-islamabad/GreenXSustainbilityTool.git
        cd greenx-sustainability-tool
# 2. **Prerequisites**  
To run this project, you'll need the following installed on your machine:

* Docker Desktop (or Docker Engine) & Docker Compose v2: These are essential for building and running the containerized services.

* Git: Required to clone the project repository.

* Node.js: Needed for local frontend development if you choose to run it outside the Docker container.

* Python: Not required on the host machine, as all collector scripts run inside the backend container.

# 3. **Configuration**  
**Create the** .env **file**   
Before starting the services, you must create a .env file in the root directory of the project. This file is used by Docker Compose to configure the various services.


**==== MySQL ====**  

    DB_NAME=GreenX   
    DB_PORT=3307                  # host port you want to expose; 3306 inside the container     
    DB_PASSWORD=supersecretroot   # used as MYSQL_ROOT_PASSWORD if you prefer
    MYSQL_USER=greenx   
    MYSQL_PASSWORD=greenxpass

 **==== InfluxDB v2 ====**
        

    
    INFLUXDB_USERNAME=admin   
    INFLUXDB_PASSWORD=adminpass   
    INFLUXDB_ORG=greenx     
    INFLUXDB_BUCKET=actual_power   
    INFLUXDB_TOKEN=changeme-superlong-token
 
**Note:** If you change the DB_PORT, remember to update any local database clients accordingly.

# 4. **First Run (Build + Start)**  
From the repository root (the same folder as docker-compose.yml), run the following commands:

- To build the images and start all services in the background:  


        docker compose up -d --build


- To watch the logs on the first boot:


        docker compose logs -f

- To stop the services:



        docker compose down
- To stop the services and remove volumes (⚠️ this will wipe your databases):



        docker compose down -v

# 5. **Service Breakdown**
- GreenX_db (MySQL 8):

    - Exposes ${DB_PORT}:3306 (default example uses 3307 -> 3306).
    
    - Initializes with ./db/initdb/ SQL files.
    
    - Uses a container-specific health check.

- GreenX_backend (FastAPI):

  - Built from ./FAST_BACKEND.

  - Mounts code into /app for live reloading.

  - Exposes port 8000.

  - Gets DB/InfluxDB environment variables from the .env file.

  - Container name: GreenX_test_container_Backend.

- GreenX_frontend_dev (React):

  - Built from ./frontend.

  - Exposes 3015:3000.

  - Uses REACT_APP_API_BASE=http://localhost:8000 to connect to the backend.

- influxdb_GreenX (InfluxDB 2.x):

  - Exposes 8089:8086. You can access the UI at http://localhost:8089.

  - Auto-configured via environment variables in the .env file.

  - Persists data using named volumes.

# 6. **Verify Services**  
Check that all services are up and running:

   
Backend: http://localhost:8000 (FastAPI docs may be at /docs)
    
Frontend: http://localhost:3015
    
InfluxDB UI: http://localhost:8089 (Log in with credentials from your .env file)
    
MySQL: Connect from your host with the mysql CLI:
          
          mysql -h 127.0.0.1 -P ${DB_PORT} -u ${MYSQL_USER} -p
# 7. **Running the collectors manually (inside the backend container)**   
- Open a shell in the backend container:


        docker exec -it GreenX_test_container_Backend bash

- Run collectors:
    

        # Traffic
        python /app/collector/datatraffic_main.py 
    
        # Power
        python /app/collector/main_power.py
        
        # PSU
        python /app/collector/main_psu.py

# 8. Scheduling the collectors
You can schedule from the host (recommended) or inside the container.
Below is the host-cron approach, which does not require modifying images.

**8.1 Host cron (Linux/macOS)**    
- Open crontab:


        crontab -e

- Create a log folder (optional):


        sudo mkdir -p /var/log/greenx && sudo chmod 777 /var/log/greenx


- Run hourly (recommended)   


        cron
        # TRAFFIC (hourly at minute 0)
        0 * * * * docker exec GreenX_test_container_Backend python /app/collector/datatraffic_main.py >> /var/log/greenx/datatraffic.log 2>&1
        
        # POWER (hourly at minute 5)
        5 * * * * docker exec GreenX_test_container_Backend python /app/collector/main_power.py >> /var/log/greenx/power.log 2>&1
        
        # PSU (hourly at minute 10)
        10 * * * * docker exec GreenX_test_container_Backend python /app/collector/main_psu.py >> /var/log/greenx/psu.log 2>&1

- Run every minute (for testing/burn-in)


        cron
        * * * * * docker exec GreenX_test_container_Backend python /app/collector/datatraffic_main.py >> /var/log/greenx/datatraffic.log 2>&1
        * * * * * docker exec GreenX_test_container_Backend python /app/collector/main_power.py >> /var/log/greenx/power.log 2>&1
        * * * * * docker exec GreenX_test_container_Backend python /app/collector/main_psu.py >> /var/log/gr
**Tip:** Tail logs with sudo tail -f /var/log/greenx/*.log


**8.2 Windows Task Scheduler (if you’re on Windows)**  
- Create a Basic Task → Action: Start a program and use:



      
        nginx
          docker


  - Arguments:
  

        bash
         exec GreenX_test_container_Backend python /app/collector/datatraffic_main.py

- Repeat task: Every 1 hour (or Every 1 minute for testing).

Create separate tasks for main_power.py and main_psu.py.



# 9. Premium Version Access
Looking for advanced features, priority updates, and premium support?
Our premium version offers extended data analytics, enhanced scheduling options, and custom integrations tailored to your infrastructure.

📩 Email us at [Support@extravis.co]() to get access today.




# 10. 📅 GreenX Roadmap

| Quarter | Status | Key Features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|---------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Q1'25** | ✅ **Completed** | - Real-Time Energy Optimization<br>- CO₂ Emissions Tracking & Reporting<br>- Dynamic Cooling Efficiency Metrics<br>- Integration with BMS & DCIM Tools<br>- Interactive Dashboard for PUE & EER Metrics                                                                                                                                                                                                                                                                                                                        |
| **Q2'25** | ✅ **Completed** | - Rack Power Heat Maps<br>- Environmental Monitoring<br>- Customizable Dashboards<br>- Role-Based Access Control<br>- Notifications & Alerts<br>- Comprehensive Reporting<br>- Automated Device Onboarding<br>- AI Models for Anomaly Detection<br>- Advanced AI Predictive Analytics<br>- Energy Efficiency Recommendations<br>- What-If Analysis<br>- VMware Integration<br>- Integration with Additional Third-Party Tools<br>- Goal Compliance Automation<br>- Interactive Visual Analytics for Traffic & Power Correlation |
| **Q3'25** | ⏳ **In Progress** | - Enhanced Reporting (weekly/monthly reports, AI insights)<br>- PUE Calculator (simulate CO₂ impact, compare data)<br>- Water & Cooling Efficiency (WUE monitoring, AI optimization)                                                                                                                                                                                                                                                                                                                                           |
| **Q4'25** | ⏳ **Planned** | - Dynamic Thermal Management (AI-based cooling)<br>- Workload Placement & Power Capping<br>- Renewable Energy Integration (solar, wind)                                                                                                                                                                                                                                                                                                                                                                                        |
