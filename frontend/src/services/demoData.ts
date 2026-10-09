import { 
  SensorValue, 
  AirQualitySummary, 
  EnvironmentalTrendPoint, 
  AiInsight, 
  SourceAttribution, 
  ForecastPoint, 
  AnomalyRecord, 
  Alert, 
  Device,
  ReportItem 
} from '../types';

export const INITIAL_SENSORS: SensorValue[] = [
  {
    type: 'pm25',
    label: 'PM2.5',
    value: 35.8,
    unit: 'µg/m³',
    changeRate: 4.2,
    quality: 'valid',
    lastUpdated: 'Just now',
    isAvailable: true,
    thresholdWarning: 35.0,
    thresholdCritical: 75.0,
  },
  {
    type: 'pm10',
    label: 'PM10',
    value: 68.4,
    unit: 'µg/m³',
    changeRate: 2.1,
    quality: 'valid',
    lastUpdated: 'Just now',
    isAvailable: true,
    thresholdWarning: 50.0,
    thresholdCritical: 150.0,
  },
  {
    type: 'co2',
    label: 'CO₂',
    value: 642,
    unit: 'ppm',
    changeRate: -1.4,
    quality: 'valid',
    lastUpdated: 'Just now',
    isAvailable: true,
    thresholdWarning: 1000,
    thresholdCritical: 2000,
  },
  {
    type: 'temperature',
    label: 'Temperature',
    value: 23.4,
    unit: '°C',
    changeRate: 0.3,
    quality: 'valid',
    lastUpdated: 'Just now',
    isAvailable: true,
  },
  {
    type: 'humidity',
    label: 'Relative Humidity',
    value: 48.2,
    unit: '%',
    changeRate: -0.8,
    quality: 'valid',
    lastUpdated: 'Just now',
    isAvailable: true,
  },
  {
    type: 'voc',
    label: 'VOC Index',
    value: 112,
    unit: 'pts',
    changeRate: 5.8,
    quality: 'valid',
    lastUpdated: '1m ago',
    isAvailable: true,
    thresholdWarning: 200,
    thresholdCritical: 350,
  },
  {
    type: 'co',
    label: 'Carbon Monoxide (CO)',
    value: 0.8,
    unit: 'ppm',
    changeRate: 0.0,
    quality: 'valid',
    lastUpdated: '2m ago',
    isAvailable: true,
    thresholdWarning: 4.4,
    thresholdCritical: 9.4,
  },
  {
    type: 'no2',
    label: 'Nitrogen Dioxide (NO₂)',
    value: null, // As specified in prompt: "unavailable sensors as 'Not Connected', not invent readings"
    unit: 'ppb',
    changeRate: 0.0,
    quality: 'unavailable',
    lastUpdated: 'Never',
    isAvailable: false,
    thresholdWarning: 53,
    thresholdCritical: 100,
  },
];

export const INITIAL_AQI: AirQualitySummary = {
  aqi: 102,
  category: 'Moderate',
  dominantPollutant: 'PM2.5 (Fine Particulate Matter)',
  color: '#D99B43', // Warning amber/gold from palette
  timestamp: 'Updated 2 minutes ago',
  explanation: 'Air quality is acceptable; however, a slight concentration of fine particulates may affect individuals sensitive to respiratory irritants.'
};

export const INITIAL_TRENDS: EnvironmentalTrendPoint[] = [
  { time: '00:00', timestamp: 1, pm25: 18.2, pm10: 34.0, co2: 520, temperature: 19.8, humidity: 55 },
  { time: '02:00', timestamp: 2, pm25: 16.5, pm10: 30.5, co2: 490, temperature: 19.2, humidity: 58 },
  { time: '04:00', timestamp: 3, pm25: 15.0, pm10: 28.2, co2: 480, temperature: 18.6, humidity: 60 },
  { time: '06:00', timestamp: 4, pm25: 22.4, pm10: 42.1, co2: 540, temperature: 19.5, humidity: 56 },
  { time: '08:00', timestamp: 5, pm25: 39.8, pm10: 74.2, co2: 680, temperature: 21.2, humidity: 51 },
  { time: '10:00', timestamp: 6, pm25: 44.2, pm10: 82.5, co2: 710, temperature: 22.8, humidity: 48 },
  { time: '12:00', timestamp: 7, pm25: 38.0, pm10: 70.0, co2: 660, temperature: 24.1, humidity: 46 },
  { time: '14:00', timestamp: 8, pm25: 32.5, pm10: 61.2, co2: 630, temperature: 24.8, humidity: 45 },
  { time: '16:00', timestamp: 9, pm25: 35.8, pm10: 68.4, co2: 642, temperature: 23.4, humidity: 48 },
];

