"""
AQ Intelligence - Real Hardware Serial Reader
Replaces the simulator with actual Arduino UNO Q serial data.

Usage:
  1. Flash arduino_sketch.ino to your Arduino UNO Q
  2. Connect Arduino via USB to your PC
  3. Find your COM port (e.g., COM3, COM4, COM5...)
  4. Set ARDUINO_PORT in config or environment variable
  5. Swap simulator import in main.py with this reader

Requirements:
  pip install pyserial
"""

import serial
import json
import threading
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class ArduinoUnoQSerialReader:
    """
    Reads real telemetry JSON packets from Arduino UNO Q via USB Serial.

    Arduino must send one JSON line per packet at 9600 baud, e.g.:
    {"pm25":35.8,"pm10":68.4,"co2":642,"temp":23.4,"rh":48.2,"voc":112,"co":0.8}
    """

    def __init__(self, port: str = "COM3", baud_rate: int = 9600, device_id: str = "NODE-Q-01"):
        self.port = port
        self.baud_rate = baud_rate
        self.device_id = device_id
        self._serial: Optional[serial.Serial] = None
        self._latest_packet: Optional[Dict[str, Any]] = None
        self._packet_counter = 0
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._connected = False

    def start(self):
        """Start background thread reading serial port."""
        self._running = True
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()
        logger.info(f"Serial reader started on {self.port} @ {self.baud_rate} baud")

    def stop(self):
        """Stop the serial reader."""
        self._running = False
        if self._serial and self._serial.is_open:
            self._serial.close()

    def is_connected(self) -> bool:
        return self._connected

    def generate_packet(self) -> Dict[str, Any]:
        """
        Called by the telemetry loop in main.py (same interface as simulator).
        Returns the latest real packet from Arduino, or a 'stale/unavailable' packet if not connected.
        """
        if self._latest_packet:
            return self._latest_packet
        # Return unavailable state if no data yet
        return self._make_unavailable_packet()

    def _read_loop(self):
        """Continuously read lines from serial port."""
        while self._running:
            try:
                self._serial = serial.Serial(self.port, self.baud_rate, timeout=3)
                self._connected = True
                logger.info(f"Connected to Arduino on {self.port}")

                while self._running:
                    line = self._serial.readline().decode("utf-8", errors="ignore").strip()
                    if line.startswith("{"):  # JSON line
                        try:
                            raw = json.loads(line)
                            self._packet_counter += 1
                            self._latest_packet = self._parse_raw(raw)
                        except json.JSONDecodeError:
                            pass  # Ignore malformed lines

            except serial.SerialException as e:
                self._connected = False
                logger.warning(f"Serial disconnected: {e}. Retrying in 5s...")
                time.sleep(5)
            except Exception as e:
                self._connected = False
                logger.error(f"Unexpected serial error: {e}")
                time.sleep(5)

    def _parse_raw(self, raw: dict) -> Dict[str, Any]:
        """Convert raw Arduino JSON dict to the AQ Intelligence packet format."""
        now_iso = datetime.now(timezone.utc).isoformat()

        def sensor(type_, label, value, unit, warn=None, crit=None):
            available = value is not None
            return {
                "type": type_,
                "label": label,
                "value": value,
                "unit": unit,
                "changeRate": 0.0,
                "quality": "valid" if available else "unavailable",
                "lastUpdated": "Just now" if available else "Never",
                "isAvailable": available,
                **({"thresholdWarning": warn} if warn else {}),
                **({"thresholdCritical": crit} if crit else {}),
            }

        sensors = [
            sensor("pm25",        "PM2.5",                   raw.get("pm25"),  "µg/m³", 35.0,  75.0),
            sensor("pm10",        "PM10",                    raw.get("pm10"),  "µg/m³", 50.0, 150.0),
            sensor("co2",         "CO₂",                     raw.get("co2"),   "ppm",   1000,  2000),
            sensor("temperature", "Temperature",             raw.get("temp"),  "°C"),
            sensor("humidity",    "Relative Humidity",       raw.get("rh"),    "%"),
            sensor("voc",         "VOC Index",               raw.get("voc"),   "pts",   200,   350),
            sensor("co",          "Carbon Monoxide (CO)",    raw.get("co"),    "ppm",   4.4,   9.4),
            sensor("no2",         "Nitrogen Dioxide (NO₂)",  raw.get("no2"),   "ppb",   53,    100),
        ]

        return {
            "device_id": self.device_id,
            "packet_id": self._packet_counter,
            "timestamp": now_iso,
            "hardware": "Arduino UNO Q (Real)",
            "sensors": sensors,
            "bus_health": {
                "i2c_bus_state": "OK",
                "uart_baud": self.baud_rate,
                "flash_write_cycle": self._packet_counter,
            }
        }

    def _make_unavailable_packet(self) -> Dict[str, Any]:
        """Return a packet indicating hardware is not yet connected."""
        self._packet_counter += 1
        now_iso = datetime.now(timezone.utc).isoformat()
        unavailable = {
            "value": None, "quality": "unavailable",
            "lastUpdated": "Not connected", "isAvailable": False, "changeRate": 0.0
        }
        sensors = [
            {"type": t, "label": l, "unit": u, **unavailable}
            for t, l, u in [
                ("pm25", "PM2.5", "µg/m³"), ("pm10", "PM10", "µg/m³"),
                ("co2", "CO₂", "ppm"), ("temperature", "Temperature", "°C"),
                ("humidity", "Relative Humidity", "%"), ("voc", "VOC Index", "pts"),
                ("co", "Carbon Monoxide (CO)", "ppm"), ("no2", "Nitrogen Dioxide (NO₂)", "ppb"),
            ]
        ]
        return {
            "device_id": self.device_id,
            "packet_id": self._packet_counter,
            "timestamp": now_iso,
            "hardware": "Arduino UNO Q (Awaiting Connection)",
            "sensors": sensors,
            "bus_health": {"i2c_bus_state": "DISCONNECTED", "uart_baud": self.baud_rate, "flash_write_cycle": 0}
        }


# Instantiate — change port to your actual COM port
# uno_q_reader = ArduinoUnoQSerialReader(port="COM3", baud_rate=9600)
# uno_q_reader.start()
