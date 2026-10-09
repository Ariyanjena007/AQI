import React, { useState } from 'react';
import { HardwareTelemetryContract } from '../../types/digitalTwin';
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface HardwareTelemetryDrawerProps {
  telemetry: HardwareTelemetryContract;
}

export const HardwareTelemetryDrawer: React.FC<HardwareTelemetryDrawerProps> = ({ telemetry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(telemetry, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">LIVE TELEMETRY CONTRACT (JSON STREAM)</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
            SEQ #{telemetry.sequence_id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-[11px]">
              Ingesting 115,200 baud USB / Edge Simulator packet:
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/60 border border-slate-800/80 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed max-h-60">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
