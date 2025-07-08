from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.model.user import Role,DashboardModule,UserModulesAccess,User
from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash
from app.schema.admin_schema import UserWithModulesRead
import logging


# Configure logging
logging.basicConfig(
    filename='ai_repository.log',  # Log file name
    filemode='a',  # Append mode
    level=logging.DEBUG,  # Log level
    format='%(asctime)s - %(levelname)s - %(message)s'  # Log format
)

class ComparisonRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 ):
        self.session_factory = session_factory
        super().__init__(session_factory, Role)