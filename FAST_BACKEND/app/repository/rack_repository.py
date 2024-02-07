import sys
from contextlib import AbstractContextManager
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Callable, List
from app.model.rack import Rack
from app.schema.rack_schema import RackCreate
from app.repository.base_repository import BaseRepository

from app.schema.rack_schema import RackUpdate


class RackRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        super().__init__(session_factory, Rack)

    def get_all_racks(self) -> List[Rack]:
        with self.session_factory() as session:
            return list(session.query(Rack).all())

    def add_rack(self, rack_data: RackCreate) -> Rack:
        with self.session_factory() as session:
            new_rack = Rack(**rack_data.dict())
            session.add(new_rack)
            session.commit()
            session.refresh(new_rack)
            return new_rack

    def update_rack(self, rack_id: int, rack_data: RackUpdate) -> Rack:
        with self.session_factory() as session:
            rack = session.get(Rack, rack_id)
            if not rack:
                raise HTTPException(status_code=404, detail="Rack not found")
            for key, value in rack_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(rack, key, value)

            session.commit()
            session.refresh(rack)  # Refresh the instance to ensure it's fully loaded
            return rack

    def delete_rack(self, rack_id: int):
        with self.session_factory() as session:
            rack = session.query(Rack).filter(Rack.id == rack_id).first()
            if rack is None:
                raise HTTPException(status_code=404, detail="Rack not found")
            session.delete(rack)
            session.commit()

    def delete_racks(self, rack_ids: List[int]):
        with self.session_factory() as session:
            session.query(Rack).filter(Rack.id.in_(rack_ids)).delete(synchronize_session='fetch')
            session.commit()
