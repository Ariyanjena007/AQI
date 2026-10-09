import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AQ Intelligence Backend API"
    VERSION: str = "2.4.1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aqi.db")
    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aqi_environmental_intelligence_secret_key_2026")
    ARDUINO_PORT: str = os.getenv("ARDUINO_PORT", "COM5")
    ARDUINO_BAUD: int = int(os.getenv("ARDUINO_BAUD", "9600"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AIzaSyD9OqbVgibXD6UuDEw19mbE4zrdWHHazNA")
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()
