import React from 'react';
import { HARDWARE_COMPONENTS } from '../../services/digitalTwinConstants';
import { HardwareEntityId, HardwareTelemetryContract } from '../../types/digitalTwin';
import {
  X,
  ShieldCheck,
  Cpu,
  Activity,
  Zap,
  Radio,
  FileText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ComponentInspectorDrawerProps {
  selectedComponentId: HardwareEntityId | null;
  onClose: () => void;
  telemetry: HardwareTelemetryContract;
  onSelectComponent: (id: HardwareEntityId) => void;
}

export const ComponentInspectorDrawer: React.FC<ComponentInspectorDrawerProps> = ({
  selectedComponentId,
  onClose,
  telemetry,
  onSelectComponent,
}) => {
  if (!selectedComponentId) return null;

  const comp = HARDWARE_COMPONENTS.find((c) => c.id === selectedComponentId);
  if (!comp) return null;

  // Retrieve current live telemetry reading
  const liveVal = telemetry[comp.metricKey];
  const formattedVal =
    typeof liveVal === 'boolean'
      ? liveVal
        ? 'ACTIVE / ALARMING'
        : 'STANDBY / QUIET'
      : typeof liveVal === 'number'
      ? `${liveVal} ${comp.unit}`
      : String(liveVal ?? 'N/A');

  return (
    <div className="w-full lg:w-96 flex flex-col bg-slate-900/95 border border-cyan-500/30 rounded-2xl backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.7)] text-slate-100 overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header with Title and Close button */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: comp.colorAccent }}
            />
            <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400">
              {comp.category}
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">
            {comp.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-280px)] space-y-4 text-xs font-sans">
        {/* Live Telemetry Value Card ("Which sensor gives which data") */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
              {comp.datasheetSpec.interfaceType}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl font-black font-mono tracking-tight text-cyan-300">
                {formattedVal}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Target Metric: <strong className="text-white">{comp.detectedMetrics}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Which Sensor Gives Which Data Explanation */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold">
            <Radio className="w-3.5 h-3.5" />
            WHICH DATA THIS SENSOR PROVIDES
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {comp.metricExplanation}
          </p>
        </div>

        {/* Exact Schematic Pinout & Connection Role */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold">
            <Zap className="w-3.5 h-3.5" />
            CIRCUIT WIRING & PIN CONNECTIONS
          </div>
          <div className="text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] leading-relaxed break-words">
            {comp.pinoutRole}
          </div>
        </div>

        {/* Critical ADC Safety & Level Conditioning Guard */}
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            3.3V ADC VOLTAGE SAFETY GUARD
          </div>
          <p className="text-emerald-200/90 text-[11px] leading-relaxed">
            {comp.adcSafety}
          </p>
          <div className="text-[10px] font-mono text-emerald-400/80">
            Voltage Spec: {comp.voltageLogic}
          </div>
        </div>

        {/* Technical Datasheet Specs */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] font-semibold">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            HARDWARE SPECIFICATION
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
            <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 block">SUPPLY VOLTAGE</span>
              <span className="text-slate-200">{comp.datasheetSpec.supplyVoltage}</span>
            </div>
            <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 block">INTERFACE</span>
              <span className="text-slate-200">{comp.datasheetSpec.interfaceType}</span>
            </div>
          </div>
          {comp.datasheetSpec.analogDivider && (
            <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10.5px] font-mono">
              <span className="text-slate-500 block">RESISTOR DIVIDER RATIO</span>
              <span className="text-cyan-300">{comp.datasheetSpec.analogDivider}</span>
            </div>
          )}
        </div>

        {/* Quick Component Switcher */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Switch Hardware Component
          </span>
          <div className="flex flex-wrap gap-1.5">
            {HARDWARE_COMPONENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectComponent(item.id)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  item.id === selectedComponentId
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
