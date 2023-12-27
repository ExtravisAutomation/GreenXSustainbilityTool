from typing import Optional, List
from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel


class SiteDetails(BaseModel):
    id: int
    name: str
    status: str
    facility: str
    region: str


class GetSitesResponse(BaseModel):
    sites: List[SiteDetails]


class SiteBase(BaseModel):
    name: str
    status: str
    facility: str
    region: str


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    facility: Optional[str] = None
    region: Optional[str] = None


class Site(ModelBaseInfo, SiteBase):
    pass


class FindSite(FindBase, SiteBase):
    pass


class UpsertSite(SiteBase):
    pass


class FindSiteResult(FindResult):
    founds: Optional[List[Site]]
    search_options: Optional[SearchOptions]
