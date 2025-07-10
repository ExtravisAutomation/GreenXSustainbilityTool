from contextlib import AbstractContextManager
from typing import Callable, List, Dict
from sqlalchemy.orm import Session, joinedload
from app.repository.base_repository import BaseRepository
from app.model.user import Role,DashboardModule,UserModulesAccess,User
from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from app.util.hash import get_rand_hash
from app.schema.admin_schema import UserWithModulesRead
from app.schema.comparison_schema import comparisonDetail,comparisonPayload
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

    def get_comparison_response(self, metrics: dict, payload: comparisonPayload) -> dict:
        # Extract base power values
        base_input_kw = metrics.get("total_PIn_kw")
        base_output_kw = metrics.get("total_POut_kw")
        days_count=metrics.get("day_count")
        # Convert traffic to GB
        traffic_consumed_gb = round((metrics.get("traffic_consumed_mb") or 0) / 1024,2)
        traffic_allocated_gb = round((metrics.get("total_traffic__mb") or 0) / 1024,2)

        default_cost = 0.37
        default_emission = 0.4041

        def percent_diff(old: float, new: float) -> float:
            if old in [None, 0] or new is None:
                return None
            return round(((new - old) / old) * 100, 2)

        def evaluate_pue(pue_value: float) -> str:
            if pue_value is None:
                return "Unknown"
            if pue_value <= 1.5:
                return "Efficient"
            elif 1.5 < pue_value <= 2.5:
                return "Moderate"
            else:
                return "Inefficient"

        def evaluate_eer(eer_value: float) -> str:
            if eer_value is None:
                return "Unknown"
            if eer_value <= 50 :
                return "Inefficient"
            elif 50  < eer_value <=75:
                return "Moderate"
            else:
                return "Efficient"
        # Utility functions
        def calculate_eer(output_kw, input_kw):
            return round((output_kw / input_kw) * 100, 2) if input_kw and output_kw else None

        def calculate_pue(input_kw, output_kw):
            return round(input_kw / output_kw, 3) if input_kw and output_kw else None

        def calculate_utilization(consumed, allocated):
            return round((consumed / allocated) * 100, 2) if allocated else None

        def calculate_pcr(input_kw, consumed_gb):
            return round(input_kw / consumed_gb, 4) if input_kw and consumed_gb else None

        def calculate_traffic_throughput(consumed_gb, input_kw):
            return round(consumed_gb / input_kw, 4) if input_kw and consumed_gb else None  # GB/W

        def build_detail(input_kw, output_kw, cost_factor, co_em_factor):
            eer = calculate_eer(output_kw, input_kw)
            pue = calculate_pue(input_kw, output_kw)
            pcr = calculate_pcr(input_kw, traffic_consumed_gb)
            throughput = calculate_traffic_throughput(traffic_consumed_gb, input_kw)

            detail = comparisonDetail(
                site_id=payload.site_id,
                duration=payload.duration,
                input_power_kw=input_kw,
                output_power_kw=output_kw,
                pue=pue,
                eer_per=eer,
                cost_factor=cost_factor,
                cost_unit=payload.cost_unit,
                co_em_factor=co_em_factor,
                datatraffic_allocated_gb=traffic_allocated_gb,
                datatraffic_consumed_gb=traffic_consumed_gb,
                datautilization_per=calculate_utilization(traffic_consumed_gb, traffic_allocated_gb),
                pcr_kw_per_gb=pcr,
                traffic_throughput_gb_per_watt=throughput
            )
            daily_input_value=input_kw/days_count
            if input_kw and cost_factor:
                detail.cost_estimation=round((input_kw * cost_factor),2)
                detail.cost_estimation_daily = round(daily_input_value * cost_factor, 2)
                detail.cost_estimation_monthly = round(daily_input_value *30 * cost_factor, 2)
                detail.cost_estimation_yearly = round( daily_input_value * 365 * cost_factor, 2)
            if output_kw and co_em_factor:
                detail.co2_em_kg = round(output_kw * co_em_factor, 2)
                detail.co2_em_tons = round(detail.co2_em_kg / 1000, 3)

            return detail

        # Build current detail
        base_detail = build_detail(
            input_kw=base_input_kw,
            output_kw=base_output_kw,
            cost_factor=default_cost,
            co_em_factor=default_emission
        )

        # Check for any updated values
        has_updates = any(
            getattr(payload, field) is not None
            for field in payload.__fields__
            if field not in ['site_id', 'duration']
        )
        if not has_updates:
            return {"current": base_detail.dict(exclude_none=True)}

        # Prepare updated values
        updated_input_kw = payload.input_power_kw or base_input_kw
        updated_pue = payload.pue or base_detail.pue

        if payload.output_power_kw is not None:
            updated_output_kw = payload.output_power_kw
        elif payload.pue is not None and updated_input_kw:
            updated_output_kw = round(updated_input_kw / updated_pue, 2)
        else:
            updated_output_kw = base_output_kw

        updated_cost_factor = payload.cost_factor or base_detail.cost_factor
        updated_emission_factor = payload.co_em_factor or base_detail.co_em_factor


        # Build updated detail
        updated_detail = build_detail(
            input_kw=updated_input_kw,
            output_kw=updated_output_kw,
            cost_factor=updated_cost_factor,
            co_em_factor=updated_emission_factor
        )
        # Convert to dicts first
        base_dict = base_detail.dict(exclude_none=True)
        updated_dict = updated_detail.dict(exclude_none=True)

        # Add evaluations
        base_dict["pue_evaluation"] = evaluate_pue(base_dict.get("pue"))
        updated_dict["pue_evaluation"] = evaluate_pue(updated_dict.get("pue"))

        base_dict["eer_evaluation"] = evaluate_eer(base_dict.get("eer_per"))
        updated_dict["eer_evaluation"] = evaluate_eer(updated_dict.get("eer_per"))
        if has_updates:
            cost_percent_change = percent_diff(
                base_dict.get("cost_estimation"),
                updated_dict.get("cost_estimation")
            )
            co2_percent_change = percent_diff(
                base_dict.get("co2_em_kg"),
                updated_dict.get("co2_em_kg")
            )

        return {

            "current": base_dict,
            "updated": updated_dict,
            "difference_percent": {
                 "cost_estimation_percent_change": percent_diff(base_dict.get("cost_estimation"), updated_dict.get("cost_estimation")),
        "co2_em_kg_percent_change": percent_diff(base_dict.get("co2_em_kg"), updated_dict.get("co2_em_kg"))
    }
        }

    # def get_comparison_response(self, metrics: dict, payload: comparisonPayload) -> dict:
    #     # Extract system metrics
    #     base_input_power = metrics.get("total_PIn_kw")
    #     base_output_power = metrics.get("total_POut_kw")
    #     traffic_consumed_mb = metrics.get("traffic_consumed_mb")
    #     traffic_allocated_mb = metrics.get("total_traffic__mb")
    #
    #     # Default factors
    #     default_cost = 0.37
    #     default_emission = 0.4041
    #
    #     # Calculate base EER (convert to percentage)
    #     base_eer = None
    #     if base_input_power and base_output_power and base_input_power > 0:
    #         base_eer = round((base_output_power / base_input_power) * 100, 2)  # As percentage
    #     # Convert total kWh to total Wh (for W/GB interpretation, though it's technically Wh/GB)
    #     total_input_power_wh = base_input_power * 1000 if base_input_power is not None else None
    #
    #         # Convert total Megabits to total Gigabytes
    #     # Calculate data utilization if traffic data is available
    #     data_utilization = None
    #     if traffic_allocated_mb and traffic_consumed_mb and traffic_allocated_mb > 0:
    #         data_utilization = round((traffic_consumed_mb / traffic_allocated_mb) * 100, 2)
    #     pcr=None
    #     if base_input_power and traffic_consumed_mb > 0:
    #         pcr=round((base_input_power / traffic_consumed_mb), 2)
    #     traffic_throughput = None
    #     if traffic_consumed_mb and base_input_power >0:
    #         traffic_throughput = round((traffic_consumed_mb / base_input_power) , 2)
    #
    #     # Build base (current) detail
    #     base_detail = comparisonDetail(
    #         site_id=payload.site_id,
    #         duration=payload.duration,
    #         input_power_kw=base_input_power,
    #         output_power_kw=base_output_power,
    #         pue=round(base_input_power / base_output_power, 3) if base_input_power and base_output_power else None,
    #         eer_per=base_eer,  # This is now in percentage
    #         cost_factor=default_cost,
    #         cost_unit=payload.cost_unit,
    #         co_em_factor=default_emission,
    #         datatraffic_allocated_mb=traffic_allocated_mb,
    #         datatraffic_consumed_mb=traffic_consumed_mb,
    #         datautilization_per=data_utilization
    #     )
    #
    #     # Calculate derived fields for base detail
    #     if base_detail.input_power_kw and base_detail.cost_factor:
    #         base_detail.cost_estimation = round(base_detail.input_power_kw * base_detail.cost_factor, 2)
    #
    #     if base_detail.output_power_kw and base_detail.co_em_factor:
    #         base_detail.co2_em_kg = round(base_detail.output_power_kw * base_detail.co_em_factor, 2)
    #         base_detail.co2_em_tons = round(base_detail.co2_em_kg / 1000, 3)
    #
    #     # Check if any update values were provided (excluding site_id and duration)
    #     has_updates = any(
    #         getattr(payload, field) is not None
    #         for field in payload.__fields__
    #         if field not in ['site_id', 'duration']
    #     )
    #
    #     if not has_updates:
    #         return {"current": base_detail.dict(exclude_none=True)}
    #
    #     # Process updates only if they exist
    #     changed_input_power = payload.input_power_kw if payload.input_power_kw is not None else base_detail.input_power_kw
    #     changed_pue = payload.pue if payload.pue is not None else base_detail.pue
    #
    #     # Determine output_power logic
    #     if payload.output_power_kw is not None:
    #         changed_output_power = payload.output_power_kw
    #     elif payload.pue is not None and changed_input_power is not None:
    #         changed_output_power = round(changed_input_power / changed_pue, 2)
    #     else:
    #         changed_output_power = base_detail.output_power_kw
    #
    #     # Calculate changed EER (convert to percentage)
    #     changed_eer = None
    #     if changed_input_power and changed_output_power and changed_input_power > 0:
    #         changed_eer = round((changed_output_power / changed_input_power) * 100, 2)
    #
    #     # Create updated detail
    #     changed_detail = comparisonDetail(
    #         site_id=payload.site_id,
    #         duration=payload.duration,
    #         pue=changed_pue,
    #         input_power_kw=changed_input_power,
    #         output_power_kw=changed_output_power,
    #         eer_per=changed_eer,  # This is now in percentage
    #         co_em_factor=payload.co_em_factor if payload.co_em_factor is not None else base_detail.co_em_factor,
    #         cost_factor=payload.cost_factor if payload.cost_factor is not None else base_detail.cost_factor,
    #         cost_unit=payload.cost_unit,
    #         datatraffic_allocated_mb=traffic_allocated_mb,
    #         datatraffic_consumed_mb=traffic_consumed_mb,
    #         datautilization_per=data_utilization
    #     )
    #
    #     # Calculate derived fields for changed detail
    #     if changed_detail.input_power and changed_detail.cost_factor:
    #         changed_detail.cost_estimation = round(changed_detail.input_power * changed_detail.cost_factor, 2)
    #
    #     if changed_detail.output_power and changed_detail.co_em_factor:
    #         changed_detail.co2_em_kg = round(changed_detail.output_power * changed_detail.co_em_factor, 2)
    #         changed_detail.co2_em_tons = round(changed_detail.co2_em_kg / 1000, 3)
    #
    #     return {
    #         "current": base_detail.dict(exclude_none=True),
    #         "updated": changed_detail.dict(exclude_none=True)
    #     }
    #
    #
    #