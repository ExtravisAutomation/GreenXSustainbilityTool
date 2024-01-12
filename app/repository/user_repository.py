from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from app.model.user import User
from app.repository.base_repository import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, User)

    def clear_user_token(self, user_id: int):
        with self.session_factory() as session:
            session.query(User).filter(User.id == user_id).update({"user_token": ""})
            session.commit()
