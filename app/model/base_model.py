# from datetime import datetime
#
# from sqlmodel import Column, DateTime, Field, SQLModel, func
#
#
# class BaseModel(SQLModel):
#     id: int = Field(primary_key=True)
#     created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=func.now()))
#     updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=func.now(), onupdate=func.now()))


from sqlalchemy import Column, DateTime, Integer, func
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
