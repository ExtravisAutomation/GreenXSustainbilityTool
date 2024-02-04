from typing import Dict, List

from fastapi import HTTPException, status
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository  # Adjust the import
from app.schema.site_schema import SiteCreate, SiteUpdate, GetSitesResponse, SiteDetails
import traceback

from app.schema.site_schema import SiteDetails1


class SiteService:
    def __init__(self, site_repository: SiteRepository):
        self.site_repository = site_repository

    def get_sites(self) -> List[SiteDetails]:
        sites = self.site_repository.get_all_sites()
        return [SiteDetails(**site.__dict__) for site in sites]

    def create_site(self, site_data: SiteCreate) -> SiteDetails:
        site = self.site_repository.add_site(site_data)
        return SiteDetails(**site.__dict__)

    # def update_site(self, id: int, site_data: SiteUpdate) -> SiteDetails1:
    #     site = self.site_repository.update_site(id, site_data)
    #     updated_site_data = {k: v for k, v in site.__dict__.items() if v is not None}
    #     return SiteDetails1(**updated_site_data)

    def update_site(self, id: int, site_data: SiteUpdate) -> SiteDetails1:
        updated_site = self.site_repository.update_site(id, site_data)
        return SiteDetails1(
            id=updated_site.id,
            site_name=updated_site.site_name,
            site_type=updated_site.site_type,
            region=updated_site.region,
            city=updated_site.city,
            latitude=updated_site.latitude,
            longitude=updated_site.longitude,
            status=updated_site.status,
            total_devices=updated_site.total_devices
        )

    def delete_site(self, site_id: int) -> str:
        self.site_repository.delete_site(site_id)
        return {"message": "Site deleted successfully"}

    def delete_sites(self, site_ids: List[int]) -> str:
        self.site_repository.delete_sites(site_ids)
        return "Sites deleted successfully"
