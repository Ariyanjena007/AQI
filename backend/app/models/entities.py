from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="analyst")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Device(Base):
    __tablename__ = "devices"
    id = Column(String, primary_key=True, index=True) # e.g. 'NODE-Q-01'
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    hardware_model = Column(String, default="Arduino UNO Q + PMS5003 + SCD41 + BME688")
    firmware_version = Column(String, default="v2.4.1-edge")
    status = Column(String, default="online")
    battery_level = Column(Integer, nullable=True) # None = AC
    last_communication = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    readings = relationship("SensorReading", back_populates="device")
    alerts = relationship("Alert", back_populates="device")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    sensor_identifier = Column(String, nullable=False, index=True) # 'pm25', 'pm10', 'co2', etc.
    measurement_value = Column(Float, nullable=True)
    measurement_unit = Column(String, nullable=False)
    quality_status = Column(String, default="valid") # 'valid', 'stale', 'unavailable', 'attention'

    device = relationship("Device", back_populates="readings")

class AiPrediction(Base):
    __tablename__ = "ai_predictions"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    forecast_horizon = Column(String, nullable=False) # '1h', '3h', '6h', '12h'
    predicted_pm25 = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    anomaly_score = Column(Float, default=0.0)
    anomaly_detected = Column(Boolean, default=False)
    predicted_source = Column(String, default="Unknown / insufficient evidence")
    source_confidence = Column(Float, default=0.0)
    model_version = Column(String, default="Edge-RF Ensemble v1.4.2")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    type = Column(String, nullable=False)
    severity = Column(String, default="warning") # 'info', 'warning', 'critical'
    message = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=False)
    value = Column(Float, nullable=True)
    unit = Column(String, nullable=True)

    device = relationship("Device", back_populates="alerts")

class DeviceHealth(Base):
    __tablename__ = "device_health"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    i2c_bus_errors = Column(Integer, default=0)
    uart_parity_errors = Column(Integer, default=0)
    flash_wear_pct = Column(Float, default=1.2)
    uptime_seconds = Column(Integer, default=3600)

class SyncLog(Base):
    __tablename__ = "synchronization_logs"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, nullable=False)
    sync_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    records_synced = Column(Integer, default=0)
    duration_ms = Column(Integer, default=0)
    status = Column(String, default="SUCCESS")

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    period = Column(String, nullable=False)
    format = Column(String, default="PDF")
    size = Column(String, default="1.8 MB")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="Ready")
    summary = Column(Text, nullable=True)

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    theme = Column(String, default="light")
    temperature_unit = Column(String, default="C")
    auto_sync = Column(Boolean, default=True)
    polling_frequency_ms = Column(Integer, default=1000)