export const INITIAL_AI_INSIGHT: AiInsight = {
  observation: "Particulate concentration has increased compared with the previous monitoring interval.",
  possibleExplanation: "Consistent with regional boundary layer compression and localized vehicular transit patterns detected during the late afternoon transit window.",
  confidence: 0.84,
  recommendedAction: "Maintain automated mechanical ventilation with HEPA stage filtration active. Sensitive individuals should avoid prolonged outdoor cardiovascular exercise.",
  timestamp: "Generated 4m ago by Edge-RF Ensemble v1.4"
};

export const INITIAL_SOURCE_ATTRIBUTION: SourceAttribution = {
  category: 'Traffic-related emissions',
  confidence: 0.79,
  supportingObservations: [
    'Concomitant ratio of PM2.5 to PM10 elevated (0.523)',
    'Subtle peak in Carbon Monoxide concurrent with local rush-hour traffic gradient',
    'Wind vector aligned with arterial highway corridor NW 2.4 m/s'
  ],
  limitations: [
    'NO₂ sensor node currently not connected; chemical signature relies on PM2.5/PM10 ratio and CO delta',
    'Local meteorological variance may account for up to 12% uncertainty'
  ],
  iconType: 'Car'
};

export const FORECAST_DATA: ForecastPoint[] = [
  { time: '16:00', period: '1h', measured: 35.8, predicted: 35.8, upperConfidence: 38.0, lowerConfidence: 33.6 },
  { time: '17:00', period: '1h', predicted: 38.2, upperConfidence: 42.1, lowerConfidence: 34.3 },
  { time: '18:00', period: '3h', predicted: 41.5, upperConfidence: 47.0, lowerConfidence: 36.0 },
  { time: '19:00', period: '3h', predicted: 39.0, upperConfidence: 46.2, lowerConfidence: 31.8 },
  { time: '20:00', period: '6h', predicted: 34.2, upperConfidence: 43.0, lowerConfidence: 25.4 },
  { time: '22:00', period: '6h', predicted: 28.5, upperConfidence: 39.0, lowerConfidence: 18.0 },
  { time: '00:00', period: '12h', predicted: 22.0, upperConfidence: 34.5, lowerConfidence: 9.5 },
  { time: '04:00', period: '12h', predicted: 18.4, upperConfidence: 31.0, lowerConfidence: 5.8 }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-1092',
    type: 'Particulate Surge Warning',
    deviceId: 'NODE-Q-01',
    deviceName: 'Central Lab Station',
    time: '14 mins ago',
    severity: 'warning',
    message: 'PM2.5 exceeded threshold: 38.5 µg/m³ recorded (Warning trigger: 35.0 µg/m³)',
    acknowledged: false,
    value: 38.5,
    unit: 'µg/m³'
  },
  {
    id: 'ALT-1088',
    type: 'CO₂ Ventilation Alert',
    deviceId: 'NODE-Q-02',
    deviceName: 'Cleanroom Sensor B',
    time: '1 hour ago',
    severity: 'info',
    message: 'CO₂ elevated above nominal baseline to 820 ppm during scheduled shift exchange.',
    acknowledged: true,
    value: 820,
    unit: 'ppm'
  },
  {
    id: 'ALT-1081',
    type: 'Sensor Offline Notification',
    deviceId: 'NODE-Q-03',
    deviceName: 'Perimeter Station West',
    time: '3 hours ago',
    severity: 'critical',
    message: 'NO₂ electrochemical auxiliary channel disconnected or bus signal lost.',
    acknowledged: true
  }
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'NODE-Q-01',
    name: 'Central Lab Station',
    location: 'Building A, Level 3 — Environmental Research Wing',
    lat: 37.7749,
    lng: -122.4194,
    hardwareModel: 'Arduino UNO Q + PMS5003 + SCD41 + BME688',
    firmwareVersion: 'v2.4.1-edge',
    status: 'online',
    lastCommunication: '8 seconds ago',
    batteryLevel: undefined, // Main grid powered
    sensorAvailability: {
      pm25: true,
      pm10: true,
      co2: true,
      temperature: true,
      humidity: true,
      voc: true,
      co: true,
      no2: false
    },
    offlineBufferCount: 0
  },
  {
    id: 'NODE-Q-02',
    name: 'Cleanroom Sensor B',
    location: 'Fabrication Suite 2, Filtration Plenum',
    lat: 37.7785,
    lng: -122.4120,
    hardwareModel: 'Arduino UNO Q + PMS5003 + SCD41',
    firmwareVersion: 'v2.4.1-edge',
    status: 'online',
    lastCommunication: '24 seconds ago',
    batteryLevel: 94,
    sensorAvailability: {
      pm25: true,
      pm10: true,
      co2: true,
      temperature: true,
      humidity: true,
      voc: false,
      co: false,
      no2: false
    },
    offlineBufferCount: 0
  },
  {
    id: 'NODE-Q-03',
    name: 'Perimeter Station West',
    location: 'Loading Bay & Exterior Arterial Way',
    lat: 37.7690,
    lng: -122.4280,
    hardwareModel: 'Arduino UNO Q + PMS5003 + BME688 + GasPod',
    firmwareVersion: 'v2.3.9-edge',
    status: 'offline',
    lastCommunication: '2 hours ago (Solar Night Mode)',
    batteryLevel: 68,
    sensorAvailability: {
      pm25: true,
      pm10: true,
      co2: false,
      temperature: true,
      humidity: true,
      voc: true,
      co: true,
      no2: false
    },
    offlineBufferCount: 142
  }
];

