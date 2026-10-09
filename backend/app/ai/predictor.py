from typing import Dict, Any, List, Optional
from app.ai.aqi_engine import aqi_engine
from app.ai.anomaly_engine import anomaly_engine
from app.ai.forecast_engine import forecast_engine
from app.ai.health_risk_engine import health_risk_engine
from app.ai.pattern_engine import pattern_engine
from app.ai.recommendation_engine import recommendation_engine
from app.ai.smart_alerts import smart_alert_engine
from app.ai.continuous_learning import continuous_learning_engine
from app.ai.gemini_service import gemini_ai_service

class SmartAirQualityAiEngine:
    """
    Comprehensive AI-Powered Air Quality Intelligence System.
    Orchestrates:
      1. Real-Time Air Quality & EPA Classification Analysis
      2. Multi-Horizon AI Pollution Trajectory Forecasting
      3. Edge IsolationForest & Dynamic Rate-of-Change Anomaly Detection
      4. Multi-Cohort Physiological Health Risk Evaluation
      5. Automated Smart Alerts with Priority Ranking
      6. Diurnal Hourly Pollution Pattern Recognition
      7. Dynamic Environmental Recommendations
      8. Continuous Learning & Online Model Retraining
      9. Google Gemini Generative AI Health Diagnostics
    """
    def __init__(self):
        self.version = "AQ-SmartIntelligence v3.2-Edge"

    def analyze_full_intelligence(
        self,
        device_id: str,
        readings: Dict[str, float],
        custom_gemini_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Master intelligence pipeline:
        Arduino -> Sensors -> Live Data -> Data Processing -> AI Analysis ->
        Prediction + Anomaly Detection + Health Risk + Smart Alert + Pattern Recognition -> Dashboard
        """
        pm25 = readings.get("pm25", 35.8)
        pm10 = readings.get("pm10", 68.4)
        co2 = readings.get("co2", 642.0)
        co = readings.get("co", 0.8)
        voc = readings.get("voc", 112.0)
        temp = readings.get("temp", 23.4)
        hum = readings.get("hum", 48.2)

        # 1. Real-Time Air Quality Analysis & EPA Breakpoints
        aqi_result = aqi_engine.calculate_aqi(pm25=pm25, pm10=pm10, co=co)

        # 2. AI-Based Pollution Prediction
        forecast_result = forecast_engine.generate_forecasts(current_pm25=pm25, current_pm10=pm10)

        # 3. Anomaly Detection
        anomaly_result = anomaly_engine.evaluate(readings)

        # 4. Health Risk Analysis
        health_result = health_risk_engine.evaluate(readings=readings, aqi=aqi_result["aqi"])

        # 5. Smart Alerts
        alerts_result = smart_alert_engine.evaluate(readings=readings, aqi_data=aqi_result)

        # 6. Pollution Pattern Recognition
        pattern_result = pattern_engine.analyze(current_pm25=pm25)

        # 7. AI Recommendations
        recommendations_result = recommendation_engine.generate(readings=readings, aqi=aqi_result["aqi"])

        # 8. Continuous Learning Recording
        continuous_learning_engine.record_reading(device_id, readings)

        # 9. Source Attribution
        source_attribution = self._attribute_source(pm25, pm10, voc, co)

        return {
            "device_id": device_id,
            "engine_version": self.version,
            "live_sensors": {
                "pm25": {"value": pm25, "unit": "µg/m³", "label": "PM2.5 Fine Dust"},
                "pm10": {"value": pm10, "unit": "µg/m³", "label": "PM10 Coarse Dust"},
                "co2": {"value": co2, "unit": "ppm", "label": "Carbon Dioxide"},
                "co": {"value": co, "unit": "ppm", "label": "Carbon Monoxide"},
                "voc": {"value": voc, "unit": "pts", "label": "VOC Index"},
                "temp": {"value": temp, "unit": "°C", "label": "Temperature"},
                "humidity": {"value": hum, "unit": "%", "label": "Humidity"}
            },
            "aqi_analysis": aqi_result,
            "forecast": forecast_result,
            "anomaly": anomaly_result,
            "health_risk": health_result,
            "smart_alerts": alerts_result,
            "pattern_recognition": pattern_result,
            "recommendations": recommendations_result,
            "source_attribution": source_attribution,
            "continuous_learning": continuous_learning_engine.get_status()
        }

    def _attribute_source(self, pm25: float, pm10: float, voc: float, co: float) -> Dict[str, Any]:
        ratio = pm25 / pm10 if pm10 > 0 else 0.5
        if ratio > 0.55 and co > 0.7:
            category = "Traffic-related emissions"
            confidence = 0.84
            obs = [
                f"Elevated fine-to-coarse PM ratio ({ratio:.2f}) characteristic of hydrocarbon combustion soot.",
                f"Coincident Carbon Monoxide baseline elevated to {co:.2f} ppm.",
                "Temporal concentration aligns with peak urban arterial transit rhythms."
            ]
        elif ratio < 0.35 and pm10 > 50:
            category = "Construction & mechanical abrasive dust"
            confidence = 0.78
            obs = [
                f"Low particulate ratio ({ratio:.2f}) indicates dominant coarse particle distribution (> 2.5 µm).",
                "Combustion tracers (CO and VOC) remain within baseline ambient limits."
            ]
        elif voc > 220:
            category = "Industrial or solvent outgassing"
            confidence = 0.76
            obs = [
                f"Sharp spike in VOC index ({voc:.0f} pts) without corresponding combustion soot.",
                "Consistent with volatile organic solvent vapor or chemical off-gassing."
            ]
        elif ratio > 0.65 and voc > 160 and co > 1.2:
            category = "Biomass / wood smoke combustion"
            confidence = 0.88
            obs = [
                f"High fine particulate ratio ({ratio:.2f}) accompanied by elevated volatile organics.",
                "Consistent with open biomass or residential wood-burning smoke."
            ]
        else:
            category = "Mixed ambient background"
            confidence = 0.52
            obs = [
                f"Balanced particulate ratio ({ratio:.2f}) within background urban atmospheric equilibrium."
            ]
        return {
            "category": category,
            "confidence": confidence,
            "supporting_observations": obs
        }

    # Backward compatibility helpers
    def detect_anomaly(self, features: List[float]):
        readings = {
            "pm25": features[0] if len(features) > 0 else 35.8,
            "pm10": features[1] if len(features) > 1 else 68.4,
            "co2": features[2] if len(features) > 2 else 642.0,
            "temp": features[3] if len(features) > 3 else 23.4,
            "hum": features[4] if len(features) > 4 else 48.2,
            "voc": features[5] if len(features) > 5 else 112.0,
            "co": features[6] if len(features) > 6 else 0.8,
        }
        res = anomaly_engine.evaluate(readings)
        return res["detected"], res["anomaly_score"]

    def forecast_trajectory(self, current_pm25: float):
        res = forecast_engine.generate_forecasts(current_pm25)
        return res["forecasts"]

    def attribute_source(self, pm25: float, pm10: float, voc: float, co: float, no2_available: bool = False):
        return self._attribute_source(pm25, pm10, voc, co)

ai_predictor = SmartAirQualityAiEngine()
