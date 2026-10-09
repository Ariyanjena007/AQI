import React from 'react';
import { AirQualitySummary } from '../../types';
import {
  ShieldCheck,
  Wind,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Activity,
  Clock,
} from 'lucide-react';

interface AirQualityDialProps {
  summary: AirQualitySummary;
}

const zones = [
  { label: 'Good',      range: [0, 50],   color: '#10B981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)'  },
  { label: 'Moderate',  range: [51, 100],  color: '#00E5FF', bg: 'rgba(0,229,255,0.12)',   border: 'rgba(0,229,255,0.25)'  },
  { label: 'Sensitive', range: [101, 150], color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)' },
  { label: 'Unhealthy', range: [151, 200], color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)'  },
  { label: 'Hazardous', range: [201, 300], color: '#A855F7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.25)' },
];

export const AirQualityDial: React.FC<AirQualityDialProps> = ({ summary }) => {
  const maxAQI = 300;
  const clamped = Math.min(Math.max(summary.aqi, 0), maxAQI);
  const pct = (clamped / maxAQI) * 100;

  const getStatus = (aqi: number) => {
    if (aqi <= 50)  return { label: 'Good',           color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)',  glow: 'rgba(16,185,129,0.4)',  icon: CheckCircle2,   advice: 'Air quality is pristine. Perfect for all outdoor activities and open windows.' };
    if (aqi <= 100) return { label: 'Moderate',       color: '#00E5FF', bg: 'rgba(0,229,255,0.10)',   border: 'rgba(0,229,255,0.25)',  glow: 'rgba(0,229,255,0.4)',   icon: Sparkles,       advice: 'Air is acceptable. Sensitive individuals should limit intense prolonged exertion.' };
    if (aqi <= 150) return { label: 'Sensitive',      color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.4)',  icon: AlertTriangle,  advice: 'Children and adults with respiratory issues should limit extended outdoor exposure.' };
    if (aqi <= 200) return { label: 'Unhealthy',      color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.25)',  glow: 'rgba(239,68,68,0.4)',   icon: AlertTriangle,  advice: 'Everyone may experience health effects. Keep windows shut and indoor purifiers active.' };
    return           { label: 'Hazardous',            color: '#A855F7', bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.25)', glow: 'rgba(168,85,247,0.4)',  icon: AlertCircle,    advice: 'Health alert: serious risk for the entire population. Avoid all outdoor activities.' };
  };

  const status = getStatus(clamped);
  const Icon = status.icon;

  // which zone segment is active
  const activeZoneIdx = zones.findIndex(z => clamped >= z.range[0] && clamped <= z.range[1]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Soft ambient glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60, right: -60,
          width: 280, height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${status.glow.replace('0.4', '0.08')} 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />

      <div className="relative z-10 p-6 sm:p-8">

        {/* ── HEADER ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full block"
                style={{ backgroundColor: status.color, boxShadow: `0 0 8px ${status.glow}` }}
              />
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: status.color, opacity: 0.35 }}
              />
            </div>
            <h2
              className="text-xs font-bold uppercase tracking-[0.14em] font-mono"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Air Quality Index
              <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 8px' }}>·</span>
              <span style={{ color: status.color }}>Live Atmospheric Feed</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Clock style={{ width: 11, height: 11 }} />
            <span>Updated {summary.timestamp}</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              EPA Scale
            </span>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

          {/* LEFT: Big AQI Number Block */}
          <div className="flex flex-col gap-5">

            {/* AQI Number */}
            <div className="flex items-end gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Current AQI
                </div>
                <div
                  className="font-black leading-none"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(5rem, 10vw, 7rem)',
                    color: '#ffffff',
                    letterSpacing: '-0.04em',
                    textShadow: `0 0 40px ${status.glow}, 0 0 80px ${status.glow.replace('0.4','0.15')}`,
                  }}
                >
                  {clamped}
                </div>
              </div>

              {/* Status badge */}
              <div className="pb-2">
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold"
                  style={{
                    background: status.bg,
                    border: `1px solid ${status.border}`,
                    color: status.color,
                    boxShadow: `0 0 20px ${status.glow.replace('0.4','0.2')}`,
                  }}
                >
                  <Icon style={{ width: 13, height: 13, strokeWidth: 2.5 }} />
                  {status.label}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300</span>
              </div>

              {/* Track */}
              <div
                className="relative h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                {/* Multicolor gradient fill */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, #10B981 0%, #00E5FF 33%, #F59E0B 55%, #EF4444 72%, #A855F7 100%)`,
                    boxShadow: `0 0 12px ${status.glow}`,
                  }}
                />
                {/* Thumb indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2"
                  style={{
                    left: `${pct}%`,
                    background: '#ffffff',
                    boxShadow: `0 0 8px ${status.glow}`,
                    transition: 'left 0.7s ease-out',
                  }}
                />
              </div>

              {/* Zone color blocks */}
              <div className="grid grid-cols-5 gap-1">
                {zones.map((z, i) => (
                  <div
                    key={z.label}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      background: i === activeZoneIdx ? z.color : z.color + '30',
                      boxShadow: i === activeZoneIdx ? `0 0 8px ${z.color}80` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Dominant pollutant */}
            <div
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}
              >
                <Wind style={{ width: 15, height: 15, color: '#00E5FF', filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.5))' }} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Primary Driver
                </div>
                <div className="text-sm font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {summary.dominantPollutant} &mdash; Fine Particulate Matter
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[11px] font-mono flex-shrink-0" style={{ color: '#10B981' }}>
                <ShieldCheck style={{ width: 12, height: 12, filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.4))' }} />
                <span className="hidden sm:inline">Verified</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Zone reference + advice */}
          <div className="flex flex-col gap-3">

            {/* Advice banner */}
            <div
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              <div
                className="p-1.5 rounded-xl flex-shrink-0 mt-0.5"
                style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}
              >
                <Icon style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest font-semibold mb-1" style={{ color: status.color }}>
                  Immediate Recommendation
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {status.advice}
                </p>
              </div>
            </div>

            {/* Zone reference list */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {zones.map((zone, i) => {
                const isActive = i === activeZoneIdx;
                return (
                  <div
                    key={zone.label}
                    className="flex items-center gap-3 px-4 py-2.5 transition-all duration-200"
                    style={{
                      background: isActive ? zone.bg : 'transparent',
                      borderBottom: i < zones.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {/* Color dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: zone.color,
                        boxShadow: isActive ? `0 0 8px ${zone.color}` : 'none',
                      }}
                    />

                    {/* Label */}
                    <span
                      className="text-xs font-semibold font-mono w-20 flex-shrink-0"
                      style={{ color: isActive ? zone.color : 'rgba(255,255,255,0.45)' }}
                    >
                      {zone.label}
                    </span>

                    {/* Mini bar */}
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: isActive ? `${(clamped - zone.range[0]) / (zone.range[1] - zone.range[0]) * 100}%` : '0%',
                          background: zone.color,
                          boxShadow: isActive ? `0 0 6px ${zone.color}` : 'none',
                          transition: 'width 0.8s ease-out',
                        }}
                      />
                    </div>

                    {/* Range */}
                    <span
                      className="text-[10px] font-mono w-14 text-right flex-shrink-0"
                      style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)' }}
                    >
                      {zone.range[0]}–{zone.range[1]}
                    </span>

                    {/* Active arrow */}
                    {isActive && (
                      <div
                        className="text-[10px] font-mono font-bold flex-shrink-0 flex items-center gap-1"
                        style={{ color: zone.color }}
                      >
                        <Activity style={{ width: 11, height: 11 }} />
                        <span>{clamped}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
