from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.schemas import AlertOut
from datetime import datetime, timezone

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

ALERTS_DB = [
    {
        "id": "ALT-1092",
        "device_id": "NODE-Q-01",
        "timestamp": datetime.now(timezone.utc),
        "type": "Particulate Surge Warning",
        "severity": "warning",
        "message": "PM2.5 exceeded threshold: 38.5 µg/m³ recorded (Warning trigger: 35.0 µg/m³)",
        "acknowledged": False,
        "value": 38.5,
        "unit": "µg/m³"
    },
    {
        "id": "ALT-1088",
        "device_id": "NODE-Q-02",
        "timestamp": datetime.now(timezone.utc),
        "type": "CO₂ Ventilation Alert",
        "severity": "info",
        "message": "CO₂ elevated above nominal baseline to 820 ppm during scheduled shift exchange.",
        "acknowledged": True,
        "value": 820.0,
        "unit": "ppm"
    },
    {
        "id": "ALT-1081",
        "device_id": "NODE-Q-03",
        "timestamp": datetime.now(timezone.utc),
        "type": "Sensor Offline Notification",
        "severity": "critical",
        "message": "NO₂ electrochemical auxiliary channel disconnected or bus signal lost.",
        "acknowledged": True,
        "value": None,
        "unit": None
    }
]

@router.get("", response_model=List[AlertOut])
def get_alerts():
    return ALERTS_DB

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    for a in ALERTS_DB:
        if a["id"] == alert_id:
            a["acknowledged"] = True
            return {"status": "ACKNOWLEDGED", "alert_id": alert_id}
    raise HTTPException(status_code=404, detail="Alert not found")
