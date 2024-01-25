from app.schema.base_schema import ModelBaseInfo, FindBase, SearchOptions, FindResult, Blank
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List
from pydantic.generics import GenericModel

DataT = TypeVar('DataT')


class SiteBase(BaseModel):
    site_name: str
    site_type: str
    region: str
    city: str
    latitude: str
    longitude: str
    status: str
    total_devices: str


class SiteDetails(SiteBase):
    id: int


class GetSitesResponse(BaseModel):
    sites: List[SiteDetails]


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    site_name: Optional[str] = None
    site_type: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    status: Optional[str] = None
    total_devices: Optional[str] = None


class Site(ModelBaseInfo, SiteBase):
    pass


class FindSite(FindBase, SiteBase):
    pass


class UpsertSite(SiteBase):
    pass


class FindSiteResult(FindResult):
    founds: Optional[List[Site]]
    search_options: Optional[SearchOptions]


class CustomResponse(GenericModel, Generic[DataT]):
    message: str
    data: Optional[DataT]
    status_code: int


T = TypeVar("T")

class CustomResponse1(BaseModel, Generic[T]):
    message: str
    data: T
    status_code: int