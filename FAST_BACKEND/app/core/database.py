from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator


@as_declarative()
class BaseModel:
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class Database:
    def __init__(self, db_url: str) -> None:
        """Initialize the async database engine and session factory."""
        self._engine = create_async_engine(db_url, echo=True)  # Use async engine
        self._session_factory = sessionmaker(
            bind=self._engine,
            expire_on_commit=False,  # Prevent expiration of objects after commit
            class_=AsyncSession  # Use AsyncSession explicitly
        )

    async def create_database(self) -> None:
        """Create database tables asynchronously."""
        async with self._engine.begin() as conn:
            await conn.run_sync(BaseModel.metadata.create_all)

    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """Provide an async session for database operations."""
        async with self._session_factory() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()










# from contextlib import AbstractContextManager, contextmanager
# from typing import Any, Callable
#
# from sqlalchemy import create_engine, orm
# from sqlalchemy.ext.declarative import as_declarative, declared_attr
# from sqlalchemy.orm import Session
#
#
# @as_declarative()
# class BaseModel:
#     id: Any
#     __name__: str
#
#     # Generate __tablename__ automatically
#     @declared_attr
#     def __tablename__(cls) -> str:
#         return cls.__name__.lower()
#
#
# class Database:
#     def __init__(self, db_url: str) -> None:
#         self._engine = create_engine(db_url, echo=True)
#         self._session_factory = orm.scoped_session(
#             orm.sessionmaker(
#                 autocommit=False,
#                 autoflush=False,
#                 bind=self._engine,
#             ),
#         )
#
#     def create_database(self) -> None:
#         BaseModel.metadata.create_all(self._engine)
#
#     @contextmanager
#     def session(self) -> Callable[..., AbstractContextManager[Session]]:
#         session: Session = self._session_factory()
#         try:
#             yield session
#         except Exception:
#             session.rollback()
#             raise
#         finally:
#             session.close()
