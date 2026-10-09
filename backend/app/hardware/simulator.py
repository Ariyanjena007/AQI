import random
import time
from typing import Dict, Any, List
from datetime import datetime, timezone

class ArduinoUnoQSimulator:
    """
    Simulates physical edge environmental monitoring node based on Arduino UNO Q.
    Emulates:
      - Plantower PMS5003 (UART @ 9600 baud): PM1.0, PM2.5, PM10
      - Sensirion SCD41 (I2C @ 0x62): Photoacoustic NDIR CO2, Temp, RH
      - Bosch BME688 (I2C @ 0x76): Pressure, VOC resistance index
      - Auxiliary NO2 channel (Disconnected/Unavailable state)
    """
    def __init__(self, device_id: str = "NODE-Q-01"):
        self.device_id = device_id
        # State baselines
        self.pm25_baseline = 35.0
        self.pm10_baseline = 68.0
        self.co2_baseline = 640.0
        self.temp_baseline = 23.4
        self.humidity_baseline = 48.0
        self.voc_baseline = 110.0
        self.co_baseline = 0.8
        self.packet_counter = 0

    def generate_packet(self) -> Dict[str, Any]:
        self.packet_counter += 1
        # Random brownian walk with mean reversion
        self.pm25_baseline += random.uniform(-0.6, 0.6) + (35.0 - self.pm25_baseline) * 0.05
        self.pm10_baseline += random.uniform(-1.0, 1.0) + (68.0 - self.pm10_baseline) * 0.05
        self.co2_baseline += random.uniform(-3.0, 3.0) + (640.0 - self.co2_baseline) * 0.05
        self.temp_baseline += random.uniform(-0.1, 0.1) + (23.4 - self.temp_baseline) * 0.02
        self.humidity_baseline += random.uniform(-0.2, 0.2) + (48.0 - self.humidity_baseline) * 0.02
        self.voc_baseline += random.uniform(-2.0, 2.0) + (110.0 - self.voc_baseline) * 0.05
        self.co_baseline += random.uniform(-0.02, 0.02) + (0.8 - self.co_baseline) * 0.05

        now_iso = datetime.now(timezone.utc).isoformat()

        sensors = [
            {
                "type": "pm25",
                "label": "PM2.5",
                "value": round(max(1.0, self.pm25_baseline), 1),
                "unit": "µg/m³",
                "changeRate": 4.2,
                "quality": "valid",
                "lastUpdated": "Just now",
                "isAvailable": True,
                "thresholdWarning": 35.0,
                "thresholdCritical": 75.0,
            },
            {
                "type": "pm10",
                "label": "PM10",
                "value": round(max(2.0, self.pm10_baseline), 1),
                "unit": "µg/m³",
                "changeRate": 2.1,
                "quality": "valid",
                "lastUpdated": "Just now",
                "isAvailable": True,
                "thresholdWarning": 50.0,
                "thresholdCritical": 150.0,
            },
            {
                "type": "co2",
                "label": "CO₂",
                "value": int(round(max(400.0, self.co2_baseline))),
                "unit": "ppm",
                "changeRate": -1.4,
                "quality": "valid",
                "lastUpdated": "Just now",
                "isAvailable": True,
                "thresholdWarning": 1000,
                "thresholdCritical": 2000,
            },
            {
                "type": "temperature",
                "label": "Temperature",
                "value": round(self.temp_baseline, 1),
                "unit": "°C",
                "changeRate": 0.3,
                "quality": "valid",
                "lastUpdated": "Just now",
                "isAvailable": True,
            },
            {
                "type": "humidity",
                "label": "Relative Humidity",
                "value": round(self.humidity_baseline, 1),
                "unit": "%",
                "changeRate": -0.8,
                "quality": "valid",
                "lastUpdated": "Just now",
                "isAvailable": True,
            },
            {
                "type": "voc",
                "label": "VOC Index",
                "value": int(round(max(20.0, self.voc_baseline))),
                "unit": "pts",
                "changeRate": 5.8,
                "quality": "valid",
                "lastUpdated": "1m ago",
                "isAvailable": True,
                "thresholdWarning": 200,
                "thresholdCritical": 350,
            },
            {
                "type": "co",
                "label": "Carbon Monoxide (CO)",
                "value": round(max(0.1, self.co_baseline), 2),
                "unit": "ppm",
                "changeRate": 0.0,
                "quality": "valid",
                "lastUpdated": "2m ago",
                "isAvailable": True,
                "thresholdWarning": 4.4,
                "thresholdCritical": 9.4,
            },
            {
                "type": "no2",
                "label": "Nitrogen Dioxide (NO₂)",
                "value": None,
                "unit": "ppb",
                "changeRate": 0.0,
                "quality": "unavailable",
                "lastUpdated": "Never",
                "isAvailable": False,
            },
        ]

        return {
            "device_id": self.device_id,
            "packet_id": self.packet_counter,
            "timestamp": now_iso,
            "hardware": "Arduino UNO Q Rev 2",
            "sensors": sensors,
            "bus_health": {
                "i2c_bus_state": "OK",
                "uart_baud": 9600,
                "flash_write_cycle": self.packet_counter,
            }
        }

uno_q_simulator = ArduinoUnoQSimulator()
