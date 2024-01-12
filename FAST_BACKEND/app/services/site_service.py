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
        # super().__init__(site_repository)

    def get_sites(self) -> GetSitesResponse:
        results = self.site_repository.test_func()["results"]
        sites_details = [SiteDetails(**result) for result in results]
        return GetSitesResponse(sites=sites_details)

    def create_site(self, site_data: SiteCreate) -> dict:
        try:
            result = self.site_repository.add_site(site_data.dict())

            return {
                "message": f"Site with name {site_data.name} created successfully",
                "data": result
            }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            traceback.print_exc()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    def update_site(self, site_id: int, site_data: SiteUpdate) -> dict:
        try:
            result = self.site_repository.update_site(site_id, site_data)

            return {
                "message": f"Site with id {site_id} updated successfully",
                "data": result
            }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            traceback.print_exc()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    def delete_site(self, site_id: int) -> dict:
        try:
            result = self.site_repository.delete_site(site_id)

            return {
                "message": f"Site with id {site_id} deleted successfully",
                "data": result
            }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            traceback.print_exc()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

