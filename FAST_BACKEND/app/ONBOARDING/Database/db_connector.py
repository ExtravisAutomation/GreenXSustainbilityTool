import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql
load_dotenv()
# Base class for our classes definitions
# Base = declarative_base()
#
#
# class Database:
#     def __init__(self):
#         self.username = os.getenv('DB_USER')
#         self.password = os.getenv('DB_PASSWORD')
#         self.database = os.getenv('DB_NAME')
#         self.host = os.getenv('DB_HOST')
#         self.port = os.getenv('DB_PORT')
#         self.session = None
#         self.engine = None
#         self.Session = None
#
#     def connect(self):
#         """Create a database connection and session maker."""
#         try:
#             # Connection URL
#             database_url = f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
#
#             # Create engine
#             self.engine = create_engine(database_url, echo=True, future=True)
#
#             # Bind the engine to the metadata of the Base class so that the
#             # declaratives can be accessed through a DBSession instance
#             Base.metadata.bind = self.engine
#
#             # Create a sessionmaker binding to the engine
#             self.Session = sessionmaker(bind=self.engine)
#             print("Database connection established.")
#
#         except Exception as e:
#             print(f"An error occurred while connecting to the database: {e}")
#
#     @contextmanager
#     def session_scope(self):
#         """Provide a transactional scope around a series of operations."""
#         session = self.SessionLocal()
#         try:
#             yield session
#             session.commit()
#         except:
#             session.rollback()
#             raise
#         finally:
#             session.close()
#     def get_session(self):
#         """Get a new session."""
#         if self.Session is None:
#             self.connect()
#         return self.Session()
#
#     def close(self):
#         """Close the session."""
#         if self.session:
#             self.session.close()
#             print("Database session closed.")
#
#
# # Example of how to use the Database class
# if __name__ == "__main__":
#     db = Database(username='your_username', password='your_password', database='your_database')
#     db.connect()
#     session = db.get_session()
#     # You can now use session to interact with the database
#     db.close()

from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from influxdb_client import InfluxDBClient, WriteApi, WriteOptions
from contextlib import contextmanager
# Load environment variables
load_dotenv()

# Base class for declarative class definitions
Base = declarative_base()

class DBConnection:
    def __init__(self):
        # Database URL for SQLAlchemy (MySQL)
        self.username = os.getenv('DB_USER')
        self.password = os.getenv('DB_PASSWORD')
        self.database = os.getenv('DB_NAME')
        self.host = os.getenv('DB_HOST')
        self.port = os.getenv('DB_PORT')

        database_url = f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
        # Initialize the SQLAlchemy database engine
        self.engine = create_engine(database_url, echo=True)

        # Create a configured "Session" class for SQLAlchemy
        self.SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.engine))

        # self.influx_config = {
        #     'url': os.getenv('INFLUXDB_URL'),
        #     'token': os.getenv('INFLUXDB_TOKEN'),
        #     'org': os.getenv('INFLUXDB_ORG'),
        #     'bucket': os.getenv('INFLUXDB_BUCKET'),
        # }
        # self.influx_client = InfluxDBClient(url=self.influx_config['url'], token=self.influx_config['token'],
        #                                     org=self.influx_config['org'])
        # self.write_api = self.influx_client.write_api(write_options=WriteOptions(batch_size=1000, flush_interval=10000))
        # self.query_api=self.influx_client.query_api()
        self.mysql_conn = None
        self.cursor = None
    @contextmanager
    def session_scope(self):
        """Provide a transactional scope around a series of operations."""
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()


    def init_db(self):
        """Create database tables based on defined models."""
        Base.metadata.create_all(bind=self.engine)

    # def close_influxdb(self):
    #     """Close the InfluxDB client connection."""
    #     self.influx_client.close()

    def close(self):
        """Close all database connections."""
        self.SessionLocal.remove()
        # self.close_influxdb()


# if __name__ == "__main__":
#     db_connection = DBConnection()
#     db_connection.connect_mysql()
#     # Example query execution
#     if db_connection.cursor:
#         db_connection.execute_query("SELECT * FROM some_table")
#         for row in db_connection.cursor:
#             print(row)
#     db_connection.close()


