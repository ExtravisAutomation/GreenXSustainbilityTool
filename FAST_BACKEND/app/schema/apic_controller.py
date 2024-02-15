from pydantic import BaseModel


class APICControllerBase(BaseModel):
    ip_address: str


class APICControllerCreate(APICControllerBase):
    pass


class APICController(APICControllerBase):
    id: int

    class Config:
        orm_mode = True
