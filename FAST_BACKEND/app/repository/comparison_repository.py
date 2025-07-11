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
        self.conclusion=''
        super().__init__(session_factory, Role)
    #
    # def data_center_performance(self,pue_value: float, eer_value: float) -> str:
    #     pue_rating = self.evaluate_pue(pue_value)
    #     eer_rating = self.evaluate_eer(eer_value)
    #     print(pue_rating,eer_rating)
    #     if pue_rating == "Unknown" and eer_rating == "Unknown":
    #         return "Cannot assess performance due to missing energy efficiency metrics."
    #
    #     # Cases where both metrics are available
    #     if pue_rating == "Efficient" and eer_rating == "Efficient":
    #         return "Optimal energy performance: Both DataCenter's infrastructure power usage (PUE) and  energy efficiency ratio (EER) show excellent efficiency."
    #     elif pue_rating == "Moderate" and eer_rating == "Moderate":
    #         return "Standard energy performance: DataCenter's power usage overhead and equipment energy conversion are within typical operational ranges."
    #     elif pue_rating == "Inefficient" and eer_rating == "Inefficient":
    #         return "Energy improvement needed: Both DataCenter's infrastructure power overhead and equipment energy conversion show significant inefficiencies."
    #
    #     # Mixed cases - PUE variations
    #     elif pue_rating == "Efficient" and eer_rating == "Moderate":
    #         return "Strong infrastructure efficiency with average  performance: DataCenter's facility power usage is excellent while equipment energy conversion is typical."
    #     elif pue_rating == "Efficient" and eer_rating == "Inefficient":
    #         return "Contrasting performance: While DataCenter's infrastructure power usage is excellent, it's equipment shows poor energy conversion efficiency."
    #
    #     # Mixed cases - EER variations
    #     elif pue_rating == "Moderate" and eer_rating == "Efficient":
    #         return "Balanced operation: DataCenter's infrastructure shows typical power overhead but its's equipment demonstrates excellent energy conversion."
    #     elif pue_rating == "Inefficient" and eer_rating == "Efficient":
    #         return "Mixed efficiency: DataCenter's equipment energy conversion is excellent, but significant power is wasted in infrastructure overhead."
    #
    #     # Cases with one unknown metric
    #     elif pue_rating == "Unknown":
    #         base = f"DataCenter's equipment shows {eer_rating.lower()} energy conversion efficiency"
    #         if eer_rating == "Efficient":
    #             return f"{base}, but overall infrastructure power usage cannot be evaluated."
    #         return f"{base}, but facility power utilization cannot be assessed."
    #
    #     elif eer_rating == "Unknown":
    #         base = f"DataCenter's infrastructure shows {pue_rating.lower()} power utilization"
    #         if pue_rating == "Efficient":
    #             return f"{base}, but equipment energy performance cannot be evaluated."
    #         return f"{base}, but equipment energy metrics are unavailable."
    #     elif pue_rating == "Moderate" and eer_rating == "Inefficient":
    #         return "Moderate infrastructure efficiency but poor energy performance: Energy loss is primarily due to inefficient hardware utilization."
    #     elif pue_rating == "Inefficient" and eer_rating == "Moderate":
    #         return "Inefficient infrastructure despite average energy performance: Energy loss is mostly due to power overhead in non-IT systems."
    #
    #     return ""
    def data_center_performance(self, pue_value: float, eer_value: float) -> str:
        pue_rating = self.evaluate_pue(pue_value)
        eer_rating = self.evaluate_eer(eer_value)
        print(pue_rating, eer_rating)

        if pue_rating == "Unknown" and eer_rating == "Unknown":
            return "Cannot assess performance due to missing energy efficiency metrics."

        if pue_rating == "Efficient" and eer_rating == "Efficient":
            return "Optimal energy performance: Both PUE and EER indicate excellent efficiency."

        elif pue_rating == "Moderate" and eer_rating == "Moderate":
            return "Standard energy performance: Both PUE and EER fall within acceptable operational thresholds."

        elif pue_rating == "Inefficient" and eer_rating == "Inefficient":
            return "Low energy performance: Both PUE and EER indicate significant inefficiencies."

        elif pue_rating == "Efficient" and eer_rating == "Moderate":
            return "Strong infrastructure efficiency with average overall energy conversion."

        elif pue_rating == "Efficient" and eer_rating == "Inefficient":
            return "Infrastructure is efficient, but overall energy conversion is poor."

        elif pue_rating == "Moderate" and eer_rating == "Efficient":
            return "Balanced profile: EER is excellent while PUE shows moderate power usage overhead."

        elif pue_rating == "Inefficient" and eer_rating == "Efficient":
            return "High conversion efficiency with inefficient infrastructure usage."

        elif pue_rating == "Moderate" and eer_rating == "Inefficient":
            return "Moderate infrastructure usage with poor energy conversion efficiency."

        elif pue_rating == "Inefficient" and eer_rating == "Moderate":
            return "Moderate conversion efficiency with inefficient infrastructure power usage."

        elif pue_rating == "Unknown":
            return f"EER indicates {eer_rating.lower()} energy conversion, but PUE is unavailable."

        elif eer_rating == "Unknown":
            return f"PUE indicates {pue_rating.lower()} infrastructure usage, but EER is unavailable."

        return ""

    def evaluate_pue(self,pue_value: float) -> str:
        if pue_value is None:
            return "Unknown"
        if pue_value <= 1.5:
            return "Efficient"
        elif 1.5 < pue_value <= 2.5:
            return "Moderate"
        else:
            return "Inefficient"

    def evaluate_eer(self,eer_value: float) -> str:
        if eer_value is None:
            return "Unknown"
        if eer_value <= 50:
            return "Inefficient"
        elif 50 < eer_value <= 75:
            return "Moderate"
        else:
            return "Efficient"
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
        default_cost_unit="AED"

        def percent_diff(old: float, new: float) -> float:
            if old in [None, 0] or new is None:
                return None

            return round(((new - old) / old) * 100, 2)


        # Utility functions
        def calculate_eer(output_kw, input_kw):
            return round((output_kw / input_kw) * 100, 2) if input_kw and output_kw else None

        def calculate_pue(input_kw, output_kw):
            return round(input_kw / output_kw, 3) if input_kw and output_kw else None

        def calculate_utilization(consumed, allocated):
            return round((consumed / allocated) * 100, 4) if allocated else None

        def calculate_pcr(input_kw, consumed_gb):
            return round(input_kw / consumed_gb, 4) if input_kw and consumed_gb else None

        def calculate_traffic_throughput(consumed_gb, input_kw):
            return round(consumed_gb / input_kw, 4) if input_kw and consumed_gb else None  # GB/W

        def build_detail(input_kw, output_kw, cost_factor, co_em_factor,cost_unit):
            eer = calculate_eer(output_kw, input_kw)
            pue = calculate_pue(input_kw, output_kw)
            pcr = calculate_pcr(input_kw, traffic_consumed_gb)
            throughput = calculate_traffic_throughput(traffic_consumed_gb, input_kw)
            print("PCR", pcr)
            print("Throughput", throughput)
            pue_evaluation= self.evaluate_pue(pue)
            eer_evaluation = self.evaluate_eer(eer)
            self.conclusion=self.data_center_performance(pue,eer )

            detail = comparisonDetail(
                site_id=payload.site_id,
                duration=payload.duration,
                input_power_kw=input_kw,
                output_power_kw=output_kw,
                pue=pue,
                eer_per=eer,
                cost_factor=cost_factor,
                cost_unit=cost_unit,
                co_em_factor=co_em_factor,
                datatraffic_allocated_gb=traffic_allocated_gb,
                datatraffic_consumed_gb=traffic_consumed_gb,
                datautilization_per=calculate_utilization(traffic_consumed_gb, traffic_allocated_gb),
                pcr_kw_per_gb=pcr,
                traffic_throughput_gb_per_watt=throughput,
                pue_evaluation=pue_evaluation,
                eer_evaluation=eer_evaluation

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
            co_em_factor=default_emission,
            cost_unit=default_cost_unit

        )
        print(payload)

        # Check for any updated values
        has_updates = any(
            getattr(payload, field) is not None
            for field in payload.__fields__
            if field not in ['site_id', 'duration','comparison']
        )
        print("has_updates", has_updates)
        if not has_updates:
            return {"current": base_detail.dict(exclude_none=True),
                    "conclusion":self.conclusion}
        # Prepare updated values
        updated_input_kw = payload.input_power_kw or base_input_kw
        updated_pue = payload.pue or base_detail.pue


        if payload.pue is not None and updated_input_kw:
            updated_output_kw = round(updated_input_kw / updated_pue, 2)
        elif payload.output_power_kw is not None:
            updated_output_kw = payload.output_power_kw
        else:
            updated_output_kw = base_output_kw
        # Recalculate EER (Efficiency %)
        updated_eer = None
        updated_pue = None

        updated_eer=round((updated_output_kw / updated_input_kw) * 100, 2) if updated_input_kw and updated_output_kw else 0
        updated_pue=round((updated_input_kw / updated_output_kw), 2) if updated_input_kw and updated_output_kw else 0
        print(updated_eer,type(updated_eer),"updated_eer")


        updated_cost_factor = payload.cost_factor or base_detail.cost_factor
        updated_emission_factor = payload.co_em_factor or base_detail.co_em_factor


        # Build updated detail
        updated_detail = build_detail(
            input_kw=updated_input_kw,
            output_kw=updated_output_kw,
            cost_factor=updated_cost_factor,
            co_em_factor=updated_emission_factor,
            cost_unit=payload.cost_unit or default_cost_unit,

        )
        # Convert to dicts first
        base_dict = base_detail.dict(exclude_none=True)
        updated_dict = updated_detail.dict(exclude_none=True)
        print("updated_dict", type(updated_eer))
        # Add evaluations
        updated_dict["eer_per"] = updated_eer
        print(updated_dict["eer_per"],"updated_dict_eer")
        updated_dict["pue"] = updated_pue
        print(updated_dict["pue"], "updated_dict_pue")
        updated_dict["pue_evaluation"] = self.evaluate_pue(updated_pue)

        # print("updated",updated_eer)
        # print(updated_dict.get("pue"))
        updated_dict["eer_evaluation"] = self.evaluate_eer(updated_eer)
        # print("updated" ,updated_dict["pue_evaluation"] , updated_dict["eer_evaluation"])

        cost_diff=percent_diff(base_dict.get("cost_estimation"), updated_dict.get("cost_estimation"))
        emission_diff=percent_diff(base_dict.get("co2_em_kg"), updated_dict.get("co2_em_kg"))
        eer_diff=percent_diff(base_dict.get("eer_per"),updated_eer)
        print()
        pue_diff=percent_diff(base_dict.get("pue"), updated_pue)
        print(base_dict.get("pue"), updated_pue)
        print("true")
        print(updated_dict.get("eer_per"))

        print(updated_dict.get("pue"))


        if payload.comparison==False:
            print(updated_pue,updated_eer)

            self.conclusion=self.data_center_performance(updated_pue, updated_eer)
            return {
            "current": updated_dict,
            "conclusion": self.conclusion}

        else:
            self.conclusion=self.generate_one_line_summary(eer_diff,pue_diff,emission_diff,cost_diff)

            return {

            "current": base_dict,
            "updated": updated_dict,
            "conclusion": self.conclusion,
            "difference_percent": {
                 "cost_estimation_percent_change": cost_diff,
                 "co2_em_kg_percent_change": emission_diff,
                "eer_percent_change": eer_diff,
                "pue_percent_change": pue_diff,
            }
        }

    def generate_one_line_summary(
            self,eer_diff,pue_diff,emission_diff,cost_diff
    ) -> str:


        impacts = []

        if eer_diff > 5:
            impacts.append(f"a significant improvement of {eer_diff}% in energy efficiency (EER)")
        elif eer_diff < -5:
            impacts.append(f"a decline of {abs(eer_diff)}% in energy efficiency (EER)")

        if pue_diff < -5:
            impacts.append(f"a notable reduction of {abs(pue_diff)}% in PUE")
        elif pue_diff > 5:
            impacts.append(f"an increase of {pue_diff}% in PUE")

        if emission_diff < -5:
            impacts.append(f"reduced carbon emissions by {abs(emission_diff)}%")
        elif emission_diff > 5:
            impacts.append(f"increased carbon emissions by {emission_diff}%")

        if cost_diff < -5:
            impacts.append(f"lowered operational cost by {abs(cost_diff)}%")
        elif cost_diff > 5:
            impacts.append(f"increased operational cost by {cost_diff}%")

        if not impacts:
            return "Your updated configuration shows minimal changes across key metrics."

        summary = "Your updated configuration shows " + ", ".join(impacts[:-1])
        if len(impacts) > 1:
            summary += ", and " + impacts[-1]
        else:
            summary = "Your updated configuration shows " + impacts[0]

        return summary + "."
