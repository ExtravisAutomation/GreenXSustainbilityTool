from contextlib import AbstractContextManager
from typing import Callable, Dict, List

from sqlalchemy.engine import Row
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.model.site import Site
from app.repository.base_repository import BaseRepository
from sqlmodel import select, delete

from app.schema.site_schema import GetSitesResponse, SiteUpdate

from app.schema.site_schema import SiteCreate


class SiteRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Site)

    # def test_func(self) -> dict[str, list[Row]]:
    #     with self.session_factory() as session:
    #         res = session.execute("select * from site")
    #         results = res.fetchall()
    #         return {
    #             "results": results,
    #         }

    def get_all_sites(self) -> list[Site]:
        with self.session_factory() as session:
            return session.query(Site).all()

    def add_site(self, site_data: SiteCreate) -> Site:
        with self.session_factory() as session:
            new_site = Site(**site_data.dict())
            session.add(new_site)
            session.commit()
            session.refresh(new_site)
            return new_site

    def update_site(self, id: int, site_data: SiteUpdate) -> Site:
        with self.session_factory() as session:
            db_site = session.get(Site, id)
            if not db_site:
                raise HTTPException(status_code=404, detail="Site not found")

            # Update logic...
            for key, value in site_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(db_site, key, value)

            session.commit()

            session.refresh(db_site)
            return db_site

    def delete_site(self, site_id: int):
        with self.session_factory() as session:
            db_site = session.get(Site, site_id)
            if db_site is None:
                raise HTTPException(status_code=404, detail="Site not found")

            session.delete(db_site)
            session.commit()

    def delete_sites(self, site_ids: List[int]):
        with self.session_factory() as session:
            session.query(Site).filter(Site.id.in_(site_ids)).delete(synchronize_session='fetch')
            session.commit()