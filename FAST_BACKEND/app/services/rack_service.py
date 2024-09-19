from typing import List
from fastapi import HTTPException

from app.schema.rack_schema import RackCreate, RackUpdate, RackDetails, CustomResponse_rack, GetRacksResponse
from app.repository.rack_repository import RackRepository  # Adjust import path as necessary


class RackService:
    def __init__(self, rack_repository: RackRepository):
        self.rack_repository = rack_repository

    def get_racks(self) -> List[RackDetails]:
        racks = self.rack_repository.get_all_racks()
        
        # New Code
        return racks
        
        # Old Code 
        # Convert the ORM models to schema models
        # return [RackDetails.from_orm(rack) for rack in racks]

    def create_rack(self, rack_data: RackCreate) -> RackDetails:
        rack = self.rack_repository.add_rack(rack_data)
        # Ensure the response is of type RackDetails
        return RackDetails.from_orm(rack)

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> RackDetails:
        rack = self.rack_repository.update_rack(rack_id, rack_data)
        # Ensure the response is of type RackDetails
        return RackDetails.from_orm(rack)

    def delete_rack(self, rack_id: int) -> None:
        self.rack_repository.delete_rack(rack_id)
        # Since delete operations don't return a model, no conversion is necessary here

    def delete_racks(self, rack_ids: List[int]) -> None:
        self.rack_repository.delete_racks(rack_ids)
        
        
    def get_rack_last_power_utilization(self, rack_id: int):
        rack = self.rack_repository.get_rack_last_power_utilization(rack_id)
        return rack
    
    def get_rack_power_utilization(self, rack_id: int):
        rack = self.rack_repository.get_rack_power_utilization(rack_id)
        return rack
