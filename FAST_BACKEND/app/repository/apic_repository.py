import sys
import traceback
from contextlib import AbstractContextManager
from typing import Callable, List

from sqlalchemy.orm import Session, joinedload
from app.model.apic_controller import APICController
from app.model.fabric_node import FabricNode
from app.schema.fabric_node import FabricNodeCreate
from app.repository.base_repository import BaseRepository
from app.repository.influxdb_repository import InfluxDBRepository


class APICRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]],
                 influxdb_repository: InfluxDBRepository):
        self.session_factory = session_factory
        self.influxdb_repository = influxdb_repository
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
            return session.query(FabricNode).options(joinedload(FabricNode.apic_controller)).limit(10).all()

    def get_fabric_nodes_with_power_utilization(self) -> List[FabricNode]:
        try:
            with self.session_factory() as session:
                fabric_nodes = session.query(FabricNode).options(joinedload(FabricNode.apic_controller)).all()
                for node in fabric_nodes:
                    try:
                        # Fetching power data for each node
                        drawn_avg, supplied_avg = self.influxdb_repository.get_power_data(
                            node.apic_controller.ip_address, str(node.node))
                        # Ensure both drawn_avg and supplied_avg are not None and supplied_avg is greater than 0
                        if drawn_avg is not None and supplied_avg is not None and supplied_avg > 0:
                            # Calculating power utilization and updating the node object
                            node.power_utilization = (drawn_avg / supplied_avg) * 100
                            print(f"Updated node {node.name} with power utilization: {node.power_utilization}",
                                  file=sys.stderr)
                        else:
                            print(
                                f"No valid power data for node {node.name}. Drawn: {drawn_avg}, Supplied: {supplied_avg}",
                                file=sys.stderr)
                    except Exception as inner_e:
                        print(f"Failed to calculate power utilization for node {node.name}. Error: {inner_e}",
                              file=sys.stderr)
                        traceback.print_exc()
                # session.commit()
                return fabric_nodes
        except Exception as outer_e:
            print(f"Failed to fetch fabric nodes with power utilization. Error: {outer_e}", file=sys.stderr)
            traceback.print_exc()
            raise
