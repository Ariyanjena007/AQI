import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { EnvironmentalTrendPoint } from '../../types';
import { Activity } from 'lucide-react';

interface TrendLineChartProps {
  data: EnvironmentalTrendPoint[];
  title?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  title = 'Particulate Matter Trends',
  timeRange = '24h',
  onTimeRangeChange,
}) => {
  const [activeSeries, setActiveSeries] = useState<{ pm25: boolean; pm10: boolean }>({
    pm25: true,
    pm10: true,
  });

  const ranges = ['15m', '1h', '6h', '24h'];

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col h-full relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-400/10 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-white font-display">
              {title}
            </h3>
          </div>
          <p className="text-xs font-mono text-white/40 mt-0.5">
            PM2.5 & PM10 Concentration History (µg/m³)
          </p>
        </div>

        {/* Time Filter Glass Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange?.(r)}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all duration-200 ${
                timeRange === r
                  ? 'bg-cyan-400 text-black font-semibold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-64 flex-1 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
              unit="µg"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="glass-elevated p-3 text-xs font-mono border border-white/20 rounded-xl shadow-2xl backdrop-blur-2xl">
                    <p className="text-white/40 mb-1.5 border-b border-white/10 pb-1 text-[11px]">
                      Time: {label}
                    </p>
                    {payload.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
                        <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name}:
                        </span>
                        <span className="font-semibold text-white">
                          {entry.value} µg/m³
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {activeSeries.pm25 && (
              <Line
                type="monotone"
                dataKey="pm25"
                name="PM2.5"
                stroke="#00E5FF"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, stroke: '#00E5FF', strokeWidth: 2, fill: '#FFFFFF' }}
              />
            )}
            {activeSeries.pm10 && (
              <Line
                type="monotone"
                dataKey="pm10"
                name="PM10"
                stroke="#A78BFA"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 5, stroke: '#A78BFA', strokeWidth: 2, fill: '#FFFFFF' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Series Toggle Footer */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-xs font-mono relative z-10">
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-white/80 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={activeSeries.pm25}
              onChange={() => setActiveSeries(prev => ({ ...prev, pm25: !prev.pm25 }))}
              className="accent-cyan-400 rounded"
            />
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00E5FF]" />
              PM2.5 (Fine Dust)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-white/80 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={activeSeries.pm10}
              onChange={() => setActiveSeries(prev => ({ ...prev, pm10: !prev.pm10 }))}
              className="accent-purple-400 rounded"
            />
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-1 border-b-2 border-dashed border-purple-400 inline-block" />
              PM10 (Coarse Dust)
            </span>
          </label>
        </div>
        <span className="text-[11px] text-white/40">
          Laser Particle Counter PMS5003
        </span>
      </div>
    </div>
  );
};
