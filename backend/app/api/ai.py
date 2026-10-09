from fastapi import APIRouter, Query, Body, Header
from typing import Optional, Dict, Any
from app.ai.predictor import ai_predictor
from app.ai.gemini_service import gemini_ai_service
from app.ai.continuous_learning import continuous_learning_engine
from app.hardware.simulator import uno_q_simulator

router = APIRouter(prefix="/api/ai", tags=["AI Intelligence"])

def _get_live_sensor_dict() -> Dict[str, float]:
    """Retrieves current sensor readings from hardware / simulator."""
    pkt = uno_q_simulator.generate_packet()
    sensor_map = {}
    for s in pkt.get("sensors", []):
        t = s.get("type")
        val = s.get("value", 0.0)
        sensor_map[t] = float(val) if val is not None else 0.0

    return {
        "pm25": sensor_map.get("pm25", 35.8),
        "pm10": sensor_map.get("pm10", 68.4),
        "co2": sensor_map.get("co2", 642.0),
        "temp": sensor_map.get("temp", 23.4),
        "hum": sensor_map.get("humidity", 48.2),
        "voc": sensor_map.get("voc", 112.0),
        "co": sensor_map.get("co", 0.8),
    }

@router.get("/live-intelligence")
def get_live_intelligence(device_id: str = "NODE-Q-01"):
    """
    Primary AI Pipeline Endpoint:
    Real-Time Air Quality + Prediction + Anomaly Detection + Health Risk + Smart Alerts + Patterns + Recommendations.
    """
    readings = _get_live_sensor_dict()
    return ai_predictor.analyze_full_intelligence(device_id=device_id, readings=readings)

@router.get("/current")
def get_current_ai_intelligence(device_id: str = "NODE-Q-01"):
    """Backward compatible endpoint."""
    readings = _get_live_sensor_dict()
    res = ai_predictor.analyze_full_intelligence(device_id=device_id, readings=readings)
    return {
        "device_id": device_id,
        "model_version": res["engine_version"],
        "pollution_classification": f"{res['aqi_analysis']['category']} (AQI {res['aqi_analysis']['aqi']})",
        "aqi": res["aqi_analysis"]["aqi"],
        "anomaly": {
            "detected": res["anomaly"]["detected"],
            "score": res["anomaly"]["anomaly_score"],
            "status": "High Anomaly Detected" if res["anomaly"]["detected"] else "Nominal Gradient"
        },
        "source_attribution": res["source_attribution"],
        "confidence": 0.84,
        "observation": res["forecast"]["early_warning"],
        "explanation": "Consistent with diurnal urban traffic rhythms and localized atmospheric boundary layer behavior.",
        "recommended_action": res["recommendations"][0]["action"] if res["recommendations"] else "Maintain nominal ventilation."
    }

@router.get("/forecast")
def get_ai_forecast(current_pm25: Optional[float] = None):
    """
    Multi-horizon pollution prediction (+15m, +30m, +1h, +3h, +6h, +12h)
    with rate of change acceleration and time-to-breach alerts.
    """
    readings = _get_live_sensor_dict()
    pm25 = current_pm25 if current_pm25 is not None else readings["pm25"]
    from app.ai.forecast_engine import forecast_engine
    return forecast_engine.generate_forecasts(current_pm25=pm25, current_pm10=readings["pm10"])

@router.get("/anomalies")
def get_anomalies():
    """Returns detected anomalous environmental events and sensor faults."""
    from app.ai.anomaly_engine import anomaly_engine
    return anomaly_engine.get_recent_anomalies()

@router.get("/health-assessment")
def get_health_assessment():
    """Returns multi-cohort physiological risk and symptom analysis."""
    readings = _get_live_sensor_dict()
    from app.ai.aqi_engine import aqi_engine
    from app.ai.health_risk_engine import health_risk_engine
    aqi_res = aqi_engine.calculate_aqi(readings["pm25"], readings["pm10"], readings["co"])
    return health_risk_engine.evaluate(readings=readings, aqi=aqi_res["aqi"])

@router.get("/patterns")
def get_pollution_patterns():
    """Hourly and daily pollution pattern recognition & comparison."""
    readings = _get_live_sensor_dict()
    from app.ai.pattern_engine import pattern_engine
    return pattern_engine.analyze(current_pm25=readings["pm25"])

@router.get("/recommendations")
def get_dynamic_recommendations():
    """Dynamic ventilation, filtration, and behavioral recommendations."""
    readings = _get_live_sensor_dict()
    from app.ai.aqi_engine import aqi_engine
    from app.ai.recommendation_engine import recommendation_engine
    aqi_res = aqi_engine.calculate_aqi(readings["pm25"], readings["pm10"], readings["co"])
    recs = recommendation_engine.generate(readings=readings, aqi=aqi_res["aqi"])
    return {
        "aqi": aqi_res["aqi"],
        "category": aqi_res["category"],
        "recommendations": recs,
        "disclaimer": "This system provides environmental awareness and air filtration management; it is not a medical diagnosis."
    }

@router.post("/gemini-analysis")
def post_gemini_analysis(body: Dict[str, Any] = Body(default={})):
    """
    Invokes Google Gemini Generative AI for deep environmental synthesis,
    causal analysis, and customized health advisories.
    Supports optional custom API key in payload or headers.
    """
    custom_key = body.get("api_key")
    readings = _get_live_sensor_dict()
    from app.ai.aqi_engine import aqi_engine
    from app.ai.forecast_engine import forecast_engine
    from app.ai.anomaly_engine import anomaly_engine

    aqi_data = aqi_engine.calculate_aqi(readings["pm25"], readings["pm10"], readings["co"])
    forecast_data = forecast_engine.generate_forecasts(readings["pm25"], readings["pm10"])
    anomaly_data = anomaly_engine.evaluate(readings)

    return gemini_ai_service.analyze_air_quality(
        telemetry=readings,
        aqi_data=aqi_data,
        forecast_data=forecast_data,
        anomaly_data=anomaly_data,
        custom_key=custom_key
    )

@router.post("/train")
def train_continuous_learning_model():
    """Triggers continuous machine-learning model retraining on accumulated data."""
    return continuous_learning_engine.retrain_models()

@router.get("/model-status")
def get_model_status():
    """Returns continuous learning metrics, sample count, and retraining history."""
    return continuous_learning_engine.get_status()
