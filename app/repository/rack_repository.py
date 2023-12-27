from contextlib import AbstractContextManager
from typing import Callable, List

from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.model.rack import Rack
from app.repository.base_repository import BaseRepository
from sqlmodel import select, delete
from app.model.site import Site
from app.schema.rack_schema import RackUpdate, RackCreate


class RackRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Rack)

    def test_func(self) -> dict[str, List[Row]]:
        with self.session_factory() as session:
            res = session.execute("select * from rack")
            results = res.fetchall()
            return {
                "results": results,
            }

    def add_rack(self, rack_data: RackCreate) -> dict:
        try:
            with self.session_factory() as session:
                # Check if the associated site exists
                existing_site = session.execute(select(Site).where(Site.id == rack_data.site_id)).first()
                print("existing_site.............", existing_site)
                if not existing_site:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Site with id '{rack_data.site_id}' not found.",
                    )

                # Check if the rack already exists
                existing_rack = session.execute(select(Rack).where(Rack.name == rack_data.name)).first()
                if existing_rack:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Rack with name '{rack_data.name}' already exists.",
                    )

                # Create a new Rack instance and associate it with the site
                new_rack = Rack(**rack_data.dict())

                session.add(new_rack)
                session.commit()

                return {
                    "rack_id": new_rack.id,
                    "name": new_rack.name,
                    "location": new_rack.location,
                    "height": new_rack.height,
                    "devices": new_rack.devices,
                    "space": new_rack.space,
                    "power": new_rack.power,
                    "role": new_rack.role,
                    "site_id": new_rack.site_id,
                    "site_name": existing_site.name if existing_site else None,
                }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            print(f"Error while adding a rack: {e}")

            # Rollback the transaction in case of an error
            session.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error",
            )

        finally:
            session.close()

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> dict:
        try:
            with self.session_factory() as session:
                # Get the rack based on ID
                db_rack = session.get(Rack, rack_id)

                if not db_rack:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Rack with ID {rack_id} not found.",
                    )

                # Update only the fields that are provided
                for key, value in rack_data.dict().items():
                    if value is not None:
                        setattr(db_rack, key, value)

                session.commit()

                return {
                    "rack_id": db_rack.id,
                    "name": db_rack.name,
                    "location": db_rack.location,
                    "height": db_rack.height,
                    "devices": db_rack.devices,
                    "space": db_rack.space,
                    "power": db_rack.power,
                    "role": db_rack.role,
                }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            print(f"Error while updating a rack: {e}")

            # Rollback the transaction in case of an error
            session.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error",
            )

    # def delete_rack(self, rack_id: int) -> dict:
    #     try:
    #         with self.session_factory() as session:
    #             db_rack = session.execute(select(Rack).where(Rack.id == rack_id)).first()
    #
    #             if not db_rack:
    #                 raise HTTPException(
    #                     status_code=status.HTTP_404_NOT_FOUND,
    #                     detail=f"Rack with ID {rack_id} not found.",
    #                 )
    #
    #             session.execute(delete(Rack).where(Rack.id == rack_id))
    #             session.commit()
    #
    #             return {
    #                 "message": "Null",
    #             }
    #
    #     except HTTPException as http_exc:
    #         raise http_exc
    #
    #     except Exception as e:
    #         print(f"Error while deleting a rack: {e}")
    #
    #         # Rollback the transaction in case of an error
    #         session.rollback()
    #
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail="Internal Server Error",
    #         )
