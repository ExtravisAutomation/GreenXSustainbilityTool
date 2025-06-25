from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.model.user import Role
from fastapi import HTTPException, status
import logging

# Configure logging
logging.basicConfig(
    filename='ai_repository.log',  # Log file name
    filemode='a',  # Append mode
    level=logging.DEBUG,  # Log level
    format='%(asctime)s - %(levelname)s - %(message)s'  # Log format
)

class AdminPanelRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 ):
        self.session_factory = session_factory
        super().__init__(session_factory, Role)

    def add_role(self, role_data) -> Role:
        with self.session_factory() as session:
            new_role = Role(**role_data.dict())
            session.add(new_role)
            session.commit()
            session.refresh(new_role)
            return new_role
    def update_role(self, id: int, role_data) -> Role:
        with self.session_factory() as session:
            db_role = session.get(Role, id)
            if not db_role:
                raise HTTPException(status_code=404, detail="Site not found")

            for key, value in role_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(db_role, key, value)

            session.commit()

            session.refresh(db_role)
            return db_role
    def get_role(self):
        with self.session_factory() as session:
            roles=session.query(Role).all()
            return roles
    def delete_role(self, role_id: int):
        with self.session_factory() as session:
            db_role = session.get(Role, role_id)
            if db_role is None:
                raise HTTPException(status_code=404, detail="Site not found")
            session.delete(db_role)
            session.commit()