import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Wind,
  RefreshCw,
  Cpu,
  Layers,
  Clock,
  Key,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Flame,
  Car,
  Factory,
  HardHat,
  Thermometer,
  Droplets,
  Settings,
  AlertOctagon,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  fetchFullAiIntelligence,
  invokeGeminiAnalysis,
  triggerModelRetraining,
  FullIntelligenceResponse,
  GeminiResponse
} from '../services/aiApi';

export const AiIntelligencePage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('NODE-Q-01');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('6h');
  const [intelligence, setIntelligence] = useState<FullIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Gemini State
  const [geminiResult, setGeminiResult] = useState<GeminiResponse | null>(null);
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customKeyInput, setCustomKeyInput] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || 'AIzaSyD9OqbVgibXD6UuDEw19mbE4zrdWHHazNA';
  });
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);

  // Retraining State
  const [retraining, setRetraining] = useState<boolean>(false);
  const [retrainMessage, setRetrainMessage] = useState<string | null>(null);

  // Load intelligence
  const loadIntelligence = useCallback(async () => {
    try {
      const data = await fetchFullAiIntelligence(selectedDevice);
      setIntelligence(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching AI intelligence:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]);

  useEffect(() => {
    loadIntelligence();
  }, [loadIntelligence]);

  // Auto-refresh interval (every 4 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadIntelligence();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadIntelligence]);

  // Run Gemini analysis
  const handleRunGemini = async () => {
    setGeminiLoading(true);
    try {
      const res = await invokeGeminiAnalysis(customKeyInput);
      setGeminiResult(res);
    } catch (err: any) {
      console.error('Error running Gemini:', err);
    } finally {
      setGeminiLoading(false);
    }
  };

  // Trigger continuous learning retraining
  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainMessage(null);
    try {
      const res = await triggerModelRetraining();
      setRetrainMessage(`Model retrained successfully: ${res.total_samples} samples analyzed (R²: ${res.r2_score}).`);
      loadIntelligence();
    } catch (err: any) {
      setRetrainMessage('Retraining failed: ' + (err.message || 'Server error'));
    } finally {
      setRetraining(false);
      setTimeout(() => setRetrainMessage(null), 5000);
    }
  };

  // Save Gemini Key
  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', customKeyInput.trim());
    setKeySaveMessage('Gemini API key saved to local workspace.');
    setTimeout(() => {
      setKeySaveMessage(null);
      setShowKeyModal(false);
    }, 1200);
  };

  // Source Icon Helper
  const getSourceIcon = (category: string) => {
    if (category.includes('Traffic')) return <Car className="w-5 h-5" style={{ color: 'var(--brand)' }} />;
    if (category.includes('Industrial') || category.includes('solvent')) return <Factory className="w-5 h-5" style={{ color: 'var(--brand)' }} />;
    if (category.includes('Construction')) return <HardHat className="w-5 h-5" style={{ color: 'var(--brand)' }} />;
    if (category.includes('Biomass') || category.includes('smoke')) return <Flame className="w-5 h-5" style={{ color: 'var(--brand)' }} />;
    return <HelpCircle className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />;
  };

  if (loading && !intelligence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--brand)' }} />
        <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
          Initializing AI Intelligence Pipeline & Telemetry Ensembles...
        </p>
      </div>
    );
  }

  const {
    live_sensors,
    aqi_analysis,
    forecast,
    anomaly,
    health_risk,
    smart_alerts,
    pattern_recognition,
    recommendations,
    source_attribution,
    continuous_learning
  } = intelligence!;

  // Filter forecast data based on selected horizon
  const visibleForecasts = forecast.forecasts.filter(f => {
    if (selectedHorizon === '15m') return ['15m'].includes(f.period);
    if (selectedHorizon === '30m') return ['15m', '30m'].includes(f.period);
    if (selectedHorizon === '1h')  return ['15m', '30m', '1h'].includes(f.period);
    if (selectedHorizon === '3h')  return ['15m', '30m', '1h', '3h'].includes(f.period);
    if (selectedHorizon === '6h')  return ['15m', '30m', '1h', '3h', '6h'].includes(f.period);
    return true; // 12h
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* =========================================================================
          PAGE HEADER & AI ENGINE COMMAND BAR
         ========================================================================= */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand)' }}>
              <Brain className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: 'var(--brand)' }}>
              Edge Machine Learning & Generative Copilot
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● REAL-TIME PIPELINE ACTIVE
            </span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            AI Air Quality Intelligence
          </h1>
          <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Transforms raw multi-gas telemetry from Arduino edge nodes into real-time EPA classification,
            early trend prediction, IsolationForest anomaly detection, and customized health risk mitigation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Device Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="bg-transparent text-xs font-mono font-medium focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="NODE-Q-01" className="bg-[#0e0e1a]">NODE-Q-01 (San Francisco Market St)</option>
              <option value="NODE-Q-02" className="bg-[#0e0e1a]">NODE-Q-02 (Mission District Sub-station)</option>
              <option value="NODE-Q-03" className="bg-[#0e0e1a]">NODE-Q-03 (Civic Center Ambient Node)</option>
            </select>
          </div>

          {/* Gemini Key Config */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="glass-btn flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl transition"
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini AI Key</span>
          </button>

          {/* Live Auto-Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Live Stream: ON' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: REAL-TIME AIR QUALITY ANALYSIS & SENSOR READINGS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main AQI Condition Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                EPA Continuous Classification
              </span>
              <span
                className="text-xs font-bold font-mono px-2.5 py-1 rounded-full uppercase"
                style={{
                  backgroundColor: `${aqi_analysis.color}20`,
                  color: aqi_analysis.color,
                  border: `1px solid ${aqi_analysis.color}40`
                }}
              >
                ● {aqi_analysis.category}
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-2">
              <span
                className="text-6xl font-heading font-black tracking-tighter"
                style={{ color: aqi_analysis.color, textShadow: `0 0 30px ${aqi_analysis.color}50` }}
              >
                {aqi_analysis.aqi}
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Composite AQI
                </span>
                <span className="text-xs font-semibold text-white/90">
                  Dominant: {aqi_analysis.primary_pollutant}
                </span>
              </div>
            </div>

            <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {aqi_analysis.statement}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span style={{ color: 'var(--text-muted)' }}>Calculation Standard:</span>
            <span className="text-cyan-400 font-semibold">40 CFR Part 58 Multi-Pollutant Max</span>
          </div>
        </div>

        {/* Live Multi-Sensor Grid (PM2.5, PM10, CO2, CO, VOC, Temp, Humidity) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                Live Arduino Sensor Measurements
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Hardware channels synchronized via PMS5003, SCD41, and BME688
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
              Synced {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* PM2.5 */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>PM2.5</span>
                <span className="text-[10px] font-mono text-emerald-400">Optical</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.pm25.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.pm25.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Fine Aerosols</div>
            </div>

            {/* PM10 */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>PM10</span>
                <span className="text-[10px] font-mono text-emerald-400">Optical</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.pm10.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.pm10.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Coarse Dust</div>
            </div>

            {/* CO2 */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>CO₂</span>
                <span className="text-[10px] font-mono text-emerald-400">NDIR</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.co2.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.co2.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Ventilation Index</div>
            </div>

            {/* CO */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>CO</span>
                <span className="text-[10px] font-mono text-emerald-400">EC Cell</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.co.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.co.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Combustion Gas</div>
            </div>

            {/* VOC */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>VOC</span>
                <span className="text-[10px] font-mono text-emerald-400">MOX Gas</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.voc.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.voc.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Chemical Vapor</div>
            </div>

            {/* Temperature */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>Temp</span>
                <span className="text-[10px] font-mono text-emerald-400">Ambient</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.temp.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.temp.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Thermal Gradient</div>
            </div>

            {/* Humidity */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>Humidity</span>
                <span className="text-[10px] font-mono text-emerald-400">RH</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {live_sensors.humidity.value}
                <span className="text-[11px] font-mono font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                  {live_sensors.humidity.unit}
                </span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-cyan-400">Moisture Index</div>
            </div>

            {/* Anomaly Health Score */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>Anomaly</span>
                <span className="text-[10px] font-mono text-purple-400">IF-Score</span>
              </div>
              <div className="text-2xl font-heading font-extrabold text-white">
                {anomaly.score_percentage}%
              </div>
              <div className="text-[10px] mt-1 font-mono text-purple-300">
                {anomaly.detected ? '⚠️ Spike Alert' : '● Nominal'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODULE 2: AI-BASED POLLUTION PREDICTION & EARLY TREND DETECTION
         ========================================================================= */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                AI-Based Pollution Trajectory & Multi-Horizon Prediction
              </h2>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Ridge regression ensemble models diurnal atmospheric patterns and inertia to project air quality
              over 15-minute to 12-hour horizons.
            </p>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {['15m', '30m', '1h', '3h', '6h', '12h'].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                  selectedHorizon === h
                    ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Proactive Trend Early Warning Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          forecast.trend_severity === 'critical' || forecast.trend_severity === 'warning'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : forecast.trend_severity === 'positive'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-white/5 border-white/10 text-white/80'
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold font-mono uppercase tracking-wider">
              {forecast.trend_direction} POLLUTION ACCELERATION ({forecast.trend_rate_pct > 0 ? `+${forecast.trend_rate_pct}` : forecast.trend_rate_pct}% / HOUR)
            </div>
            <p className="text-xs leading-relaxed">
              {forecast.early_warning}
            </p>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={visibleForecasts} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="target_time" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" µg" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e0e1a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="upper_bound" name="Upper Uncertainty (95%)" stroke="none" fill="#00E5FF" fillOpacity={0.1} />
              <Area type="monotone" dataKey="lower_bound" name="Lower Uncertainty (95%)" stroke="none" fill="#00E5FF" fillOpacity={0.05} />
              <Line
                type="monotone"
                dataKey="predicted_pm25"
                name="AI Predicted PM2.5 (µg/m³)"
                stroke="#00E5FF"
                strokeWidth={3}
                dot={{ r: 4, fill: '#00E5FF' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================================
          MODULE 3 & 5: ANOMALY DETECTION & SMART ALERTS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 3: Anomaly Detection */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                  Edge Anomaly Detection & Sensor Health
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                anomaly.detected
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {anomaly.detected ? '● Anomaly Active' : '● Nominal State'}
              </span>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Isolation Forest continuously inspects 7-dimensional sensor vectors against physics bounds
              to distinguish localized smoke/plume events from optical chamber obstructions.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span style={{ color: 'var(--text-muted)' }}>Classifier:</span>
                <span className="text-purple-300 font-semibold">{anomaly.anomaly_type}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span style={{ color: 'var(--text-muted)' }}>Model Architecture:</span>
                <span className="text-white/80">{anomaly.detected_by}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span style={{ color: 'var(--text-muted)' }}>Confidence Metric:</span>
                <span className="text-cyan-400">{anomaly.score_percentage}% Anomaly Score</span>
              </div>
              <p className="text-xs pt-2 border-t border-white/10 text-white/80 leading-relaxed">
                {anomaly.details}
              </p>
            </div>
          </div>

          {/* Anomaly Score Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-[11px] font-mono">
              <span style={{ color: 'var(--text-muted)' }}>Anomaly Severity Index</span>
              <span className={anomaly.detected ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {anomaly.score_percentage} / 100
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, anomaly.score_percentage)}%`,
                  backgroundColor: anomaly.detected ? '#EF4444' : '#10B981'
                }}
              />
            </div>
          </div>
        </div>

        {/* Module 5: Smart Alerts */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                  Prioritized Smart Alerts Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                {smart_alerts.length} Active Notice{smart_alerts.length === 1 ? '' : 's'}
              </span>
            </div>

            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Automatically triggered when pollutants cross calibrated safety thresholds (e.g. CO₂ &gt; 950 ppm, PM2.5 &gt; 35.5 µg/m³).
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {smart_alerts.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-white/50">
                  No critical thresholds breached. All sensor readings are nominal.
                </div>
              ) : (
                smart_alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 ${
                      alt.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30 text-red-200'
                        : alt.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold font-mono uppercase">{alt.title}</span>
                        <span className="text-[10px] font-mono opacity-60">{alt.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">{alt.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] font-mono text-right" style={{ color: 'var(--text-muted)' }}>
            Threshold Standards: WHO 2021 & US EPA Ambient Air
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODULE 4 & 6: HEALTH RISK ANALYSIS & POLLUTION PATTERNS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 4: Health Risk Analysis & Cohort Matrix */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                Multi-Cohort Physiological Health Risk
              </h3>
            </div>
            <span
              className="text-xs font-bold font-mono px-2.5 py-1 rounded-full uppercase"
              style={{
                backgroundColor: `${health_risk.risk_color}20`,
                color: health_risk.risk_color,
                border: `1px solid ${health_risk.risk_color}40`
              }}
            >
              {health_risk.risk_level} ({health_risk.health_risk_index}/100)
            </span>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {health_risk.general_recommendation}
          </p>

          {/* Demographic Cohort Table */}
          <div className="space-y-2 pt-2">
            {health_risk.demographic_cohorts.map((cohort, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">{cohort.group}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {cohort.advice}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                  cohort.severity_score >= 60
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : cohort.severity_score >= 35
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {cohort.status}
                </span>
              </div>
            ))}
          </div>

          {/* Physiological Symptoms */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Anticipated Physiological Markers:
            </div>
            <ul className="text-xs space-y-1 list-disc list-inside text-white/80">
              {health_risk.physiological_symptoms.map((sym, i) => (
                <li key={i}>{sym}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Module 6: Diurnal Pollution Pattern Recognition */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                Diurnal Pollution Pattern Recognition
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              Phase: {pattern_recognition.current_phase}
            </span>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Historical pattern recognition evaluates whether current readings correspond with normal commuter,
            meteorological, or residential cycles for this specific hour of the day.
          </p>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span style={{ color: 'var(--text-muted)' }}>Diurnal Comparison:</span>
              <span className="text-white font-semibold">{pattern_recognition.comparison_status}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span style={{ color: 'var(--text-muted)' }}>Historical 24-hr Norm:</span>
              <span className="text-cyan-400">{pattern_recognition.expected_baseline_pm25} µg/m³</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed pt-1 border-t border-white/10">
              {pattern_recognition.comparison_note}
            </p>
          </div>

          {/* Diurnal Pattern Baseline Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pattern_recognition.diurnal_profile} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9, fontFamily: 'monospace' }} interval={3} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e0e1a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="expected_pm25" name="Historical Norm PM2.5" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.15} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-center" style={{ color: 'var(--text-muted)' }}>
            24-Hour Diurnal Baseline Curve (Peak Rush Hours: 08:00 & 18:00)
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODULE 7: DYNAMIC AI RECOMMENDATIONS
         ========================================================================= */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Dynamic AI Environmental Recommendations
            </h3>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Adapts in real time to multi-gas sensor fluctuations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    {rec.category}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    rec.priority === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400'
                      : rec.priority === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{rec.title}</h4>
                <p className="text-[11px] text-white/70 leading-relaxed mb-2">{rec.action}</p>
                <p className="text-[10px] font-mono text-white/50">{rec.reason}</p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-mono">
                Impact: {rec.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODULE 8: GOOGLE GEMINI GENERATIVE AI COPILOT
         ========================================================================= */}
      <div className="glass-card p-6 rounded-2xl space-y-5 border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 via-cyan-500/10 to-transparent pointer-events-none rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-heading font-bold text-white">
                  Google Gemini Generative AI Environmental Copilot
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-1.5-flash
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Deep neural synthesis translating real-time telemetry into expert medical and industrial hygiene diagnoses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunGemini}
              disabled={geminiLoading}
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-black hover:opacity-90 transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${geminiLoading ? 'animate-spin' : ''}`} />
              <span>{geminiLoading ? 'Synthesizing with Gemini...' : 'Run Gemini Expert Diagnosis'}</span>
            </button>
          </div>
        </div>

        {/* Gemini Result Box */}
        {geminiResult ? (
          <div className="p-5 rounded-xl bg-[#090912]/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">Source: {geminiResult.source}</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">{geminiResult.timestamp}</span>
            </div>

            {geminiResult.gemini_notice && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Cloud API Notice:</div>
                  {geminiResult.gemini_notice}
                </div>
              </div>
            )}

            <div className="text-xs leading-relaxed text-white/90 whitespace-pre-wrap font-sans space-y-2">
              {geminiResult.content}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
            <div className="text-xs font-bold text-white">No Generative Synthesis Run Yet</div>
            <p className="text-xs max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              Click &quot;Run Gemini Expert Diagnosis&quot; above to have Google Gemini evaluate the live multi-gas
              profile, rate-of-change momentum, and produce structured toxicological analysis.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODULE 9: CONTINUOUS LEARNING & MODEL RETRAINING
         ========================================================================= */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Continuous Learning & Online Microclimate Calibration
            </h3>
          </div>
          <p className="text-xs max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Automatically archives telemetry records into SQLite and updates Ridge regression weights and
            IsolationForest decision boundaries to calibrate to local deployment microclimates.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Samples: </span>
              <span className="text-white font-bold">{continuous_learning.total_samples_trained.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Model Variance (R²): </span>
              <span className="text-emerald-400 font-bold">{continuous_learning.r2_score}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Mean Absolute Error: </span>
              <span className="text-cyan-400 font-bold">{continuous_learning.mean_absolute_error} µg/m³</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Last Retrained: </span>
              <span className="text-white/70">{continuous_learning.last_retrained}</span>
            </div>
          </div>

          {retrainMessage && (
            <div className="text-xs font-mono text-emerald-400 pt-2 animate-pulse">
              {retrainMessage}
            </div>
          )}
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="glass-btn flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Fitting New Weights...' : 'Retrain on Local Data'}</span>
        </button>
      </div>

      {/* =========================================================================
          GEMINI API KEY MODAL
         ========================================================================= */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl space-y-4 border border-white/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-heading font-bold text-white">Gemini API Key Configuration</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/50 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Enter your Google Gemini API Key below. This key will be used to generate generative AI health
              advisories and expert air quality explanations.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/80">Google Gemini API Key:</label>
              <input
                type="password"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/60 space-y-1.5">
              <div className="font-semibold text-white/90">How to get or activate your key:</div>
              <p>
                1. If using Google Cloud project <code className="text-cyan-300">50925981298</code>, enable the{' '}
                <a
                  href="https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=50925981298"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline inline-flex items-center gap-0.5"
                >
                  Generative Language API <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
              <p>
                2. Or generate a free instant API key at{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline inline-flex items-center gap-0.5"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </div>

            {keySaveMessage && (
              <div className="text-xs font-mono text-emerald-400 text-center font-bold">
                {keySaveMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-mono rounded-xl text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2 text-xs font-mono font-bold rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
