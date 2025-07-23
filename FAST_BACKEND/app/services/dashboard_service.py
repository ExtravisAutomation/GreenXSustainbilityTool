from app.repository.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, dashboard_repository: DashboardRepository):
        self.dashboard_repository = dashboard_repository


    def get_metrics_info(self, payload):
        return self.dashboard_repository.get_metrics_info(payload)
    def get_energy_traffic_data_timeline(self,payload):
        return self.dashboard_repository.get_energy_traffic_data_timeline(payload)
    def get_peak_low_devices(self,payload):
        return self.dashboard_repository.get_peak_low_devices(payload)