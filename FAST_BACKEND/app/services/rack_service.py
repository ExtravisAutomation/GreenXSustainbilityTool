from typing import List
from fastapi import HTTPException

from app.schema.rack_schema import RackCreate, RackUpdate, RackDetails, CustomResponse_rack, GetRacksResponse
from app.repository.rack_repository import RackRepository  

from app.schema.building_schema import BuildingDetails, BuildingUpdate, BuildingCreate


class RackService:
    def __init__(self, rack_repository: RackRepository):
        self.rack_repository = rack_repository

    def get_racks(self) -> List[RackDetails]:
        racks = self.rack_repository.get_all_racks()
        
        
        return racks
        
        
        
        


    def get_specific_racks(self, rack_id: int, site_id: int):
        racks = self.rack_repository.get_specific_racks(rack_id, site_id)
        return racks


    def create_rack(self, rack_data: RackCreate) -> RackDetails:
        try:
            rack = self.rack_repository.add_rack(rack_data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        return RackDetails.from_orm(rack)

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> RackDetails:
        rack = self.rack_repository.update_rack(rack_id, rack_data)
        
        return RackDetails.from_orm(rack)

    def delete_rack(self, rack_ids: List[int]) -> None:
        self.rack_repository.delete_rack(rack_ids)
        

    def delete_racks(self, rack_ids: List[int]) -> None:
        self.rack_repository.delete_racks(rack_ids)
        
        
    def get_rack_last_power_utilization(self, rack_id: int):
        rack = self.rack_repository.get_rack_last_power_utilization(rack_id)
        return rack
    
    def get_rack_power_utilization(self, rack_id: int):
        rack = self.rack_repository.get_rack_power_utilization(rack_id)
        return rack

    def create_building(self, building_data: BuildingCreate) -> BuildingDetails:
        return BuildingDetails.from_orm(self.rack_repository.create_building(building_data))

    def get_building(self, building_id: int) -> BuildingDetails:
        building = self.rack_repository.get_building(building_id)
        return BuildingDetails.from_orm(building) if building else None

    def get_all_buildings(self) -> List[BuildingDetails]:
        buildings = self.rack_repository.get_all_buildings()
        return [BuildingDetails.from_orm(b) for b in buildings]

    def update_building(self, building_id: int, update_data: BuildingUpdate) -> BuildingDetails:
        building = self.rack_repository.update_building(building_id, update_data)
        return BuildingDetails.from_orm(building) if building else None

    def delete_building(self, building_id: int) -> bool:
        return self.rack_repository.delete_building(building_id)

    def delete_multiple_buildings(self, building_ids: List[int]) -> List[int]:
        return self.rack_repository.delete_multiple_buildings(building_ids)