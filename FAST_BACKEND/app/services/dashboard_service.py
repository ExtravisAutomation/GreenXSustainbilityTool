from app.repository.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, dashboard_repository: DashboardRepository):
        self.dashboard_repository = dashboard_repository


    def get_dashboard_info(self, site_id):
        return self.dashboard_repository.get_sites_info(site_id)
    def get_dashboards(self, site_id):
        return self.dashboard_repository.get_dashboards_info(site_id)