export const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANOM-441',
    timestamp: 'Today, 10:14 AM',
    sensor: 'pm25',
    anomalyScore: 0.91,
    severity: 'high',
    pattern: 'Sudden high-frequency step spike from 14.2 to 46.1 µg/m³ within 90 seconds',
    detectedBy: 'Edge IsolationForest (UNO Q)'
  },
  {
    id: 'ANOM-439',
    timestamp: 'Yesterday, 18:30 PM',
    sensor: 'voc',
    anomalyScore: 0.74,
    severity: 'medium',
    pattern: 'Transient organic vapor plume with rapid decay (~4 minute half-life)',
    detectedBy: 'BME688 Gas-Index Gradient Analyzer'
  }
];

export const INITIAL_TIMELINE = [
  { time: '08:00', title: 'Morning Commute Influx', aqi: 78, type: 'moderate', note: 'Gradual rise in PM2.5 and VOC detected across perimeter nodes.' },
  { time: '11:30', title: 'Cleanroom HVAC Cycle', aqi: 34, type: 'good', note: 'Plenum airflow filtration normalized particulate index to < 5 µg/m³.' },
  { time: '14:15', title: 'Atmospheric Boundary Compression', aqi: 92, type: 'moderate', note: 'Regional thermal inversion trapped ambient particulate in lower troposphere.' },
  { time: '16:00', title: 'Current Assessment', aqi: 102, type: 'unhealthy_sensitive', note: 'Fine particulate peak requires sustained mechanical HEPA filtration.' }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'REP-2026-W39',
    title: 'Weekly Environmental Compliance Summary — Week 39',
    period: 'Sep 21, 2026 - Sep 28, 2026',
    format: 'PDF',
    size: '1.8 MB',
    dateGenerated: 'Sep 29, 2026',
    status: 'Ready'
  },
  {
    id: 'REP-2026-AUG',
    title: 'Monthly Tropospheric Quality & Sensor Health Audit',
    period: 'Aug 01, 2026 - Aug 31, 2026',
    format: 'PDF',
    size: '4.2 MB',
    dateGenerated: 'Sep 01, 2026',
    status: 'Ready'
  },
  {
    id: 'REP-CSV-30D',
    title: 'Raw Multi-Sensor Telemetry Export (30 Days)',
    period: 'Aug 28, 2026 - Sep 28, 2026',
    format: 'CSV',
    size: '18.4 MB',
    dateGenerated: 'Sep 28, 2026',
    status: 'Ready'
  }
];
