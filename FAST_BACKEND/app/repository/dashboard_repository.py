from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.repository.dataquery_repository import DataQueryRepository
from app.repository.site_repository import SiteRepository
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash


class DashboardRepository(object):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 dataquery_repository: DataQueryRepository,site_repository: SiteRepository,):
        self.session_factory = session_factory
        self.dataquery_repository = dataquery_repository
        self.site_repository = site_repository



    def get_sites_info(self, site_id: int):
        return f"this is  a site id : {site_id}"

