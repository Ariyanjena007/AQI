from typing import Dict, Any, List
from datetime import datetime, timezone

class PatternEngine:
    """
    Pollution Pattern Recognition Engine.
    Identifies recurring daily, hourly, and seasonal pollution cycles (e.g. morning transit surge,
    boundary layer thermal compression, night-time stagnation).
    """
    def __init__(self):
        # 24-hour diurnal profile based on urban atmospheric chemistry
        # hours 0 to 23
        self.hourly_diurnal_baseline = [
            {"hour": 0,  "time": "00:00", "expected_pm25": 19.5, "phase": "Nocturnal Stagnation", "description": "Atmospheric surface layer shallow; stable conditions."},
            {"hour": 1,  "time": "01:00", "expected_pm25": 18.0, "phase": "Nocturnal Stagnation", "description": "Low anthropogenic emissions; gradual particle settling."},
            {"hour": 2,  "time": "02:00", "expected_pm25": 16.5, "phase": "Nocturnal Minimum",    "description": "Baseline background ambient particulate equilibrium."},
            {"hour": 3,  "time": "03:00", "expected_pm25": 15.0, "phase": "Nocturnal Minimum",    "description": "Quiet period with minimum vehicle movements."},
            {"hour": 4,  "time": "04:00", "expected_pm25": 15.2, "phase": "Pre-Dawn Transition",  "description": "Temperature inversion typically at maximum strength."},
            {"hour": 5,  "time": "05:00", "expected_pm25": 17.0, "phase": "Early Shift Genesis",  "description": "Commercial logistics and delivery vehicles initialize."},
            {"hour": 6,  "time": "06:00", "expected_pm25": 22.5, "phase": "Morning Traffic Surge", "description": "Commuter vehicular transit begins rising sharply."},
            {"hour": 7,  "time": "07:00", "expected_pm25": 34.0, "phase": "Morning Rush Peak",    "description": "Heavy combustion soot & NO2 emission peak."},
            {"hour": 8,  "time": "08:00", "expected_pm25": 42.0, "phase": "Morning Rush Peak",    "description": "Primary particulate peak trapped by residual inversion."},
            {"hour": 9,  "time": "09:00", "expected_pm25": 45.0, "phase": "Morning Transition",   "description": "Solar radiation begins heating surface layer."},
            {"hour": 10, "time": "10:00", "expected_pm25": 39.0, "phase": "Thermal Convection",    "description": "Boundary layer expands upward; atmospheric mixing starts."},
            {"hour": 11, "time": "11:00", "expected_pm25": 33.0, "phase": "Midday Dispersion",    "description": "Turbulent vertical mixing dilutes ground concentrations."},
            {"hour": 12, "time": "12:00", "expected_pm25": 29.0, "phase": "Solar Peak Dispersion", "description": "Maximum boundary layer depth; photolysis active."},
            {"hour": 13, "time": "13:00", "expected_pm25": 27.0, "phase": "Afternoon Valley",     "description": "Optimal natural atmospheric ventilation window."},
            {"hour": 14, "time": "14:00", "expected_pm25": 26.0, "phase": "Afternoon Valley",     "description": "Lowest daytime particulate concentration window."},
            {"hour": 15, "time": "15:00", "expected_pm25": 27.5, "phase": "Pre-Evening Shift",    "description": "Solar heating wanes; convective mixing slows down."},
            {"hour": 16, "time": "16:00", "expected_pm25": 31.0, "phase": "Evening Transit Start", "description": "Traffic density accelerates on major arterial routes."},
            {"hour": 17, "time": "17:00", "expected_pm25": 38.0, "phase": "Evening Rush Peak",    "description": "Heavy vehicular exhaust coupled with descending boundary layer."},
            {"hour": 18, "time": "18:00", "expected_pm25": 44.5, "phase": "Evening Rush Peak",    "description": "Secondary daily peak; residential cooking and HVAC emissions."},
            {"hour": 19, "time": "19:00", "expected_pm25": 43.0, "phase": "Post-Rush Dissipation", "description": "Traffic abates; surface cooling initiates ground inversion."},
            {"hour": 20, "time": "20:00", "expected_pm25": 36.0, "phase": "Evening Cooling",      "description": "Surface inversion traps ground emissions."},
            {"hour": 21, "time": "21:00", "expected_pm25": 30.0, "phase": "Night-time Stagnation", "description": "Wind speeds subside; localized emission accumulation."},
            {"hour": 22, "time": "22:00", "expected_pm25": 25.5, "phase": "Night-time Stagnation", "description": "Atmosphere stabilizes into laminar nocturnal profile."},
            {"hour": 23, "time": "23:00", "expected_pm25": 22.0, "phase": "Nocturnal Stagnation", "description": "Low urban activity; steady decay toward baseline."},
        ]

    def analyze(self, current_pm25: float) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        cur_hour = now.hour
        baseline_point = self.hourly_diurnal_baseline[cur_hour]
        expected_val = baseline_point["expected_pm25"]

        deviation = current_pm25 - expected_val
        deviation_pct = (deviation / expected_val * 100.0) if expected_val > 0 else 0.0

        if deviation_pct > 25.0:
            comparison_status = f"Significantly Above Baseline (+{deviation_pct:.1f}%)"
            comparison_note = f"Measured PM2.5 ({current_pm25:.1f} µg/m³) is higher than the typical {cur_hour:02d}:00 historical norm ({expected_val:.1f} µg/m³), indicating localized emission anomalies."
        elif deviation_pct < -20.0:
            comparison_status = f"Below Historical Norm ({deviation_pct:.1f}%)"
            comparison_note = f"Air is cleaner than typical {cur_hour:02d}:00 conditions ({expected_val:.1f} µg/m³), likely assisted by favorable meteorological dispersion or low activity."
        else:
            comparison_status = "Tracking Diurnal Baseline (Nominal)"
            comparison_note = f"Particulate concentration is consistent with normal diurnal atmospheric cycles for this hour."

        # Identify upcoming phase
        next_hour = (cur_hour + 1) % 24
        next_point = self.hourly_diurnal_baseline[next_hour]
        is_increasing_phase = next_point["expected_pm25"] > expected_val

        return {
            "current_hour": cur_hour,
            "current_phase": baseline_point["phase"],
            "phase_description": baseline_point["description"],
            "expected_baseline_pm25": expected_val,
            "measured_pm25": current_pm25,
            "deviation_pct": round(deviation_pct, 1),
            "comparison_status": comparison_status,
            "comparison_note": comparison_note,
            "upcoming_trend_expectation": "Pollution typically rises over the next interval." if is_increasing_phase else "Pollution typically subsides or stabilizes over the next interval.",
            "diurnal_profile": self.hourly_diurnal_baseline
        }

pattern_engine = PatternEngine()
