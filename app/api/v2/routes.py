from fastapi import APIRouter

from app.api.v2.endpoints.auth import router as auth_router
from app.api.v2.endpoints.site import router as site_router
from app.api.v2.endpoints.rack import router as rack_router

routers = APIRouter()
router_list = [auth_router, site_router, rack_router]

for router in router_list:
    router.tags = routers.tags.append("v2")
    routers.include_router(router)
