import React from 'react';
import { AiInsight } from '../../types';
import { ArrowRight, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AiInsightCardProps {
  insight: AiInsight;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ insight }) => {
  const confidencePercent = Math.round(insight.confidence * 100);

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glass glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/80">
              Edge AI Inference
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono">
            <span className="text-white/40">Confidence:</span>
            <span className="text-cyan-400 font-semibold">{confidencePercent}%</span>
          </div>
        </div>

        {/* Observation Block */}
        <div className="space-y-3.5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              Anomaly Observation
            </span>
            <p className="text-sm font-semibold text-white/95 mt-0.5 leading-snug font-sans">
              {insight.observation}
            </p>
          </div>

          {/* Possible Explanation in Frosted Box */}
          <div className="glass-subtle p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Probable Causal Drivers
            </span>
            <p className="text-xs text-white/75 leading-relaxed font-sans">
              {insight.possibleExplanation}
            </p>
          </div>

          {/* Action Recommendation */}
          <div className="flex items-start gap-2.5 pt-1">
            <div className="p-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 mt-0.5 flex-shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-300 block">
                Recommended Action
              </span>
              <p className="text-xs text-white/70 leading-relaxed mt-0.5 font-sans">
                {insight.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link to deeper AI Intelligence analysis */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-white/40">
          {insight.timestamp}
        </span>
        <Link
          to="/ai-intelligence"
          className="inline-flex items-center gap-1.5 font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-xs"
        >
          <span>Examine Model Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
