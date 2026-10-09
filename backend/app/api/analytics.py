from fastapi import APIRouter

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/daily")
def get_daily_analytics():
    return {
        "period": "Daily",
        "completeness_pct": 99.4,
        "mean_pm25": 24.6,
        "peak_pm25": 44.2,
        "peak_time": "10:15",
        "distribution": [
            {"hour": "00:00", "pm25": 18.2, "pm10": 34.0, "co2": 520},
            {"hour": "04:00", "pm25": 15.0, "pm10": 28.2, "co2": 480},
            {"hour": "08:00", "pm25": 39.8, "pm10": 74.2, "co2": 680},
            {"hour": "12:00", "pm25": 38.0, "pm10": 70.0, "co2": 660},
            {"hour": "16:00", "pm25": 35.8, "pm10": 68.4, "co2": 642},
            {"hour": "20:00", "pm25": 28.5, "pm10": 55.0, "co2": 590},
        ]
    }

@router.get("/weekly")
def get_weekly_analytics():
    return {
        "period": "Weekly",
        "completeness_pct": 98.6,
        "mean_pm25": 26.3,
        "days": [
            {"day": "Mon", "pm25": 22.4, "pm10": 42.1, "co2": 540, "aqi": 72},
            {"day": "Tue", "pm25": 28.1, "pm10": 51.0, "co2": 590, "aqi": 84},
            {"day": "Wed", "pm25": 35.8, "pm10": 68.4, "co2": 642, "aqi": 102},
            {"day": "Thu", "pm25": 31.2, "pm10": 59.5, "co2": 610, "aqi": 91},
            {"day": "Fri", "pm25": 39.5, "pm10": 74.0, "co2": 680, "aqi": 110},
            {"day": "Sat", "pm25": 18.2, "pm10": 34.0, "co2": 480, "aqi": 62},
            {"day": "Sun", "pm25": 14.5, "pm10": 29.1, "co2": 460, "aqi": 53},
        ]
    }

@router.get("/monthly")
def get_monthly_analytics():
    return {
        "period": "Monthly",
        "completeness_pct": 99.1,
        "monthly_average_pm25": 23.8,
        "exceedance_days": 2,
        "air_quality_breakdown": {
            "Good": "68%",
            "Moderate": "26%",
            "Unhealthy_Sensitive": "6%"
        }
    }
