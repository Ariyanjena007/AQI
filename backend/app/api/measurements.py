from fastapi import APIRouter, Query, Body
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from app.hardware.simulator import uno_q_simulator

router = APIRouter(prefix="/api/measurements", tags=["Measurements"])

@router.get("/latest")
def get_latest_measurements(device_id: Optional[str] = "NODE-Q-01"):
    packet = uno_q_simulator.generate_packet()
    packet["device_id"] = device_id
    return packet

@router.get("/history")
def get_measurement_history(
    device_id: Optional[str] = "NODE-Q-01",
    hours: int = 24,
    sensor: Optional[str] = "pm25"
):
    now = datetime.now(timezone.utc)
    points = []
    # Base diurnal pattern
    for i in range(hours, -1, -2):
        t = now - timedelta(hours=i)
        hour_val = t.hour
        # Diurnal curves
        pm25 = 20.0 + 15.0 * ((hour_val - 8)**2 < 16) + 12.0 * ((hour_val - 18)**2 < 9)
        pm10 = pm25 * 1.85 + 4.0
        points.append({
            "time": t.strftime("%H:%M"),
            "timestamp": int(t.timestamp()),
            "pm25": round(pm25, 1),
            "pm10": round(pm10, 1),
            "co2": int(520 + pm25 * 3.5),
            "temperature": round(21.0 + (hour_val / 24.0) * 4.0, 1),
            "humidity": round(55.0 - (hour_val / 24.0) * 8.0, 1)
        })
    return points

@router.post("")
def ingest_measurements(batch: List[dict] = Body(...)):
    """
    Ingests sensor readings synced from offline IndexedDB queues
    """
    return {
        "status": "INGESTED",
        "count": len(batch),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sync_log_id": f"SYNC-{int(datetime.now().timestamp())}"
    }
