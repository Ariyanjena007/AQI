export type SensorType = 
  | 'pm25' 
  | 'pm10' 
  | 'co2' 
  | 'temperature' 
  | 'humidity' 
  | 'voc' 
  | 'co' 
  | 'no2';

export type QualityStatus = 'valid' | 'stale' | 'unavailable' | 'attention';

export interface SensorValue {
  type: SensorType;
  label: string;
  value: number | null;
  unit: string;
  changeRate: number; // percentage change vs previous period
  quality: QualityStatus;
  lastUpdated: string;
  isAvailable: boolean; // if false, "Not Connected"
  thresholdWarning?: number;
  thresholdCritical?: number;
}

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface AirQualitySummary {
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  color: string;
  timestamp: string;
  explanation: string;
}

export interface EnvironmentalTrendPoint {
  time: string;
  timestamp: number;
  pm25: number;
  pm10: number;
  co2?: number;
  temperature?: number;
  humidity?: number;
  predictedPm25?: number; // For forecast comparison
}

export interface AiInsight {
  observation: string;
  possibleExplanation: string;
  confidence: number; // 0.0 - 1.0
  recommendedAction: string;
  timestamp: string;
}

export interface SourceAttribution {
  category: 
    | 'Traffic-related emissions'
    | 'Industrial activity'
    | 'Construction dust'
    | 'Biomass burning'
    | 'Unknown / insufficient evidence';
  confidence: number;
  supportingObservations: string[];
  limitations: string[];
  iconType: string;
}

export interface ForecastPoint {
  time: string;
  period: '1h' | '3h' | '6h' | '12h';
  measured?: number;
  predicted: number;
  upperConfidence: number;
  lowerConfidence: number;
}

export interface AnomalyRecord {
  id: string;
  timestamp: string;
  sensor: SensorType;
  anomalyScore: number;
  severity: 'low' | 'medium' | 'high';
  pattern: string;
  detectedBy: string; // e.g., 'IsolationForest v2.1'
}

export interface Alert {
  id: string;
  type: string;
  deviceId: string;
  deviceName: string;
  time: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
  value?: number;
  unit?: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  hardwareModel: string; // 'Arduino UNO Q + PMS5003 + SCD41 + BME688'
  firmwareVersion: string;
  status: 'online' | 'offline' | 'syncing';
  lastCommunication: string;
  batteryLevel?: number; // undefined if AC powered
  sensorAvailability: Record<SensorType, boolean>;
  offlineBufferCount?: number;
}

export interface ReportItem {
  id: string;
  title: string;
  period: string;
  format: 'PDF' | 'CSV';
  size: string;
  dateGenerated: string;
  status: 'Ready' | 'Generating';
}

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_FAILED';
