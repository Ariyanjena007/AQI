// AI Intelligence API Service
const API_BASE = 'http://127.0.0.1:8000/api/ai';

export interface LiveSensors {
  pm25: { value: number; unit: string; label: string };
  pm10: { value: number; unit: string; label: string };
  co2: { value: number; unit: string; label: string };
  co: { value: number; unit: string; label: string };
  voc: { value: number; unit: string; label: string };
  temp: { value: number; unit: string; label: string };
  humidity: { value: number; unit: string; label: string };
}

export interface AqiAnalysis {
  aqi: number;
  category: string;
  risk_level: string;
  color: string;
  primary_pollutant: string;
  statement: string;
  sub_indices: Record<string, { aqi: number; category: string; color: string; concentration: number; unit: string }>;
}

export interface ForecastItem {
  period: string;
  target_time: string;
  iso_target: string;
  predicted_pm25: number;
  predicted_aqi: number;
  upper_bound: number;
  lower_bound: number;
  confidence: number;
}

export interface ForecastData {
  model_version: string;
  current_pm25: number;
  trend_direction: 'RISING' | 'FALLING' | 'STABLE';
  trend_rate_pct: number;
  trend_severity: 'nominal' | 'warning' | 'critical' | 'positive';
  early_warning: string;
  forecasts: ForecastItem[];
}

export interface AnomalyData {
  detected: boolean;
  anomaly_score: number;
  score_percentage: number;
  severity: string;
  anomaly_type: string;
  details: string;
  detected_by: string;
  timestamp: string;
}

export interface DemographicCohort {
  group: string;
  status: string;
  severity_score: number;
  advice: string;
}

export interface HealthRiskData {
  health_risk_index: number;
  risk_level: string;
  risk_color: string;
  general_recommendation: string;
  demographic_cohorts: DemographicCohort[];
  physiological_symptoms: string[];
}

export interface SmartAlert {
  id: string;
  sensor: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface RecommendationItem {
  id: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  action: string;
  reason: string;
  impact: string;
}

export interface DiurnalPoint {
  hour: number;
  time: string;
  expected_pm25: number;
  phase: string;
  description: string;
}

export interface PatternData {
  current_hour: number;
  current_phase: string;
  phase_description: string;
  expected_baseline_pm25: number;
  measured_pm25: number;
  deviation_pct: number;
  comparison_status: string;
  comparison_note: string;
  upcoming_trend_expectation: string;
  diurnal_profile: DiurnalPoint[];
}

export interface ContinuousLearningStatus {
  model_version: string;
  total_samples_trained: number;
  last_retrained: string;
  r2_score: number;
  mean_absolute_error: number;
  retraining_history: Array<{ epoch: number; samples: number; r2: number; timestamp: string }>;
}

export interface FullIntelligenceResponse {
  device_id: string;
  engine_version: string;
  live_sensors: LiveSensors;
  aqi_analysis: AqiAnalysis;
  forecast: ForecastData;
  anomaly: AnomalyData;
  health_risk: HealthRiskData;
  smart_alerts: SmartAlert[];
  pattern_recognition: PatternData;
  recommendations: RecommendationItem[];
  source_attribution: {
    category: string;
    confidence: number;
    supporting_observations: string[];
  };
  continuous_learning: ContinuousLearningStatus;
}

export interface GeminiResponse {
  status: string;
  source: string;
  content: string;
  timestamp: string;
  is_live_gemini: boolean;
  key_configured: boolean;
  gemini_notice?: string;
}

// Fetch Full Real-Time AI Intelligence
export async function fetchFullAiIntelligence(deviceId = 'NODE-Q-01'): Promise<FullIntelligenceResponse> {
  const res = await fetch(`${API_BASE}/live-intelligence?device_id=${deviceId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch AI intelligence: ${res.statusText}`);
  }
  return res.json();
}

// Invoke Gemini Generative AI Diagnosis
export async function invokeGeminiAnalysis(apiKey?: string): Promise<GeminiResponse> {
  const savedKey = apiKey || localStorage.getItem('gemini_api_key') || '';
  const res = await fetch(`${API_BASE}/gemini-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: savedKey })
  });
  if (!res.ok) {
    throw new Error(`Gemini analysis failed: ${res.statusText}`);
  }
  return res.json();
}

// Trigger Continuous Learning Retraining
export async function triggerModelRetraining(): Promise<any> {
  const res = await fetch(`${API_BASE}/train`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Model retraining failed: ${res.statusText}`);
  }
  return res.json();
}
