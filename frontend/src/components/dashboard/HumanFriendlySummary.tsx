import React from 'react';
import { HelpCircle, AlertCircle, Compass, Wind } from 'lucide-react';

export const HumanFriendlySummary: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 font-mono">
            Plain Language Environmental Briefing
          </h3>
        </div>
        <span className="text-[11px] font-mono text-white/40">
          Generated automatically for quick decision-making
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. What Changed */}
        <div className="glass-subtle p-4 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <HelpCircle className="w-4 h-4" />
            <span className="font-display">What changed?</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            Fine respirable particles (PM2.5) rose by 4.2% over the last hour, shifting the index into a moderate category (102).
          </p>
        </div>

        {/* 2. Why it matters */}
        <div className="glass-subtle p-4 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span className="font-display">Why might it matter?</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            Fine dust lingers longer in still air. While safe for most, sensitive people with asthma may feel slight throat dryness.
          </p>
        </div>

        {/* 3. What to do next */}
        <div className="glass-subtle p-4 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Compass className="w-4 h-4" />
            <span className="font-display">What should I observe next?</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            Forecasted 3.5 m/s wind shift around 6:00 PM should naturally clear local dust pockets and restore green air ratings.
          </p>
        </div>
      </div>
    </div>
  );
};
