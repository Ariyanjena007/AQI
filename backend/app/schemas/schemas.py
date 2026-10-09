from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class SensorReadingBase(BaseModel):
    sensor_identifier: str
    measurement_value: Optional[float]
    measurement_unit: str
    quality_status: str = "valid"

class SensorReadingCreate(SensorReadingBase):
    device_id: str
    timestamp: Optional[datetime] = None

class SensorReadingOut(SensorReadingBase):
    id: int
    device_id: str
    timestamp: datetime
    class Config:
        from_attributes = True

class DeviceBase(BaseModel):
    id: str
    name: str
    location: str
    lat: float
    lng: float
    hardware_model: str = "Arduino UNO Q + PMS5003 + SCD41 + BME688"
    firmware_version: str = "v2.4.1-edge"
    status: str = "online"
    battery_level: Optional[int] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceOut(DeviceBase):
    last_communication: datetime
    class Config:
        from_attributes = True

class AiPredictionOut(BaseModel):
    device_id: str
    timestamp: datetime
    forecast_horizon: str
    predicted_pm25: float
    confidence_upper: float
    confidence_lower: float
    anomaly_detected: bool
    predicted_source: str
    source_confidence: float
    model_version: str
    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: str
    device_id: str
    timestamp: datetime
    type: str
    severity: str
    message: str
    acknowledged: bool
    value: Optional[float] = None
    unit: Optional[str] = None
    class Config:
        from_attributes = True

class ReportOut(BaseModel):
    id: str
    title: str
    period: str
    format: str
    size: str
    created_at: datetime
    status: str
    class Config:
        from_attributes = True
