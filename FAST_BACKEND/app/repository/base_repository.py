from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.config import configs
from app.core.exceptions import DuplicatedError, NotFoundError
from app.util.query_builder import dict_to_sqlalchemy_filter_options
from app.model.user import User,Role,DashboardModule,UserModulesAccess

class BaseRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], model) -> None:
        self.session_factory = session_factory
        self.model = model

    def read_by_options(self, schema, eager=False):
        with self.session_factory() as session:
            schema_as_dict = schema.dict(exclude_none=True)
            ordering = schema_as_dict.get("ordering", configs.ORDERING)
            order_query = (
                getattr(self.model, ordering[1:]).desc()
                if ordering.startswith("-")
                else getattr(self.model, ordering).asc()
            )
            filter_options = dict_to_sqlalchemy_filter_options(self.model, schema.dict(exclude_none=True))

            if "user_name" in schema_as_dict:
                filter_options = filter_options & (self.model.username == schema_as_dict['user_name'])

            query = session.query(self.model)
            if eager:
                for eager in getattr(self.model, "eagers", []):
                    query = query.options(joinedload(getattr(self.model, eager)))
            filtered_query = query.filter(filter_options)
            query = filtered_query.order_by(order_query)
            user = query.first() 
            total_count = filtered_query.count() if user else 0
            return {
                "found": user,
                "search_options": {
                    "ordering": ordering,
                    "total_count": total_count,
                },
            }

    def read_by_id(self, id: int, eager=False):
        with self.session_factory() as session:
            query = session.query(self.model)
            if eager:
                for eager in getattr(self.model, "eagers", []):
                    query = query.options(joinedload(getattr(self.model, eager)))
            query = query.filter(self.model.id == id).first()
            if not query:
                raise NotFoundError(detail=f"not found id : {id}")
            return query

    def create(self, schema):
        with self.session_factory() as session:

            columns = [column.key for column in self.model.__table__.columns]

            model_data = {column: getattr(schema, column) for column in columns}

            query = self.model(**model_data)
            try:
                session.add(query)
                session.commit()
                session.refresh(query)
            except IntegrityError as e:
                raise DuplicatedError(detail=str(e.orig))
            return query

    def update(self, id: int, schema):
        with self.session_factory() as session:
            session.query(self.model).filter(self.model.id == id).update(schema.dict(exclude_none=True))
            session.commit()
            return self.read_by_id(id)

    def update_attr(self, id: int, column: str, value):
        with self.session_factory() as session:
            session.query(self.model).filter(self.model.id == id).update({column: value})
            session.commit()
            return self.read_by_id(id)

    def whole_update(self, id: int, schema):
        with self.session_factory() as session:
            session.query(self.model).filter(self.model.id == id).update(schema.dict())
            session.commit()
            return self.read_by_id(id)

    def delete_by_id(self, id: int):
        with self.session_factory() as session:
            query = session.query(self.model).filter(self.model.id == id).first()
            if not query:
                raise NotFoundError(detail=f"not found id : {id}")
            session.delete(query)
            session.commit()


    def get_data_modules(self, user_id: int, role_id:int):
        with self.session_factory() as session:
            role_name=session.query(Role.role_name).filter(Role.id== role_id).scalar()
            modules=session.query(DashboardModule.modules_name).\
        join(UserModulesAccess, DashboardModule.id == UserModulesAccess.module_id).\
        filter(UserModulesAccess.user_id == user_id).\
        all()
            modules = [module.modules_name for module in modules]

            return role_name, modules