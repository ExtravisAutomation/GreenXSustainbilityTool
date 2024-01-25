from typing import Dict, List

from fastapi import HTTPException, status
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.site_repository import SiteRepository  # Adjust the import
from app.schema.site_schema import SiteCreate, SiteUpdate, GetSitesResponse, SiteDetails
import traceback


class SiteService:
    def __init__(self, site_repository: SiteRepository):
        self.site_repository = site_repository

    def get_sites(self) -> List[SiteDetails]:
        sites = self.site_repository.get_all_sites()
        return [SiteDetails(**site.__dict__) for site in sites]

    def create_site(self, site_data: SiteCreate) -> SiteDetails:
        site = self.site_repository.add_site(site_data)
        return SiteDetails(**site.__dict__)

    def update_site(self, site_id: int, site_data: SiteUpdate) -> SiteDetails:
        site = self.site_repository.update_site(site_id, site_data)
        return SiteDetails(**site.__dict__)

    def delete_site(self, site_id: int) -> str:
        self.site_repository.delete_site(site_id)
        return {"message": "Site deleted successfully"}

