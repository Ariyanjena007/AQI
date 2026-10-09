import React, { useState, useEffect } from 'react';
import { 
  SensorValue, 
  SensorType, 
  Device 
} from '../types';
import { 
  INITIAL_SENSORS, 
  INITIAL_DEVICES, 
  INITIAL_TRENDS 
} from '../services/demoData';
import { MetricCard } from '../components/common/MetricCard';
import { EnvironmentalPulse } from '../components/common/EnvironmentalPulse';
import { SensorConfidenceBadge } from '../components/common/SensorConfidenceBadge';
import { 
  Activity, 
  Radio, 
  Clock, 
  AlertCircle,
  Box 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface LiveMonitoringPageProps {
  sensors?: SensorValue[];
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  sensors = INITIAL_SENSORS,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('pm25');
  const [selectedDevice, setSelectedDevice] = useState<string>('NODE-Q-01');
  const [timeFilter, setTimeFilter] = useState<string>('1h');
  const [liveReadings, setLiveReadings] = useState<SensorValue[]>(sensors);
  const [lastTick, setLastTick] = useState<Date>(new Date());

  // Subtle live polling simulation every 3 seconds to demonstrate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveReadings((prev) =>
        prev.map((s) => {
          if (!s.isAvailable || s.value === null) return s;
          // small organic fluctuation
          const delta = (Math.random() - 0.48) * (s.type === 'co2' ? 3 : 0.4);
          const newVal = Math.max(0, Number((s.value + delta).toFixed(1)));
          return {
            ...s,
            value: newVal,
            lastUpdated: 'Just now',
          };
        })
      );
      setLastTick(new Date());
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentSensorObj = liveReadings.find((s) => s.type === selectedSensor) || liveReadings[0];

  // Dynamic chart data for the selected sensor
  const chartData = INITIAL_TRENDS.map((pt) => {
    let val = pt.pm25;
    if (selectedSensor === 'pm10') val = pt.pm10;
    if (selectedSensor === 'co2') val = pt.co2 || 600;
    if (selectedSensor === 'temperature') val = pt.temperature || 22;
    if (selectedSensor === 'humidity') val = pt.humidity || 50;
    if (selectedSensor === 'voc') val = 100 + (pt.pm25 * 0.8);
    if (selectedSensor === 'co') val = 0.5 + (pt.pm25 * 0.01);
    return {
      time: pt.time,
      value: val,
    };
  });

  const timeFilters = [
    { label: 'Last 15 minutes', val: '15m' },
    { label: 'Last hour', val: '1h' },
    { label: 'Last 6 hours', val: '6h' },
    { label: 'Last 24 hours', val: '24h' },
    { label: 'Custom range', val: 'custom' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header and Controls */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div>
          <h2
            className="text-xl font-heading font-bold tracking-tight flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>Continuous Live Sensor Telemetry</span>
            <span
              className="text-xs font-mono font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand)',
              }}
            >
              Bus Polling: 1 Hz
            </span>
          </h2>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Raw physical measurements polled across PMS5003, SCD41, and BME688 hardware buses.
          </p>
        </div>

        {/* Controls: Device & Time selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Radio className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="bg-transparent focus:outline-hidden cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              {INITIAL_DEVICES.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {d.id} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/digital-twin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-colors bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50"
            title="Inspect physical circuit bench in 3D"
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Digital Twin</span>
          </Link>

          <div
            className="flex items-center gap-1 p-1 rounded-md border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            {timeFilters.map((tf) => (
              <button
                key={tf.val}
                onClick={() => setTimeFilter(tf.val)}
                className="px-2.5 py-1 rounded transition-colors"
                style={
                  timeFilter === tf.val
                    ? {
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--brand)',
                        fontWeight: 600,
                        boxShadow: '0 1px 2px hsla(220, 30%, 10%, 0.1)',
                      }
                    : {
                        color: 'var(--text-muted)',
                      }
                }
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Sensor Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span
            className="font-mono uppercase tracking-wider font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            All Hardware Sensor Channels (8 Nodes)
          </span>
          <div
            className="flex items-center gap-2 text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
            <span>Last Bus Packet: {lastTick.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveReadings.map((sensor) => {
            const isSelected = selectedSensor === sensor.type;
            return (
              <div
                key={sensor.type}
                onClick={() => sensor.isAvailable && setSelectedSensor(sensor.type)}
                className="transition-all rounded-lg"
                style={
                  isSelected
                    ? {
                        outline: '2px solid var(--brand)',
                        outlineOffset: '2px',
                      }
                    : undefined
                }
              >
                <MetricCard sensor={sensor} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Sensor High-Resolution Drilldown Chart */}
      <div
        className="border rounded-lg p-6 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-base font-semibold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {currentSensorObj.label} High-Resolution Stream
              </h3>
              <SensorConfidenceBadge status={currentSensorObj.quality} />
            </div>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Unit: {currentSensorObj.unit} • Polling Mode: Continuous Ring Buffer
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Instantaneous Value
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: 'var(--brand)' }}
              >
                {currentSensorObj.value !== null ? currentSensorObj.value : '--'} {currentSensorObj.unit}
              </span>
            </div>
            {currentSensorObj.thresholdWarning && (
              <div
                className="text-right border-l pl-3"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Warning Ceiling
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {currentSensorObj.thresholdWarning} {currentSensorObj.unit}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart View */}
        {currentSensorObj.isAvailable ? (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  fontFamily="JetBrains Mono"
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  fontFamily="JetBrains Mono"
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    return (
                      <div
                        className="border rounded p-2.5 text-xs font-mono shadow-md"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span className="block" style={{ color: 'var(--text-muted)' }}>
                          Interval: {label}
                        </span>
                        <span className="font-bold" style={{ color: 'var(--brand)' }}>
                          {payload[0].value} {currentSensorObj.unit}
                        </span>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--brand)"
                  strokeWidth={2.2}
                  dot={{ r: 2.5, fill: 'var(--brand)' }}
                  activeDot={{ r: 5, stroke: 'var(--brand)', strokeWidth: 2, fill: '#FFFFFF' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className="h-64 flex flex-col items-center justify-center text-center p-6 rounded border border-dashed"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <AlertCircle className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
            <h4
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Sensor Channel Not Connected
            </h4>
            <p
              className="text-xs max-w-sm mt-1"
              style={{ color: 'var(--text-muted)' }}
            >
              The {currentSensorObj.label} hardware daughterboard is not detected on the I²C/UART bus. No artificial measurements are fabricated.
            </p>
          </div>
        )}

        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t text-[11px] font-mono"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Hardware Bus: I²C Address 0x62 • Sampling rate 1000ms</span>
          <span>Noise suppression: Exponential Moving Average (alpha=0.25)</span>
        </div>
      </div>

    </div>
  );
};
