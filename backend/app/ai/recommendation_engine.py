from typing import Dict, Any, List

class RecommendationEngine:
    """
    Dynamic AI Recommendation Engine.
    Generates intelligent environmental and behavioral recommendations that update in real time
    as sensor values fluctuate.
    """
    @staticmethod
    def generate(readings: Dict[str, float], aqi: int) -> List[Dict[str, Any]]:
        pm25 = readings.get("pm25", 0.0)
        pm10 = readings.get("pm10", 0.0)
        co2 = readings.get("co2", 400.0)
        co = readings.get("co", 0.5)
        voc = readings.get("voc", 80.0)
        temp = readings.get("temp", 22.0)
        hum = readings.get("hum", 50.0)

        recommendations: List[Dict[str, Any]] = []

        # 1. Ventilation Logic (balances indoor CO2 vs outdoor particulate)
        if co2 > 1000.0 and pm25 < 35.0:
            recommendations.append({
                "id": "REC-VENT-OPEN",
                "category": "Ventilation",
                "priority": "HIGH",
                "title": "Initiate Fresh Air Cross-Ventilation",
                "action": "Open opposing windows or maximize HVAC outdoor air dampener intake.",
                "reason": f"Indoor CO₂ is elevated ({int(co2)} ppm), while outdoor PM2.5 remains clean ({pm25:.1f} µg/m³). Natural flushing will quickly restore cognitive alertness.",
                "impact": "Reduces drowsiness and headaches within 15 minutes."
            })
        elif co2 > 1000.0 and pm25 >= 35.0:
            recommendations.append({
                "id": "REC-VENT-FILTERED",
                "category": "Ventilation",
                "priority": "HIGH",
                "title": "Use Mechanical Filtered Air Exchange",
                "action": "Do NOT open raw external windows. Engage mechanical ERV/HRV or HVAC with fresh-air intake filtered through HEPA/MERV 13+.",
                "reason": f"Both indoor CO₂ ({int(co2)} ppm) and external PM2.5 ({pm25:.1f} µg/m³) are elevated. Natural window opening would introduce hazardous particulates.",
                "impact": "Ventilates CO₂ without polluting indoor living space."
            })
        elif co2 <= 700.0 and pm25 > 45.0:
            recommendations.append({
                "id": "REC-VENT-SEAL",
                "category": "Ventilation",
                "priority": "CRITICAL",
                "title": "Seal Windows & Run Internal Recirculation",
                "action": "Keep all windows, doors, and balcony apertures tightly sealed. Switch HVAC to internal recirculation.",
                "reason": f"Indoor air exchange is currently adequate (CO₂: {int(co2)} ppm), while outdoor air is unhealthy (PM2.5: {pm25:.1f} µg/m³).",
                "impact": "Prevents penetration of fine microscopic combustion soot into the interior."
            })

        # 2. Air Purification & Filtration
        if pm25 > 25.0 or voc > 150.0:
            speed = "Maximum / Boost Mode" if (pm25 > 55.0 or voc > 250.0) else "Medium-High Continuous"
            recommendations.append({
                "id": "REC-PURIFY-ACTIVE",
                "category": "Air Purification",
                "priority": "HIGH" if pm25 > 55.0 else "MEDIUM",
                "title": f"Activate Air Purifier on {speed}",
                "action": f"Set standalone indoor purifiers to {speed}. Ensure carbon filter layer is engaged for VOC reduction.",
                "reason": f"PM2.5 ({pm25:.1f} µg/m³) and VOC index ({int(voc)} pts) require continuous mechanical particle capture.",
                "impact": "Achieves 80-95% reduction in indoor respirable particles within 45 minutes."
            })

        # 3. Source Identification & Inspection
        if co > 3.0:
            recommendations.append({
                "id": "REC-SOURCE-CO",
                "category": "Source Check",
                "priority": "CRITICAL",
                "title": "Inspect Indoor Combustion Appliances Immediately",
                "action": "Check gas burners, water heaters, boiler flues, and verify no vehicle is idling in an adjacent garage.",
                "reason": f"Carbon Monoxide baseline elevated to {co:.2f} ppm. Carbon monoxide has no odor and signifies incomplete combustion.",
                "impact": "Mitigates acute toxic asphyxiation hazard."
            })
        elif voc > 200.0:
            recommendations.append({
                "id": "REC-SOURCE-VOC",
                "category": "Source Check",
                "priority": "MEDIUM",
                "title": "Audit Indoor Chemical & Volatile Sources",
                "action": "Identify open solvents, aerosols, fresh paint, harsh cleaning agents, or burning candles.",
                "reason": f"VOC index ({int(voc)} pts) is substantially higher than ambient background.",
                "impact": "Eliminates source of volatile vapor off-gassing."
            })

        # 4. Outdoor Activity Guidance
        if aqi > 100:
            recommendations.append({
                "id": "REC-BEHAVIOR-OUTDOOR",
                "category": "Health & Activity",
                "priority": "HIGH" if aqi > 150 else "MEDIUM",
                "title": "Reschedule Outdoor Aerobic Exertion",
                "action": "Relocate cardiovascular running, cycling, or heavy sports indoors. Sensitive individuals should wear well-fitted N95 masks outdoors.",
                "reason": f"Overall AQI is {aqi} ({'Very Poor' if aqi > 150 else 'Poor'}). Deep ventilation during heavy exercise multiplies particulate dose delivered to alveoli.",
                "impact": "Protects pulmonary and cardiovascular system from inflammatory particulate damage."
            })

        # If everything is pristine
        if not recommendations:
            recommendations.append({
                "id": "REC-NOMINAL-OPTIMAL",
                "category": "General Maintenance",
                "priority": "LOW",
                "title": "Optimal Environmental State",
                "action": "Maintain normal living and working patterns. Outdoor exercise and ventilation are completely safe.",
                "reason": "All monitored environmental parameters (PM2.5, PM10, CO₂, CO, VOC) are safely within clean international guidelines.",
                "impact": "Maintains energy efficiency and healthy indoor conditions."
            })

        return recommendations

recommendation_engine = RecommendationEngine()
