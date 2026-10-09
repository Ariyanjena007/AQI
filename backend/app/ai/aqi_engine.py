from typing import Dict, Any, Tuple

# EPA AQI Breakpoints (Standard 40 CFR Part 58)
PM25_BREAKPOINTS = [
    (0.0, 12.0, 0, 50, "Good", "#10B981"),
    (12.1, 35.4, 51, 100, "Moderate", "#00E5FF"),
    (35.5, 55.4, 101, 150, "Poor", "#F59E0B"),
    (55.5, 150.4, 151, 200, "Very Poor", "#EF4444"),
    (150.5, 250.4, 201, 300, "Severe", "#8B5CF6"),
    (250.5, 500.4, 301, 500, "Hazardous", "#7E22CE"),
]

PM10_BREAKPOINTS = [
    (0, 54, 0, 50, "Good", "#10B981"),
    (55, 154, 51, 100, "Moderate", "#00E5FF"),
    (155, 254, 101, 150, "Poor", "#F59E0B"),
    (255, 354, 151, 200, "Very Poor", "#EF4444"),
    (355, 424, 201, 300, "Severe", "#8B5CF6"),
    (425, 604, 301, 500, "Hazardous", "#7E22CE"),
]

CO_BREAKPOINTS = [
    (0.0, 4.4, 0, 50, "Good", "#10B981"),
    (4.5, 9.4, 51, 100, "Moderate", "#00E5FF"),
    (9.5, 12.4, 101, 150, "Poor", "#F59E0B"),
    (12.5, 15.4, 151, 200, "Very Poor", "#EF4444"),
    (15.5, 30.4, 201, 300, "Severe", "#8B5CF6"),
    (30.5, 50.4, 301, 500, "Hazardous", "#7E22CE"),
]

def calculate_linear_sub_index(c: float, breakpoints: list) -> Tuple[int, str, str]:
    """Calculates EPA standard linear interpolation for a pollutant."""
    if c <= 0:
        return 0, breakpoints[0][4], breakpoints[0][5]
    for c_low, c_high, i_low, i_high, cat, color in breakpoints:
        if c_low <= c <= c_high:
            aqi = ((i_high - i_low) / (c_high - c_low)) * (c - c_low) + i_low
            return int(round(aqi)), cat, color
    # Above highest defined breakpoint
    return 500, "Hazardous", "#7E22CE"

class AqiEngine:
    """Standard EPA Air Quality Index calculation & multi-pollutant classification engine."""
    
    @staticmethod
    def calculate_aqi(pm25: float, pm10: float = 0.0, co: float = 0.0) -> Dict[str, Any]:
        pm25_aqi, pm25_cat, pm25_col = calculate_linear_sub_index(pm25, PM25_BREAKPOINTS)
        pm10_aqi, pm10_cat, pm10_col = calculate_linear_sub_index(pm10, PM10_BREAKPOINTS) if pm10 > 0 else (0, "Good", "#10B981")
        co_aqi, co_cat, co_col = calculate_linear_sub_index(co, CO_BREAKPOINTS) if co > 0 else (0, "Good", "#10B981")

        sub_indices = {
            "pm25": {"aqi": pm25_aqi, "category": pm25_cat, "color": pm25_col, "concentration": pm25, "unit": "µg/m³"},
            "pm10": {"aqi": pm10_aqi, "category": pm10_cat, "color": pm10_col, "concentration": pm10, "unit": "µg/m³"},
            "co": {"aqi": co_aqi, "category": co_cat, "color": co_col, "concentration": co, "unit": "ppm"},
        }

        # Overall AQI is the maximum of all calculated sub-indices
        max_sub = max(sub_indices.items(), key=lambda item: item[1]["aqi"])
        primary_pollutant = max_sub[0].upper()
        overall_aqi = max_sub[1]["aqi"]
        category = max_sub[1]["category"]
        color = max_sub[1]["color"]

        # Health summary statement
        if overall_aqi <= 50:
            statement = "Air quality is satisfactory, and air pollution poses little or no risk."
            risk_level = "Good"
        elif overall_aqi <= 100:
            statement = "Air quality is acceptable; however, some pollutants may cause moderate health concern for unusually sensitive individuals."
            risk_level = "Moderate"
        elif overall_aqi <= 150:
            statement = "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
            risk_level = "Poor"
        elif overall_aqi <= 200:
            statement = "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects."
            risk_level = "Very Poor"
        elif overall_aqi <= 300:
            statement = "Health alert: The risk of health effects is increased for everyone."
            risk_level = "Severe"
        else:
            statement = "Health warning of emergency conditions: everyone is more likely to be affected."
            risk_level = "Hazardous"

        return {
            "aqi": overall_aqi,
            "category": category,
            "risk_level": risk_level,
            "color": color,
            "primary_pollutant": primary_pollutant,
            "statement": statement,
            "sub_indices": sub_indices
        }

aqi_engine = AqiEngine()
