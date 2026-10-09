from typing import Dict, Any, List

class HealthRiskEngine:
    """
    Health Risk Analysis Engine.
    Evaluates physiological impact of multi-pollutant exposure on distinct population cohorts.
    """
    @staticmethod
    def evaluate(readings: Dict[str, float], aqi: int) -> Dict[str, Any]:
        pm25 = readings.get("pm25", 0.0)
        pm10 = readings.get("pm10", 0.0)
        co2 = readings.get("co2", 400.0)
        co = readings.get("co", 0.5)
        voc = readings.get("voc", 80.0)

        # Calculate composite Health Risk Index (0 - 100)
        # Weighted aggregate: PM2.5 (45%), CO2 (20%), CO (15%), VOC (10%), PM10 (10%)
        pm25_factor = min(100.0, (pm25 / 75.0) * 100.0)
        co2_factor = min(100.0, (max(0.0, co2 - 400.0) / 1600.0) * 100.0)
        co_factor = min(100.0, (co / 15.0) * 100.0)
        voc_factor = min(100.0, (voc / 300.0) * 100.0)
        pm10_factor = min(100.0, (pm10 / 150.0) * 100.0)

        risk_index = int(round(
            0.45 * pm25_factor +
            0.20 * co2_factor +
            0.15 * co_factor +
            0.10 * voc_factor +
            0.10 * pm10_factor
        ))

        # Risk Classification
        if risk_index <= 25:
            risk_level = "Low Risk"
            risk_color = "#10B981"
            general_rec = "Air quality poses minimal or no health hazard. Outdoor activities are unrestricted."
        elif risk_index <= 50:
            risk_level = "Moderate Risk"
            risk_color = "#00E5FF"
            general_rec = "Air quality is acceptable. Extremely sensitive individuals should observe mild caution."
        elif risk_index <= 75:
            risk_level = "Elevated Risk"
            risk_color = "#F59E0B"
            general_rec = "Air quality is unhealthy for sensitive individuals. Reduce prolonged outdoor cardiovascular exertion."
        elif risk_index <= 90:
            risk_level = "High Risk"
            risk_color = "#EF4444"
            general_rec = "Air quality is unhealthy. Avoid outdoor strenuous activity; keep windows closed."
        else:
            risk_level = "Critical / Hazardous Risk"
            risk_color = "#7E22CE"
            general_rec = "Emergency conditions: Entire population may experience adverse physiological reactions. Remain indoors with continuous air filtration."

        # Demographic Cohort Risk Matrix
        cohorts = [
            {
                "group": "General Public (Healthy Adults)",
                "status": "Safe" if risk_index < 60 else ("Precaution" if risk_index < 80 else "At Risk"),
                "severity_score": min(100, int(risk_index * 0.85)),
                "advice": "Normal activities permitted." if risk_index < 60 else "Limit strenuous continuous outdoor training.",
            },
            {
                "group": "Children & Developing Lungs",
                "status": "Safe" if risk_index < 35 else ("Elevated Concern" if risk_index < 65 else "Severe Risk"),
                "severity_score": min(100, int(risk_index * 1.25)),
                "advice": "Recess and outdoor play unrestricted." if risk_index < 35 else "Relocate physical sports indoors; protect developing respiratory tracts.",
            },
            {
                "group": "Elderly (Ages 65+)",
                "status": "Safe" if risk_index < 40 else ("Vulnerable" if risk_index < 70 else "High Threat"),
                "severity_score": min(100, int(risk_index * 1.20)),
                "advice": "Standard routines." if risk_index < 40 else "Stay indoors; ensure adequate indoor air circulation and low particulate exposure.",
            },
            {
                "group": "Asthmatics & Respiratory Patients",
                "status": "Nominal" if risk_index < 30 else ("High Sensitivity" if risk_index < 60 else "Acute Danger"),
                "severity_score": min(100, int(risk_index * 1.40)),
                "advice": "Normal baseline." if risk_index < 30 else "Keep quick-relief inhaler accessible. Fine particles can trigger bronchospasm.",
            },
            {
                "group": "Cardiovascular Patients",
                "status": "Nominal" if risk_index < 45 else ("Cardiac Stress" if risk_index < 75 else "Acute Vulnerability"),
                "severity_score": min(100, int(risk_index * 1.15)),
                "advice": "Standard activity." if risk_index < 45 else "Fine particles (PM2.5) increase systemic arterial inflammation. Avoid strenuous walking outdoors.",
            }
        ]

        # Specific physiological symptom warnings
        symptoms: List[str] = []
        if pm25 > 35.0:
            symptoms.append("Airway mucosal irritation, throat scratchiness, and coughing episodes.")
        if co2 > 1000.0:
            symptoms.append(f"Cognitive fatigue, reduced reaction speed, and drowsiness (CO₂: {int(co2)} ppm).")
        if voc > 180.0:
            symptoms.append("Eye irritation, lightheadedness, or sensory irritation from volatile chemicals.")
        if co > 5.0:
            symptoms.append(f"Reduced oxygen affinity in hemoglobin due to elevated Carbon Monoxide ({co:.1f} ppm).")

        return {
            "health_risk_index": risk_index,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "general_recommendation": general_rec,
            "demographic_cohorts": cohorts,
            "physiological_symptoms": symptoms if symptoms else ["No acute physiological stress indicators detected under current conditions."]
        }

health_risk_engine = HealthRiskEngine()
