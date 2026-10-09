/*
 * AQ Intelligence — Arduino UNO Q Firmware
 * ==========================================
 * Reads from connected sensors and outputs JSON via USB Serial.
 *
 * WIRING:
 *   PMS5003 (Particulate):   TX → Arduino Pin 10, RX → Pin 11 (SoftwareSerial)
 *   SCD41 (CO2/Temp/RH):     SDA → A4, SCL → A5 (I2C)
 *   BME688 (VOC/Pressure):   SDA → A4, SCL → A5 (I2C, addr 0x76)
 *   MQ-7 CO Sensor:          AOUT → A0 (Analog)
 *   NO2 Sensor (optional):   AOUT → A1 (Analog, if available)
 *
 * LIBRARIES NEEDED (Arduino IDE Library Manager):
 *   - SparkFun SCD4x Arduino Library  (by SparkFun)
 *   - Adafruit BME680 Library          (by Adafruit — works for BME688)
 *   - PMS Library                      (by Mariusz Kacki)
 *
 * OUTPUT FORMAT (9600 baud, one JSON per line):
 *   {"pm25":35.8,"pm10":68.4,"co2":642,"temp":23.4,"rh":48.2,"voc":112,"co":0.80,"no2":null}
 */

#include <Wire.h>
#include <SoftwareSerial.h>

// ─── Library Includes ───────────────────────────────────────────────────────
// Uncomment after installing libraries in Arduino IDE:
// #include <SparkFun_SCD4x_Arduino_Library.h>
// #include <Adafruit_BME680.h>
// #include <PMS.h>

// ─── Pin Definitions ────────────────────────────────────────────────────────
#define PMS_RX_PIN    10
#define PMS_TX_PIN    11
#define MQ7_PIN       A0   // Carbon Monoxide
#define NO2_PIN       A1   // Nitrogen Dioxide (optional)
#define LED_STATUS    13   // Built-in LED for heartbeat

// ─── Configuration ──────────────────────────────────────────────────────────
#define SEND_INTERVAL_MS  2000   // Send packet every 2 seconds
#define SERIAL_BAUD       9600

// ─── Objects ────────────────────────────────────────────────────────────────
SoftwareSerial pmsSerial(PMS_RX_PIN, PMS_TX_PIN);

// Uncomment when libraries are installed:
// SCD4x scd41;
// Adafruit_BME680 bme;
// PMS pms(pmsSerial);
// PMS::DATA pmsData;

unsigned long lastSend = 0;
bool ledState = false;

// ─── Setup ──────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(SERIAL_BAUD);   // USB Serial → PC
  Wire.begin();                // I2C bus
  pmsSerial.begin(9600);       // PMS5003 UART
  pinMode(LED_STATUS, OUTPUT);

  // --- Initialize SCD41 ---
  // if (!scd41.begin()) {
  //   Serial.println("{\"error\":\"SCD41 not found on I2C\"}");
  // } else {
  //   scd41.startPeriodicMeasurement();
  // }

  // --- Initialize BME688 ---
  // if (!bme.begin(0x76)) {
  //   Serial.println("{\"error\":\"BME688 not found on I2C\"}");
  // } else {
  //   bme.setGasHeater(320, 150); // 320°C for 150ms
  // }

  delay(1000);  // Allow sensors to warm up
}

// ─── Main Loop ──────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;

    // ── Read PMS5003 (Particulates) ─────────────────────────────────────────
    float pm25 = -1, pm10 = -1;
    // if (pms.readUntil(pmsData)) {
    //   pm25 = pmsData.PM_AE_UG_2_5;
    //   pm10 = pmsData.PM_AE_UG_10_0;
    // }

    // ── DEMO: simulate values if sensors not connected yet ──────────────────
    // REMOVE these lines once real sensors are wired:
    pm25 = 35.0 + random(-10, 10) * 0.1;
    pm10 = 68.0 + random(-15, 15) * 0.1;

    // ── Read SCD41 (CO2 + Temperature + Humidity) ───────────────────────────
    float co2 = -1, temp_c = -1, rh = -1;
    // if (scd41.readMeasurement()) {
    //   co2   = scd41.getCO2();
    //   temp_c = scd41.getTemperature();
    //   rh    = scd41.getHumidity();
    // }

    // DEMO values — remove when SCD41 connected:
    co2    = 642.0 + random(-20, 20);
    temp_c = 23.4 + random(-5, 5) * 0.1;
    rh     = 48.0 + random(-10, 10) * 0.1;

    // ── Read BME688 (VOC Index) ─────────────────────────────────────────────
    float voc = -1;
    // if (bme.performReading()) {
    //   // BME688 gas resistance → approximate VOC index (0-500 scale)
    //   voc = map(bme.gas_resistance, 10000, 400000, 500, 0);
    //   voc = constrain(voc, 0, 500);
    // }

    // DEMO value — remove when BME688 connected:
    voc = 112 + random(-10, 10);

    // ── Read MQ-7 CO Sensor (Analog) ─────────────────────────────────────────
    int mq7_raw = analogRead(MQ7_PIN);  // 0-1023
    // Convert ADC reading to ppm (calibrate Rs/R0 ratio for your sensor):
    float co_ppm = mq7_raw * 0.009;    // Rough linear scaling — calibrate!

    // ── Read NO2 Sensor (optional) ───────────────────────────────────────────
    bool no2_available = false;
    float no2_ppb = -1;
    // int no2_raw = analogRead(NO2_PIN);
    // if (no2_raw > 10) {  // sensor connected check
    //   no2_ppb = no2_raw * 0.2;  // calibrate scaling factor
    //   no2_available = true;
    // }

    // ── Build and send JSON ──────────────────────────────────────────────────
    Serial.print("{");
    Serial.print("\"pm25\":"); Serial.print(pm25, 1); Serial.print(",");
    Serial.print("\"pm10\":"); Serial.print(pm10, 1); Serial.print(",");
    Serial.print("\"co2\":");  Serial.print((int)co2);  Serial.print(",");
    Serial.print("\"temp\":"); Serial.print(temp_c, 1); Serial.print(",");
    Serial.print("\"rh\":");   Serial.print(rh, 1);   Serial.print(",");
    Serial.print("\"voc\":");  Serial.print((int)voc);  Serial.print(",");
    Serial.print("\"co\":");   Serial.print(co_ppm, 2); Serial.print(",");

    // NO2 — send null if sensor not connected:
    if (no2_available) {
      Serial.print("\"no2\":"); Serial.print(no2_ppb, 1);
    } else {
      Serial.print("\"no2\":null");
    }

    Serial.println("}");  // End of JSON line ← IMPORTANT

    // Heartbeat LED
    ledState = !ledState;
    digitalWrite(LED_STATUS, ledState);
  }
}
