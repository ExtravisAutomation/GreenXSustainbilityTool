from contextlib import AbstractContextManager
from typing import Callable, Dict, List

from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.model.site import Site
from app.repository.base_repository import BaseRepository
from sqlmodel import select, delete

from app.schema.site_schema import GetSitesResponse, SiteUpdate


class SiteRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Site)

    def test_func(self) -> dict[str, list[Row]]:
        with self.session_factory() as session:
            res = session.execute("select * from site")
            results = res.fetchall()
            return {
                "results": results,
            }

    def add_site(self, site_data: dict) -> dict:
        try:
            with self.session_factory() as session:
                existing_site = session.execute(select(Site).where(Site.name == site_data['name'])).first()
                if existing_site:
                    raise ValueError(f"Site with name '{site_data['name']}' already exists.")

                new_site = Site(**site_data)

                session.add(new_site)
                session.commit()

                return {
                    "site_id": new_site.id,
                    "name": new_site.name,
                    "status": new_site.status,
                    "facility": new_site.facility,
                    "region": new_site.region,
                }

        except Exception as e:
            print(f"Error while adding a site: {e}")

            # Rollback the transaction in case of an error
            session.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error",
            )

    def update_site(self, site_id: int, site_data: SiteUpdate) -> dict:
        try:
            with self.session_factory() as session:
                db_site = session.get(Site, site_id)

                if not db_site:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Site with id {site_id} not found.",
                    )

                for field, value in site_data.dict().items():
                    if value is not None and value != 'string':
                        setattr(db_site, field, value)

                session.commit()

                return {
                    "site_id": db_site.id,
                    "name": db_site.name,
                    "status": db_site.status,
                    "facility": db_site.facility,
                    "region": db_site.region,
                }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            print(f"Error while updating a site: {e}")

            # Rollback the transaction in case of an error
            session.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error",
            )

    def delete_site(self, site_id: int) -> dict:
        try:
            with self.session_factory() as session:
                db_site = session.execute(select(Site).where(Site.id == site_id)).first()

                if not db_site:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Site with id {site_id} not found.",
                    )

                session.execute(delete(Site).where(Site.id == site_id))
                session.commit()

                return {
                    "message": "Null",
                }

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            print(f"Error while deleting a site: {e}")

            # Rollback the transaction in case of an error
            session.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error",
            )
