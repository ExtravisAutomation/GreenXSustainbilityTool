from fastapi import APIRouter

from app.api.v2.endpoints.auth import router as auth_router
from app.api.v2.endpoints.site import router as site_router
from app.api.v2.endpoints.rack import router as rack_router
from app.api.v2.endpoints.device import router as device_router

from app.api.v2.endpoints.device_inventory import router as device_inventory_router


from app.api.v2.endpoints.admin import router as admin_router
from app.api.v2.endpoints.dashboard import router as dashboard_router

routers = APIRouter()
router_list = [auth_router, site_router, device_router, rack_router,
                device_inventory_router,admin_router,dashboard_router]


for router in router_list:
    router.tags = routers.tags.append("v2")
    routers.include_router(router)
