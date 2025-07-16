from app.repository.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, dashboard_repository: DashboardRepository):
        self.dashboard_repository = dashboard_repository


    def get_metrics_info(self, metrics):
        return self.dashboard_repository.get_metrics_info(metrics)
