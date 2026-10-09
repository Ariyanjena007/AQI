from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.schemas import DeviceOut, DeviceCreate
from datetime import datetime, timezone

router = APIRouter(prefix="/api/devices", tags=["Devices"])

# In-memory backed mock fleet initialized with actual schema
DEVICES_DB = [
    {
        "id": "NODE-Q-01",
        "name": "Central Lab Station",
        "location": "Building A, Level 3 — Environmental Research Wing",
        "lat": 37.7749,
        "lng": -122.4194,
        "hardware_model": "Arduino UNO Q + PMS5003 + SCD41 + BME688",
        "firmware_version": "v2.4.1-edge",
        "status": "online",
        "battery_level": None,
        "last_communication": datetime.now(timezone.utc),
    },
    {
        "id": "NODE-Q-02",
        "name": "Cleanroom Sensor B",
        "location": "Fabrication Suite 2, Filtration Plenum",
        "lat": 37.7785,
        "lng": -122.4120,
        "hardware_model": "Arduino UNO Q + PMS5003 + SCD41",
        "firmware_version": "v2.4.1-edge",
        "status": "online",
        "battery_level": 94,
        "last_communication": datetime.now(timezone.utc),
    },
    {
        "id": "NODE-Q-03",
        "name": "Perimeter Station West",
        "location": "Loading Bay & Exterior Arterial Way",
        "lat": 37.7690,
        "lng": -122.4280,
        "hardware_model": "Arduino UNO Q + PMS5003 + BME688 + GasPod",
        "firmware_version": "v2.3.9-edge",
        "status": "offline",
        "battery_level": 68,
        "last_communication": datetime.now(timezone.utc),
    }
]

@router.get("", response_model=List[DeviceOut])
def get_devices():
    return DEVICES_DB

@router.post("", response_model=DeviceOut)
def create_device(device: DeviceCreate):
    new_dev = device.model_dump()
    new_dev["last_communication"] = datetime.now(timezone.utc)
    DEVICES_DB.append(new_dev)
    return new_dev

@router.get("/{device_id}", response_model=DeviceOut)
def get_device(device_id: str):
    for d in DEVICES_DB:
        if d["id"] == device_id:
            return d
    raise HTTPException(status_code=404, detail="Device not found")

@router.patch("/{device_id}", response_model=DeviceOut)
def update_device(device_id: str, updates: dict):
    for d in DEVICES_DB:
        if d["id"] == device_id:
            d.update(updates)
            return d
    raise HTTPException(status_code=404, detail="Device not found")
