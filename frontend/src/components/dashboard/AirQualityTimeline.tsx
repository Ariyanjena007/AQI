import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  aqi: number;
  type: string;
  note: string;
}

interface AirQualityTimelineProps {
  events?: TimelineEvent[];
}

export const AirQualityTimeline: React.FC<AirQualityTimelineProps> = ({
  events = [
    { time: '08:00 AM', title: 'Morning Transit Influx', aqi: 78, type: 'moderate', note: 'Commute traffic caused slight particulate elevation across perimeter sensors.' },
    { time: '11:30 AM', title: 'Filtration Active', aqi: 34, type: 'good', note: 'Indoor ventilation and breeze lowered PM2.5 to optimal clean baseline.' },
    { time: '02:15 PM', title: 'Solar Thermal Shift', aqi: 92, type: 'moderate', note: 'Afternoon heat reduced dispersion velocity temporarily.' },
    { time: '04:00 PM', title: 'Current Assessment', aqi: 102, type: 'moderate', note: 'Plateau stabilized; forecasted evening wind will clear local readings.' }
  ]
}) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-cyan-400/10 text-cyan-400">
            <Clock className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-white font-display">
            Daily Air Quality Timeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-white/40">
          Chronological Diurnal Flow
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {events.map((ev, idx) => {
          const isGood = ev.aqi <= 50;
          const isModerate = ev.aqi > 50 && ev.aqi <= 100;
          const color = isGood ? '#10B981' : isModerate ? '#00E5FF' : '#F59E0B';

          return (
            <div
              key={idx}
              className="glass-subtle p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-white/90">
                  {ev.time}
                </span>
                <span
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    borderColor: `${color}40`,
                  }}
                >
                  AQI {ev.aqi}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white/90 mb-1 font-sans">
                {ev.title}
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                {ev.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
