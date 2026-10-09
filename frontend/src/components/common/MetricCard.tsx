import React from 'react';
import { SensorValue } from '../../types';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { SensorConfidenceBadge } from './SensorConfidenceBadge';

interface MetricCardProps {
  sensor: SensorValue;
  history?: number[];
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  sensor,
  history = [24, 26, 25, 29, 31, 33, 35.8],
  onClick,
}) => {
  const isPositive = sensor.changeRate > 0;
  const isNeutral = sensor.changeRate === 0;

  // Mini sparkline SVG generator
  const minVal = Math.min(...history);
  const maxVal = Math.max(...history);
  const range = maxVal - minVal || 1;
  const width = 110;
  const height = 34;
  const padding = 3;

  const points = history
    .map((val, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Value formatting
  const displayVal = sensor.value !== null 
    ? (typeof sensor.value === 'number' && sensor.value % 1 !== 0 
        ? sensor.value.toFixed(1) 
        : sensor.value)
    : '--';

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl cursor-pointer group transition-all duration-300 relative border border-white/10 ${
        !sensor.isAvailable ? 'opacity-60' : ''
      }`}
    >
      {/* Top Specular Edge Glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header Row: Label & Quality Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-white/70 font-mono">
            {sensor.label}
          </span>
        </div>
        <SensorConfidenceBadge status={sensor.quality} />
      </div>

      {/* Value & Sparkline Row */}
      <div className="flex items-baseline justify-between gap-3 my-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {displayVal}
          </span>
          <span className="text-xs font-mono text-white/50 font-medium">
            {sensor.unit}
          </span>
        </div>

        {/* Glowing SVG Sparkline */}
        {sensor.isAvailable && history.length > 1 && (
          <div className="h-8 w-24 flex items-center justify-end">
            <svg width={width} height={height} className="overflow-visible">
              <defs>
                <linearGradient id={`grad-${sensor.type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.4))',
                }}
              />
              {/* Highlight current point */}
              {history.length > 0 && (
                <circle
                  cx={padding + (width - padding * 2)}
                  cy={height - padding - ((history[history.length - 1] - minVal) / range) * (height - padding * 2)}
                  r="3"
                  fill="#ffffff"
                  stroke="#00E5FF"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Footer: Trend and Refresh Status */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs">
        {sensor.isAvailable ? (
          <div
            className={`flex items-center gap-1 font-mono text-[11px] font-medium ${
              isNeutral
                ? 'text-white/40'
                : isPositive
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {sensor.changeRate.toFixed(1)}% / hr
            </span>
          </div>
        ) : (
          <span className="font-mono text-[11px] text-white/40">
            Offline
          </span>
        )}

        <span className="text-[11px] font-mono text-white/40">
          {sensor.lastUpdated}
        </span>
      </div>
    </div>
  );
};
