from typing import Dict, List

from fastapi import HTTPException, status
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from app.repository.rack_repository import RackRepository  # Adjust the import
from app.schema.rack_schema import RackCreate, RackUpdate, GetRackResponse, RackDetails
import traceback


class RackService:
    def __init__(self, rack_repository: RackRepository):
        self.rack_repository = rack_repository

    def get_racks(self) -> GetRackResponse:
        results = self.rack_repository.get_racks_with_site_name()
        racks_details = [RackDetails(**result) for result in results]
        return GetRackResponse(racks=racks_details)

    def create_rack(self, rack_data: RackCreate) -> dict:
        try:
            result = self.rack_repository.add_rack(rack_data)

            return {
                "message": f"Rack with name {rack_data.name} created successfully",
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

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> dict:
        try:
            return self.rack_repository.update_rack(rack_id, rack_data)
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    def delete_rack(self, rack_id: int) -> dict:
        try:
            result = self.rack_repository.delete_rack(rack_id)

            return {
                "message": f"Rack with id {rack_id} deleted successfully",
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
