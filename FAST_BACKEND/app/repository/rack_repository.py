# from contextlib import AbstractContextManager
# from typing import Callable, List, Any
#
# from sqlalchemy.engine import Row
# from sqlalchemy.orm import Session, joinedload
# from fastapi import HTTPException, status
# from app.model.rack import Rack
# from app.repository.base_repository import BaseRepository
# from sqlmodel import select, delete
# from app.model.site import Site
# from app.schema.rack_schema import RackUpdate, RackCreate
#
#
# class RackRepository(BaseRepository):
#     def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
#         self.session_factory = session_factory
#         super().__init__(session_factory, Rack)
#
#     def get_racks_with_site_name(self) -> List[dict[str, Any]]:
#         with self.session_factory() as session:
#
#             racks = session.query(Rack).options(joinedload(Rack.site)).all()
#             results = []
#             for rack in racks:
#                 rack_dict = {column.name: getattr(rack, column.name) for column in rack.__table__.columns}
#                 rack_dict["site_name"] = rack.site.name if rack.site else None
#                 results.append(rack_dict)
#             return results
#
#     def add_rack(self, rack_data: RackCreate) -> dict:
#         try:
#             with self.session_factory() as session:
#                 existing_site = session.query(Site).filter(Site.id == rack_data.site_id).first()
#                 if not existing_site:
#                     raise HTTPException(
#                         status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Site with id '{rack_data.site_id}' not found.",
#                     )
#
#                 existing_rack = session.query(Rack).filter(Rack.name == rack_data.name).first()
#                 if existing_rack:
#                     raise HTTPException(
#                         status_code=status.HTTP_409_CONFLICT,
#                         detail=f"Rack with name '{rack_data.name}' already exists.",
#                     )
#
#                 new_rack = Rack(**rack_data.dict())
#                 session.add(new_rack)
#                 session.commit()
#                 session.refresh(new_rack)
#
#                 # Convert the new rack object to a dictionary
#                 new_rack_dict = {column.name: getattr(new_rack, column.name) for column in new_rack.__table__.columns}
#                 new_rack_dict["site_name"] = existing_site.name  # Add site name
#
#                 return new_rack_dict
#
#         except HTTPException as http_exc:
#             raise http_exc
#
#         except Exception as e:
#             session.rollback()
#             print(f"Error while adding a rack: {e}")
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=str(e),
#             )
#         finally:
#             session.close()
#
#     # def add_rack(self, rack_data: RackCreate) -> dict:
#     #     try:
#     #         with self.session_factory() as session:
#     #
#     #             existing_site = session.execute(select(Site).where(Site.id == rack_data.site_id)).first()
#     #             print("existing_site.............", existing_site)
#     #             if not existing_site:
#     #                 raise HTTPException(
#     #                     status_code=status.HTTP_404_NOT_FOUND,
#     #                     detail=f"Site with id '{rack_data.site_id}' not found.",
#     #                 )
#     #
#     #             existing_rack = session.execute(select(Rack).where(Rack.name == rack_data.name)).first()
#     #             if existing_rack:
#     #                 raise HTTPException(
#     #                     status_code=status.HTTP_409_CONFLICT,
#     #                     detail=f"Rack with name '{rack_data.name}' already exists.",
#     #                 )
#     #
#     #             new_rack = Rack(**rack_data.dict())
#     #
#     #             session.add(new_rack)
#     #             session.commit()
#     #
#     #             return {
#     #                 "rack_id": new_rack.id,
#     #                 "name": new_rack.name,
#     #                 "location": new_rack.location,
#     #                 "height": new_rack.height,
#     #                 "devices": new_rack.devices,
#     #                 "space": new_rack.space,
#     #                 "power": new_rack.power,
#     #                 "role": new_rack.role,
#     #                 "site_id": new_rack.site_id,
#     #                 "site_name": existing_site.name,
#     #             }
#     #
#     #     except HTTPException as http_exc:
#     #         raise http_exc
#     #
#     #     except Exception as e:
#     #         print(f"Error while adding a rack: {e}")
#     #
#     #         session.rollback()
#     #
#     #         raise HTTPException(
#     #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#     #             detail="Internal Server Error",
#     #         )
#     #
#     #     finally:
#     #         session.close()
#
#     def update_rack(self, rack_id: int, rack_data: RackUpdate) -> dict:
#         try:
#             with self.session_factory() as session:
#
#                 db_rack = session.get(Rack, rack_id)
#
#                 if not db_rack:
#                     raise HTTPException(
#                         status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Rack with ID {rack_id} not found.",
#                     )
#
#                 # Update only the fields that are provided
#                 for field, value in rack_data.dict().items():
#                     if value is not None and value != 'string':
#                         setattr(db_rack, field, value)
#
#                 session.commit()
#
#                 return {
#                     "rack_id": db_rack.id,
#                     "name": db_rack.name,
#                     "location": db_rack.location,
#                     "height": db_rack.height,
#                     "devices": db_rack.devices,
#                     "space": db_rack.space,
#                     "power": db_rack.power,
#                     "role": db_rack.role,
#                 }
#
#         except HTTPException as http_exc:
#             raise http_exc
#
#         except Exception as e:
#             print(f"Error while updating a rack: {e}")
#
#             session.rollback()
#
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Internal Server Error",
#             )
#
#     def delete_rack(self, rack_id: int) -> dict:
#         try:
#             with self.session_factory() as session:
#                 db_rack = session.execute(select(Rack).where(Rack.id == rack_id)).first()
#
#                 if not db_rack:
#                     raise HTTPException(
#                         status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Rack with ID {rack_id} not found.",
#                     )
#
#                 session.execute(delete(Rack).where(Rack.id == rack_id))
#                 session.commit()
#
#                 return {
#                     "message": "Null",
#                 }
#
#         except HTTPException as http_exc:
#             raise http_exc
#
#         except Exception as e:
#             print(f"Error while deleting a rack: {e}")
#
#             session.rollback()
#
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Internal Server Error",
#             )
