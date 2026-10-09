import React, { useState } from 'react';
import { 
  INITIAL_SENSORS, 
  INITIAL_AQI, 
  INITIAL_TRENDS, 
  INITIAL_AI_INSIGHT, 
  INITIAL_ALERTS, 
  INITIAL_DEVICES 
} from '../services/demoData';
import { MetricCard } from '../components/common/MetricCard';
import { AirQualityDial } from '../components/dashboard/AirQualityDial';
import { TrendLineChart } from '../components/dashboard/TrendLineChart';
import { AiInsightCard } from '../components/dashboard/AiInsightCard';
import { RecentAlertsList } from '../components/dashboard/RecentAlertsList';
import { MonitoringLocationsList } from '../components/dashboard/MonitoringLocationsList';
import { AirQualityTimeline } from '../components/dashboard/AirQualityTimeline';
import { HumanFriendlySummary } from '../components/dashboard/HumanFriendlySummary';
import { SensorValue } from '../types';
import { RefreshCw, Wind, Sparkles, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPageProps {
  sensors?: SensorValue[];
  isSimulating?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  sensors = INITIAL_SENSORS,
}) => {
  const [trendsRange, setTrendsRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter 4 primary sensors for the first row
  const primarySensors = sensors.filter(s => 
    ['pm25', 'pm10', 'co2', 'temperature'].includes(s.type)
  );

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header & Quick Controls ── */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00E5FF] animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
              Live Edge Atmospheric Feed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
            Air, at a Glance.
          </h1>
          <p className="mt-1 text-sm text-white/50 max-w-xl font-sans">
            Real-time telemetry and predictive environmental analysis streamed from Node-Q-01.
          </p>
        </div>

        {/* Action Glass Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Node-Q-01 Active</span>
          </div>

          <button
            onClick={handleManualRefresh}
            className="glass-btn text-xs font-mono py-1.5 px-3 flex items-center gap-1.5"
            title="Poll immediate sensor data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </section>

      {/* ── 3D Hardware Digital Twin Quick Banner ── */}
      <Link
        to="/digital-twin"
        className="group block p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_25px_rgba(0,229,255,0.1)] transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Interactive 3D Prototyping Bench
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  12 Physical Entities
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                Explore Arduino UNO Q 3D Digital Twin & Live Hardware Breakout
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 group-hover:translate-x-1 transition-transform self-end sm:self-center">
            <span>Launch 3D Bench</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* ── ROW 1: 4 Primary Sensor Glass Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primarySensors.map((sensor) => (
          <MetricCard
            key={sensor.type}
            sensor={sensor}
            history={
              sensor.type === 'pm25' 
                ? [28, 30, 29, 32, 34, 33, sensor.value || 35.8]
                : sensor.type === 'pm10'
                ? [54, 58, 62, 60, 65, 66, sensor.value || 68.4]
                : sensor.type === 'co2'
                ? [580, 600, 610, 625, 630, 642]
                : [21.5, 22.0, 22.8, 23.1, 23.4]
            }
          />
        ))}
      </div>

      {/* ── ROW 2: Centerpiece Air Quality Glass Dial & Guidance ── */}
      <div>
        <AirQualityDial summary={INITIAL_AQI} />
      </div>

      {/* ── ROW 3: Human-Friendly Plain Language Summary ── */}
      <div>
        <HumanFriendlySummary />
      </div>

      {/* ── ROW 4: Trends Line Chart (Left) + AI Environmental Inference (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <TrendLineChart
            data={INITIAL_TRENDS}
            timeRange={trendsRange}
            onTimeRangeChange={setTrendsRange}
          />
        </div>
        <div className="lg:col-span-5">
          <AiInsightCard insight={INITIAL_AI_INSIGHT} />
        </div>
      </div>

      {/* ── ROW 5: Diurnal Air Quality Timeline ── */}
      <div>
        <AirQualityTimeline />
      </div>

      {/* ── ROW 6: Recent Alerts ── */}
      <div>
        <RecentAlertsList initialAlerts={INITIAL_ALERTS} />
      </div>

      {/* ── ROW 7: Hardware Monitoring Locations ── */}
      <div>
        <MonitoringLocationsList devices={INITIAL_DEVICES} />
      </div>

    </div>
  );
};
