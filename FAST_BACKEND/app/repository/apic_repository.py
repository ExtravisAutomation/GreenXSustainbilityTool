from contextlib import AbstractContextManager
from typing import Callable, List

from sqlalchemy.orm import Session
from app.model.apic_controller import APICController
from app.model.fabric_node import FabricNode
from app.schema.fabric_node import FabricNodeCreate
from app.repository.base_repository import BaseRepository


class APICRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        #super().__init__(session_factory)

    def get_or_create_apic_controller(self, ip_address: str) -> APICController:
        with self.session_factory() as session:
            apic_controller = session.query(APICController).filter_by(ip_address=ip_address).first()
            if not apic_controller:
                apic_controller = APICController(ip_address=ip_address)
                session.add(apic_controller)
                session.commit()
            return apic_controller

    def create_fabric_node(self, fabric_node_data: FabricNodeCreate):
        with self.session_factory() as session:
            apic_controller = session.query(APICController).get(fabric_node_data.apic_controller_id)
            if not apic_controller:
                raise ValueError(f"APICController with ID {fabric_node_data.apic_controller_id} not found.")

            fabric_node_dict = fabric_node_data.dict(exclude={'apic_controller_id'})
            fabric_node = FabricNode(**fabric_node_dict, apic_controller=apic_controller)
            session.add(fabric_node)
            session.commit()
            return fabric_node

    def get_all_fabric_nodes(self) -> list[FabricNode]:
        with self.session_factory() as session:
            return session.query(FabricNode).all()