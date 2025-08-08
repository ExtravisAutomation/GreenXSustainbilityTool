import os
from dotenv import load_dotenv
from influxdb_client.client.write_api import SYNCHRONOUS

import pymysql
load_dotenv()


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
        print(database_url)
        # Initialize the SQLAlchemy database engine
        self.engine = create_engine(database_url, echo=True)

        # Create a configured "Session" class for SQLAlchemy
        self.SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.engine))

        self.influx_config = {
            'url': os.getenv('INFLUXDB_URL'),
            'token': os.getenv('INFLUXDB_TOKEN'),
            'org': os.getenv('INFLUXDB_ORG'),
            'bucket': os.getenv('INFLUXDB_BUCKET'),
        }
        print(self.influx_config)
        self.influx_client = InfluxDBClient(url=self.influx_config['url'], token=self.influx_config['token'],
                                            org=self.influx_config['org'])
        self.write_api = self.influx_client.write_api(write_options=SYNCHRONOUS)
        self.query_api = self.influx_client.query_api()
        self.mysql_conn = None
        self.cursor = None

    def get_influx_config(self):
        return self.influx_config
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
        """Create database tables based on defined Models."""
        Base.metadata.create_all(bind=self.engine)

    def close_influxdb(self):
        """Close the InfluxDB client connection."""
        self.influx_client.close()

    def close(self):
        """Close all database connections."""
        self.SessionLocal.remove()
        self.close_influxdb()


