export interface HardwareTelemetryContract {
  device_id: string;
  timestamp: string;
  sequence_id: number;
  mq135_ppm: number;
  mq7_co_ppm: number;
  mg811_co2_ppm: number;
  mq2_smoke_ppm: number;
  mq6_lpg_ppm: number;
  gp2y1010_dust: number;
  dht22_temp: number;
  dht22_humidity: number;
  ags10_tvoc: number;
  buzzer_active: boolean;
  oled_active: boolean;
  aqi: number;
  connection: 'online' | 'offline' | 'serial';
}

export type HardwareEntityId =
  | 'uno_q'
  | 'power_supply'
  | 'mq135'
  | 'mq7'
  | 'mg811'
  | 'mq2'
  | 'mq6'
  | 'gp2y1010'
  | 'dht22'
  | 'buzzer'
  | 'oled'
  | 'ags10';

export interface HardwareComponentMeta {
  id: HardwareEntityId;
  name: string;
  category: string;
  shortLabel: string;
  pinoutRole: string;
  voltageLogic: string;
  adcSafety: string;
  detectedMetrics: string;
  metricKey: keyof HardwareTelemetryContract;
  unit: string;
  metricExplanation: string;
  position: [number, number, number];
  colorAccent: string;
  datasheetSpec: {
    supplyVoltage: string;
    targetAnalytes: string;
    analogDivider?: string;
    preheatTime?: string;
    interfaceType: 'Analog (ADC)' | 'Digital (I2C)' | 'Digital (1-Wire)' | 'PWM / GPIO' | 'Power Rail' | 'Processor Hub';
  };
}

export type CameraPreset = 'full' | 'uno_q' | 'mq_array' | 'sharp_dust' | 'digital_display';
