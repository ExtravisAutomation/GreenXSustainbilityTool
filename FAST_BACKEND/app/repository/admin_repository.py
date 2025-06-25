from contextlib import AbstractContextManager
from typing import Callable, List
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.model.user import Role,DashboardModule,UserModulesAccess,User
from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _hash_password(raw: str) -> str:
    return pwd_context.hash(raw)

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

    def add_module(self, module_data) -> DashboardModule:
        with self.session_factory() as session:
            new_module = DashboardModule(**module_data.dict())
            session.add(new_module)
            session.commit()
            session.refresh(new_module)
            return new_module

    def update_module(self, id: int, module_data) -> DashboardModule:
        with self.session_factory() as session:
            db_module = session.get(DashboardModule, id)
            if not db_module:
                raise HTTPException(status_code=404, detail="Site not found")

            for key, value in module_data.dict(exclude_unset=True).items():
                if value is not None and value != '' and value != 'string':
                    setattr(db_module, key, value)

            session.commit()

            session.refresh(db_module)
            return db_module

    def get_module(self):
        with self.session_factory() as session:
            modules = session.query(DashboardModule).all()
            return modules

    def delete_module(self, module_id: int):
        with self.session_factory() as session:
            db_module = session.get(DashboardModule, module_id)
            if db_module is None:
                raise HTTPException(status_code=404, detail="Site not found")
            session.delete(db_module)
            session.commit()
    def add_user_access(self, user_data):
        with self.session_factory() as session:

            existing = (
                session.query(User)
                .filter(
                    (User.email == user_data.email.lower()) |
                    (User.username == user_data.username)
                )
                .first()
            )

            if existing:
                raise HTTPException(status_code=400, detail="Email or Username already exists.")

            user_token = get_rand_hash()
            user = User(
                email=user_data.email.lower(),
                password=_hash_password(user_data.password),
                name=user_data.name,
                username=user_data.username,
                user_token=user_token,
                role_id=user_data.role_id,
                is_active=(user_data.status.lower() == "active"),
            )
            session.add(user)
            session.flush()
            modules: List[DashboardModule] = (
                session.query(DashboardModule)
                .filter(DashboardModule.id.in_(user_data.module_ids))
                .all()
            )
            missing = set(user_data.module_ids) - {m.id for m in modules}
            if missing:
                raise ValueError(f"Unknown module IDs: {missing}")
            # 3. Build bridge rows (bulk add for speed)
            session.add_all(
                UserModulesAccess(user_id=user.id, module_id=m.id) for m in modules
            )
            # 4. Commit once
            session.commit()
            session.refresh(user)

            # 5. Return DTO
            return {
                "id":user.id,
                "email":user.email,
                "name":user.name,
                "username":user.username,

                "role_id":user.role_id,
                "module_ids":[ua.module_id for ua in user.module_accesses],
            }

    def update_user_access(self, user_id: int, update_data):
        with self.session_factory() as session:
            user = session.get(User, user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")

            # Dup check
            if update_data.email or update_data.username:
                dup_q = session.query(User).filter(User.id != user_id)
                if update_data.email:
                    dup_q = dup_q.filter(User.email == update_data.email.lower())
                if update_data.username:
                    dup_q = dup_q.filter(User.username == update_data.username)
                if session.query(dup_q.exists()).scalar():
                    raise HTTPException(400, "Email or Username already in use.")

            # Field updates
            if update_data.email:
                user.email = update_data.email.lower()
            if update_data.username:
                user.username = update_data.username
            if update_data.password:
                user.password = _hash_password(update_data.password)
            if update_data.name:
                user.name = update_data.name
            if update_data.role_id is not None:
                user.role_id = update_data.role_id
            if update_data.status is not None:
                user.is_active = (update_data.status.lower() == "active")

            # Module resync
            if update_data.module_ids is not None:
                modules = session.query(DashboardModule).filter(DashboardModule.id.in_(update_data.module_ids)).all()
                missing = set(update_data.module_ids) - {m.id for m in modules}
                if missing:
                    raise HTTPException(400, f"Invalid module IDs: {missing}")

                current_ids = {ua.module_id for ua in user.module_accesses}
                desired_ids = set(update_data.module_ids)

                # Delete removed
                if current_ids - desired_ids:
                    session.query(UserModulesAccess).filter(
                        UserModulesAccess.user_id == user.id,
                        UserModulesAccess.module_id.in_(current_ids - desired_ids)
                    ).delete(synchronize_session=False)

                # Add new
                for new_id in desired_ids - current_ids:
                    session.add(UserModulesAccess(user_id=user.id, module_id=new_id))

            session.commit()
            session.refresh(user)

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "username": user.username,
                "role_id": user.role_id,
                "module_ids": [ua.module_id for ua in user.module_accesses],
            }

    def delete_user_access(self, user_id: int) -> dict:
        with self.session_factory() as session:
            user = session.get(User, user_id)
            if not user:
                raise HTTPException(404, "User not found.")
            # Step 1: Delete module access entries manually
            session.query(UserModulesAccess).filter(
                UserModulesAccess.user_id == user_id
            ).delete(synchronize_session=False)
            # Step 2: Delete the user
            session.delete(user)
            try:
                session.commit()
                return {"detail": "User and their module accesses deleted successfully."}
            except IntegrityError:
                session.rollback()
                raise HTTPException(500, "Failed to delete user and module accesses.")
