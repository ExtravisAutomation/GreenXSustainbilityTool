from dependency_injector import containers, providers
from app.core.config import configs
from app.core.database import Database
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.repository.user_repository import UserRepository
from app.repository.site_repository import SiteRepository
from app.services.rack_service import RackService
from app.repository.rack_repository import RackRepository
from app.services.site_service import SiteService
from app.repository.blacklisted_token_repository import BlacklistedTokenRepository
from influxdb_client import InfluxDBClient, Point, WritePrecision
from app.repository.admin_repository import AdminPanelRepository
from app.repository.comparison_repository import ComparisonRepository
from app.repository.influxdb_repository import InfluxDBRepository
from app.services.apic_service import APICService
from app.repository.dataquery_repository import DataQueryRepository
from app.repository.apic_repository import APICRepository
from app.services.device_service import DeviceService
from app.services.admin_service import AdminPanelService
from app.repository.device_inventory_repository import DeviceInventoryRepository
from app.services.device_inventory_service import DeviceInventoryService
from app.services.dashboard_service import DashboardService
from app.repository.dashboard_repository import DashboardRepository
from app.services.ai_service import AIService
from app.services.report_service import ReportService
from app.repository.report_repository import ReportRepository

from app.services.vcenter_service import VcenterService
from app.repository.vcenter_repository import VcenterRepository

from app.services.perhr_service import PerhrService
from app.repository.perhr_repository import PerhrRepository
from app.repository.ai_repository import AIRepository
from app.services.comparison_service import ComparisonService
from dotenv import load_dotenv

load_dotenv()


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "app.api.v1.endpoints.user",
            "app.api.v2.endpoints.auth",
            "app.api.v2.endpoints.site",
            "app.api.v2.endpoints.rack",
            "app.api.v2.endpoints.device_inventory",
            "app.api.v2.endpoints.apic_data",
            "app.api.v2.endpoints.report",
            "app.api.v2.endpoints.vcenter",
            "app.api.v2.endpoints.perhr",
            "app.api.v2.endpoints.aimodule",
            "app.api.v2.endpoints.admin",
            "app.api.v2.endpoints.comparison",
            "app.api.v2.endpoints.dashboard",
            "app.core.dependencies",
        ]
    )

    db = providers.Singleton(Database, db_url=configs.DATABASE_URI)

    influxdb_client = providers.Singleton(
        InfluxDBClient,
        url=configs.INFLUXDB_URL,
        token=configs.INFLUXDB_TOKEN,
        org=configs.INFLUXDB_ORG)

    influxdb_repository = providers.Factory(
        InfluxDBRepository,
        client=influxdb_client,
        bucket=configs.INFLUXDB_BUCKET,
        org=configs.INFLUXDB_ORG,
        token=configs.INFLUXDB_TOKEN
    )
    dataquery_repository = providers.Factory(
        DataQueryRepository,
        client=influxdb_client,
        bucket=configs.INFLUXDB_BUCKET,
        org=configs.INFLUXDB_ORG,
        token=configs.INFLUXDB_TOKEN
    )
    device_service = providers.Factory(DeviceService, influxdb_repository=influxdb_repository)

    site_repo = providers.Factory(SiteRepository, session_factory=db.provided.session)

    dashboard_repository = providers.Factory(DashboardRepository,session_factory=db.provided.session,dataquery_repository=dataquery_repository,site_repository=site_repo)

    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    rack_repository = providers.Factory(RackRepository, session_factory=db.provided.session)
    blacklisted_token_repository = providers.Factory(
        BlacklistedTokenRepository,
        session_factory=db.provided.session
    )
    admin_repository=providers.Factory(AdminPanelRepository, session_factory=db.provided.session)
    comparison_repository = providers.Factory(ComparisonRepository, session_factory=db.provided.session)
    apic_repository = providers.Factory(APICRepository, session_factory=db.provided.session, influxdb_repository=influxdb_repository)
    device_inventory_repository = providers.Factory(
        DeviceInventoryRepository,
        session_factory=db.provided.session,
        influxdb_repository=influxdb_repository)
    report_repository = providers.Factory(ReportRepository, session_factory=db.provided.session)
    vcenter_repository = providers.Factory(VcenterRepository, session_factory=db.provided.session)
    perhr_repository = providers.Factory(PerhrRepository, session_factory=db.provided.session)
    ai_repository= providers.Factory(AIRepository, session_factory=db.provided.session,
    influxdb_repository = influxdb_repository)
    rack_service = providers.Factory(RackService, rack_repository=rack_repository)
    auth_service = providers.Factory(AuthService, user_repository=user_repository,
                                     blacklisted_token_repository=blacklisted_token_repository)
    site_service = providers.Factory(SiteService, site_repository=site_repo, influxdb_repository=influxdb_repository,ai_repository=ai_repository)
    admin_service = providers.Factory(AdminPanelService, admin_repository=admin_repository, influxdb_repository=influxdb_repository)
    comparison_service = providers.Factory(ComparisonService, comparison_repository=comparison_repository,
                                      dataquery_repository=dataquery_repository,site_repository = site_repo    )
    user_service = providers.Factory(UserService, user_repository=user_repository)
    apic_service = providers.Factory(APICService, apic_repository=apic_repository)
    device_inventory_service = providers.Factory(DeviceInventoryService, device_inventory_repository=device_inventory_repository)
    report_service = providers.Factory(ReportService, report_repository=report_repository)
    vcenter_service = providers.Factory(VcenterService, vcenter_repository=vcenter_repository)
    perhr_service = providers.Factory(PerhrService, perhr_repository=perhr_repository)
    ai_service = providers.Factory(AIService, site_repository=site_repo, influxdb_repository=influxdb_repository,ai_repository=ai_repository)
    dashboard_services=providers.Factory(DashboardService, dashboard_repository=dashboard_repository)