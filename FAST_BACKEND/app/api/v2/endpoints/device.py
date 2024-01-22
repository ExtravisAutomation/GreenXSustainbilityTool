from fastapi import APIRouter, BackgroundTasks, Depends
from dependency_injector.wiring import Provide, inject
from app.core.container import Container
from app.schema.device_schema import MonitorDeviceRequest
from app.services.device_service import DeviceService

from app.schema.device_schema import DeviceDataResponse

from app.model.user import User

from app.core.dependencies import get_current_active_user

from app.core.config import configs
from influxdb_client import InfluxDBClient, Point, WritePrecision

from app.repository.influxdb_repository import InfluxDBRepository

router = APIRouter(prefix="/ACIdevice", tags=["ACIdevice"])


@router.post("/monitor_device")
async def monitor_device(
        request: MonitorDeviceRequest,
        background_tasks: BackgroundTasks,
        current_user: User = Depends(get_current_active_user),
):
    # instance of DeviceService
    influxdb_client = InfluxDBClient(
        url=configs.INFLUXDB_URL,
        token=configs.INFLUXDB_TOKEN,
        org=configs.INFLUXDB_ORG
    )
    influxdb_repository = InfluxDBRepository(
        client=influxdb_client,
        bucket=configs.INFLUXDB_BUCKET,
        org=configs.INFLUXDB_ORG
    )
    service = DeviceService(influxdb_repository=influxdb_repository)

    background_tasks.add_task(service.fetch_and_store, request.ip, request.username, request.password, request.command)
    return {"message": "Started monitoring the device"}


@router.get("/device_data/{ip}", response_model=DeviceDataResponse)
@inject
async def get_device_data(
    ip: str,
    service: DeviceService = Depends(Provide[Container.device_service]),
    current_user: User = Depends(get_current_active_user),
):
    influxdb_client = InfluxDBClient(
        url=configs.INFLUXDB_URL,
        token=configs.INFLUXDB_TOKEN,
        org=configs.INFLUXDB_ORG
    )
    influxdb_repository = InfluxDBRepository(
        client=influxdb_client,
        bucket=configs.INFLUXDB_BUCKET,
        org=configs.INFLUXDB_ORG
    )
    service = DeviceService(influxdb_repository=influxdb_repository)

    return await service.get_device_data(ip)




