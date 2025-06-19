from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.model.user import Role

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

