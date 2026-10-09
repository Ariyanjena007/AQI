import React, { useState, useEffect } from 'react';
import { HardwareDigitalTwin3D } from '../components/digitalTwin/HardwareDigitalTwin3D';
import { ComponentInspectorDrawer } from '../components/digitalTwin/ComponentInspectorDrawer';
import { HardwareTelemetryDrawer } from '../components/digitalTwin/HardwareTelemetryDrawer';
import { HARDWARE_COMPONENTS } from '../services/digitalTwinConstants';
import { digitalTwinSimulator } from '../services/digitalTwinSimulator';
import { webSerialService } from '../services/webSerialService';
import {
  CameraPreset,
  HardwareEntityId,
  HardwareTelemetryContract,
} from '../types/digitalTwin';
import {
  Cpu,
  Layers,
  Zap,
  Eye,
  Camera,
  Flame,
  AlertOctagon,
  Wind,
  Volume2,
  Usb,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  // Telemetry state
  const [telemetry, setTelemetry] = useState<HardwareTelemetryContract>(
    digitalTwinSimulator.getSnapshot()
  );

  // 3D Viewport Controls state
  const [selectedComponentId, setSelectedComponentId] = useState<HardwareEntityId | null>('uno_q');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('full');
  const [showLabels, setShowLabels] = useState(true);
  const [showWires, setShowWires] = useState(true);

  // Serial & Simulation state
  const [serialStatus, setSerialStatus] = useState<string>('disconnected');
  const [serialMessage, setSerialMessage] = useState<string>('');
  const [activeHazardMode, setActiveHazardMode] = useState<string>('normal');

  // Simulation tick loop (1 second update rate)
  useEffect(() => {
    const interval = setInterval(() => {
      // If Web Serial is not active, run high-fidelity simulator
      if (serialStatus !== 'connected') {
        const next = digitalTwinSimulator.nextTick();
        setTelemetry(next);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [serialStatus]);

  // Set up Web Serial callbacks
  useEffect(() => {
    webSerialService.setCallbacks(
      (packet) => {
        setTelemetry((prev) => ({
          ...prev,
          ...packet,
          timestamp: new Date().toISOString(),
          connection: 'serial',
        }));
      },
      (status, msg) => {
        setSerialStatus(status);
        if (msg) setSerialMessage(msg);
      }
    );
  }, []);

  // Web Serial Connect / Disconnect toggle
  const handleToggleSerial = async () => {
    if (serialStatus === 'connected') {
      await webSerialService.disconnect();
    } else {
      await webSerialService.connect(115200);
    }
  };

  // Hazard injection handler
  const handleTriggerHazard = (mode: 'normal' | 'smoke_spike' | 'co_danger' | 'pristine') => {
    setActiveHazardMode(mode);
    digitalTwinSimulator.setHazardMode(mode);
  };

  // Manual buzzer toggle
  const handleToggleBuzzer = () => {
    digitalTwinSimulator.toggleBuzzerManual();
    setTelemetry(digitalTwinSimulator.getSnapshot());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Overview */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              3D Hardware Digital Twin
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Arduino UNO Q Bench
              </span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time, interactive 3D virtual hardware replica based on the physical circuit bench diagram.
            All 12 PCB entities, pinouts, 3.3V ADC resistor dividers, and live telemetry data paths.
          </p>
        </div>

        {/* Live Controls: Web Serial USB & Hazard Simulator */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Web Serial USB Button */}
          <button
            onClick={handleToggleSerial}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              serialStatus === 'connected'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Usb className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {serialStatus === 'connected'
                ? 'USB Connected (115.2k)'
                : serialStatus === 'connecting'
                ? 'Connecting...'
                : 'Connect Physical Arduino USB'}
            </span>
          </button>

          {/* Buzzer Siren Manual Test */}
          <button
            onClick={handleToggleBuzzer}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
              telemetry.buzzer_active
                ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            <span>Alarm Siren: {telemetry.buzzer_active ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Toolbar & Camera Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        {/* Camera Preset Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            Views:
          </span>
          {[
            { id: 'full', label: 'Full Bench' },
            { id: 'uno_q', label: 'Arduino UNO Q' },
            { id: 'mq_array', label: 'MQ Gas Array' },
            { id: 'sharp_dust', label: 'Sharp Dust' },
            { id: 'digital_display', label: 'Digital & Display' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id as CameraPreset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                cameraPreset === preset.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* View Toggles & Hazard Injection */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Wire Harness Toggle */}
          <button
            onClick={() => setShowWires(!showWires)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              showWires
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Zap className="w-3 h-3 inline mr-1 text-indigo-400" />
            Wiring {showWires ? 'Visible' : 'Hidden'}
          </button>

          {/* Quick Hazard Spikes */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleTriggerHazard('normal')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                activeHazardMode === 'normal'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleTriggerHazard('smoke_spike')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                activeHazardMode === 'smoke_spike'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Smoke Spike
            </button>
            <button
              onClick={() => handleTriggerHazard('co_danger')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                activeHazardMode === 'co_danger'
                  ? 'bg-red-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CO Danger
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport with Floating Inspector Drawer */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex">
        <div className="flex-1 h-full">
          <HardwareDigitalTwin3D
            telemetry={telemetry}
            selectedComponentId={selectedComponentId}
            onSelectComponent={(id) => setSelectedComponentId(id)}
            cameraPreset={cameraPreset}
            showLabels={showLabels}
            showWires={showWires}
          />
        </div>

        {/* Floating Inspector Drawer */}
        {selectedComponentId && (
          <div className="absolute top-4 right-4 z-30 max-w-sm w-full">
            <ComponentInspectorDrawer
              selectedComponentId={selectedComponentId}
              onClose={() => setSelectedComponentId(null)}
              telemetry={telemetry}
              onSelectComponent={(id) => setSelectedComponentId(id)}
            />
          </div>
        )}
      </div>

      {/* Quick Telemetry Strip: "Which Sensor Gives Which Data" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Sensor Telemetry Matrix — Which Sensor Gives Which Data
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Click any component to focus 3D model & inspect circuit pinout
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {HARDWARE_COMPONENTS.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            const liveVal = telemetry[comp.metricKey];
            const displayVal =
              typeof liveVal === 'boolean'
                ? liveVal
                  ? 'ALARM ON'
                  : 'STANDBY'
                : typeof liveVal === 'number'
                ? `${liveVal} ${comp.unit}`
                : String(liveVal ?? 'N/A');

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComponentId(comp.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: comp.colorAccent }}
                    />
                    <span className="font-bold text-xs text-white">
                      {comp.shortLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {comp.datasheetSpec.interfaceType}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black font-mono text-cyan-300">
                    {displayVal}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {comp.detectedMetrics.split(',')[0]}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {comp.metricExplanation}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-[170px] text-emerald-400/90">
                    ✓ {comp.voltageLogic.split('(')[0]}
                  </span>
                  <span className="text-cyan-400 hover:underline">
                    Inspect ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Telemetry JSON Stream Drawer */}
      <HardwareTelemetryDrawer telemetry={telemetry} />
    </div>
  );
};
