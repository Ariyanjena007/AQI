from typing import Dict, Any, List
from datetime import datetime, timezone

class SmartAlertEngine:
    """
    Automated Smart Alerts Engine.
    Monitors live parameters against calibrated regulatory and physiological safety thresholds.
    Generates prioritized alerts with immediate remedial recommendations.
    """
    @staticmethod
    def evaluate(readings: Dict[str, float], aqi_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        pm25 = readings.get("pm25", 0.0)
        pm10 = readings.get("pm10", 0.0)
        co2 = readings.get("co2", 400.0)
        co = readings.get("co", 0.5)
        voc = readings.get("voc", 80.0)
        aqi = aqi_data.get("aqi", 0)

        alerts: List[Dict[str, Any]] = []
        now_str = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")

        # 1. CO2 Thresholds
        if co2 >= 1400.0:
            alerts.append({
                "id": "ALT-CO2-CRIT",
                "sensor": "co2",
                "severity": "critical",
                "title": "Severe CO₂ Accumulation",
                "message": f"⚠️ Critical CO₂ level detected ({int(co2)} ppm). Severe drowsiness and cognitive impairment risk. Immediate ventilation is required.",
                "value": co2,
                "unit": "ppm",
                "timestamp": now_str
            })
        elif co2 >= 950.0:
            alerts.append({
                "id": "ALT-CO2-WARN",
                "sensor": "co2",
                "severity": "warning",
                "title": "Elevated CO₂ Warning",
                "message": f"⚠️ High CO₂ detected ({int(co2)} ppm) — Fresh air ventilation is recommended.",
                "value": co2,
                "unit": "ppm",
                "timestamp": now_str
            })

        # 2. PM2.5 Thresholds
        if pm25 >= 75.0:
            alerts.append({
                "id": "ALT-PM25-CRIT",
                "sensor": "pm25",
                "severity": "critical",
                "title": "Very High Particulate Concentration",
                "message": f"🚨 PM2.5 reached {pm25:.1f} µg/m³ (Hazardous / Severe). Engage high-capacity HEPA filtration and avoid all outdoor exposure.",
                "value": pm25,
                "unit": "µg/m³",
                "timestamp": now_str
            })
        elif pm25 >= 35.5:
            alerts.append({
                "id": "ALT-PM25-WARN",
                "sensor": "pm25",
                "severity": "warning",
                "title": "Unhealthy PM2.5 Detected",
                "message": f"⚠️ PM2.5 elevated to {pm25:.1f} µg/m³. Sensitive cohorts (asthmatics, elderly, children) should limit outdoor exertion.",
                "value": pm25,
                "unit": "µg/m³",
                "timestamp": now_str
            })

        # 3. Carbon Monoxide (CO)
        if co >= 9.0:
            alerts.append({
                "id": "ALT-CO-CRIT",
                "sensor": "co",
                "severity": "critical",
                "title": "Toxic Carbon Monoxide Warning",
                "message": f"🚨 Toxic CO level detected ({co:.2f} ppm). Exceeds EPA 8-hr exposure limit. Check fuel-burning appliances immediately.",
                "value": co,
                "unit": "ppm",
                "timestamp": now_str
            })
        elif co >= 2.5:
            alerts.append({
                "id": "ALT-CO-WARN",
                "sensor": "co",
                "severity": "warning",
                "title": "Elevated Carbon Monoxide",
                "message": f"⚠️ CO level is {co:.2f} ppm, above normal ambient baseline. Verify ventilation.",
                "value": co,
                "unit": "ppm",
                "timestamp": now_str
            })

        # 4. Volatile Organic Compounds (VOC)
        if voc >= 250.0:
            alerts.append({
                "id": "ALT-VOC-HIGH",
                "sensor": "voc",
                "severity": "warning",
                "title": "Chemical Vapor / VOC Spike",
                "message": f"⚠️ VOC index is high ({int(voc)} pts). Indicates solvent fumes, aerosol release, or industrial vapor plumes.",
                "value": voc,
                "unit": "pts",
                "timestamp": now_str
            })

        # Sort: critical first, then warning, then info
        order = {"critical": 0, "warning": 1, "info": 2}
        alerts.sort(key=lambda a: order.get(a["severity"], 3))

        return alerts

smart_alert_engine = SmartAlertEngine()
