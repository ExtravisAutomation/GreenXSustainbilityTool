from fastapi import APIRouter

from app.api.v2.endpoints.auth import router as auth_router
from app.api.v2.endpoints.site import router as site_router
from app.api.v2.endpoints.rack import router as rack_router
from app.api.v2.endpoints.device import router as device_router
from app.api.v2.endpoints.apic_data import router as apic_router
from app.api.v2.endpoints.device_inventory import router as device_inventory_router
from app.api.v2.endpoints.report import router as report_router
from app.api.v2.endpoints.vcenter import router as vcenter_router
from app.api.v2.endpoints.perhr import router as perhr_router
from app.api.v2.endpoints.aimodule import router as aimodules_router
from app.api.v2.endpoints.admin import router as admin_router

from app.api.v2.endpoints.comparison import router as comparison

routers = APIRouter()
router_list = [auth_router, site_router, device_router, rack_router,
               apic_router, device_inventory_router, report_router,
               vcenter_router,perhr_router,aimodules_router,admin_router,comparison]

for router in router_list:
    router.tags = routers.tags.append("v2")
    routers.include_router(router)
