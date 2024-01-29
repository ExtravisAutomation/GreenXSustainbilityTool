# from contextlib import AbstractContextManager
# from typing import Callable, List, Any
#
# from sqlalchemy import func, select, delete
# from sqlalchemy.orm import Session, joinedload
# from fastapi import HTTPException, status
# from app.model.location import Location
# from app.model.site import Site
# from app.model.rack import Rack
# from app.repository.base_repository import BaseRepository
# from app.schema.location_schema import LocationCreate, LocationUpdate
#
#
# class LocationRepository(BaseRepository):
#     def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
#         self.session_factory = session_factory
#         super().__init__(session_factory, Location)
#
#     def get_locations_with_details(self) -> List[dict[str, Any]]:
#         with self.session_factory() as session:
#             locations = session.query(Location).options(joinedload(Location.site), joinedload(Location.rack)).all()
#             results = []
#             for location in locations:
#                 location_dict = {column.name: getattr(location, column.name) for column in location.__table__.columns}
#                 location_dict["site_name"] = location.site.name if location.site else None
#                 location_dict["rack_name"] = location.rack.name if location.rack else None
#                 # Counting racks with the same location name
#                 rack_count = session.query(func.count(Rack.id)).filter(Rack.location == location.name).scalar()
#                 location_dict["rack_count"] = rack_count
#                 results.append(location_dict)
#             return results
#
#     def add_location(self, location_data: LocationCreate) -> dict[str, Any]:
#         with self.session_factory() as session:
#             new_location = Location(**location_data.dict())
#             session.add(new_location)
#             session.commit()
#             session.refresh(new_location)
#             return {column.name: getattr(new_location, column.name) for column in new_location.__table__.columns}
#
#     def update_location(self, location_id: int, location_data: LocationUpdate) -> Dict[str, Any]:
#         with self.session_factory() as session:
#             location = session.query(Location).filter(Location.id == location_id).first()
#             if location:
#                 for field, value in location_data.dict().items():
#                     setattr(location, field, value)
#                 session.commit()
#                 return {column.name: getattr(location, column.name) for column in location.__table__.columns}
#             else:
#                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
#
#     def delete_location(self, location_id: int) -> dict[str, Any]:
#         with self.session_factory() as session:
#             location = session.query(Location).filter(Location.id == location_id).first()
#             if location:
#                 session.delete(location)
#                 session.commit()
#                 return {"message": f"Location with ID {location_id} deleted successfully"}
#             else:
#                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
