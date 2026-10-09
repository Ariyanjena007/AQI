import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Save, 
  Trash2,
  Palette,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { MonochromaticPaletteSwitcher } from '../components/common/MonochromaticPaletteSwitcher';
import {
  MONOCHROMATIC_PALETTES,
  getMonochromaticTheme,
} from '../services/monochromaticThemes';

interface SettingsPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  pendingSyncCount: number;
  onSyncOfflineData: () => void;
  currentMonoThemeId?: string;
  onSelectMonoTheme?: (id: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDark,
  onToggleTheme,
  pendingSyncCount,
  onSyncOfflineData,
  currentMonoThemeId = 'nordic-slate',
  onSelectMonoTheme = () => {},
}) => {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [pollingFrequency, setPollingFrequency] = useState('1000');
  const [mqttBroker, setMqttBroker] = useState('mqtt://broker.aq-intelligence.local:1883');
  const [autoSyncOnReconnect, setAutoSyncOnReconnect] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const activeTheme = getMonochromaticTheme(currentMonoThemeId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleClearCache = async () => {
    if (confirm('Clear local IndexedDB telemetry cache?')) {
      indexedDB.deleteDatabase('AQIntelligenceDB');
      alert('Local offline telemetry cache cleared.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div
        className="pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="mono-badge">
            <Palette className="w-3 h-3" />
            <span>Monochromatic Architecture</span>
          </span>
        </div>
        <h2
          className="text-2xl font-heading font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          System Preferences & Monochromatic Studio
        </h2>
        <p
          className="text-xs font-mono mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Configure single-hue monochromatic palettes, tint/tone/shade calibration, edge telemetry bus, and local IndexedDB parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ── SECTION 1: Monochromatic Design Studio ── */}
        <div
          className="mono-card p-6 space-y-6"
        >
          <div className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3
                  className="text-base font-heading font-bold tracking-tight flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                  <span>Monochromatic Design Engine</span>
                </h3>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Employing variations of a single color (tints, shades, and tones) for editorial sophistication, unified focus, and gallery visual impact.
                </p>
              </div>

              <div
                className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--brand-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.previewColor }} />
                <span>Active: <strong>{activeTheme.name}</strong> ({activeTheme.hue}°)</span>
              </div>
            </div>
          </div>

          {/* Palette Cards Grid */}
          <MonochromaticPaletteSwitcher
            currentThemeId={currentMonoThemeId}
            onSelectTheme={onSelectMonoTheme}
            variant="full"
          />

          {/* Color Theory Demonstration Ramp */}
          <div
            className="p-4 rounded-xl border space-y-4"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
                Tints, Tones & Shades Spectral Breakdown · {activeTheme.name}
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                HSL: {activeTheme.hue}°, {activeTheme.saturation}%, L: 98% → 8%
              </span>
            </div>

            {/* 9-step monochromatic swatch ramp */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center text-[10px] font-mono">
              {[
                { label: '50 · Tint', role: 'Canvas', varName: '--mono-50' },
                { label: '100 · Tint', role: 'Surface', varName: '--mono-100' },
                { label: '150 · Tint', role: 'Card Base', varName: '--mono-150' },
                { label: '200 · Tone', role: 'Subtle Border', varName: '--mono-200' },
                { label: '300 · Tone', role: 'Line Rule', varName: '--mono-300' },
                { label: '400 · Tone', role: 'Muted Text', varName: '--mono-400' },
                { label: '600 · Brand', role: 'Accent Action', varName: '--brand' },
                { label: '800 · Shade', role: 'Headings', varName: '--mono-800' },
                { label: '900 · Shade', role: 'Anchor', varName: '--mono-900' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div
                    className="w-full h-8 rounded border shadow-2xs"
                    style={{
                      backgroundColor: `var(${step.varName})`,
                      borderColor: 'var(--border-color)',
                    }}
                  />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {step.label}
                  </span>
                  <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                    {step.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Live Monochromatic Editorial Preview Card */}
            <div className="pt-2">
              <div className="text-[11px] font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
                Live Architectural Editorial Preview:
              </div>
              <div
                className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 4px 16px var(--shadow-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-hover))' }}
                  >
                    AQ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Nordic Editorial Exhibition No. 04
                      </h4>
                      <span className="mono-badge">CURATED</span>
                    </div>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Cohesive single-color tonal balance eliminates chromatic conflict.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-xl font-bold block" style={{ color: 'var(--brand)' }}>
                      98.4%
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Tonal Harmony Index
                    </span>
                  </div>
                  <button type="button" className="mono-btn-primary text-xs py-1.5 px-3">
                    Sample Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Appearance & Light/Dark Mode ── */}
        <div
          className="mono-card p-6 space-y-4"
        >
          <h3
            className="text-sm font-semibold tracking-tight border-b pb-2"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            Luminance & Unit Standards
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Theme Toggle */}
            <div
              className="flex items-center justify-between p-3.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--brand-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Luminance Mode
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {isDark ? 'Calm Dark Mode (Shades & Luminous Tints)' : 'High-Key Light Mode (Airy Tints & Deep Shades)'}
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-lg border transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--brand)',
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Temperature Unit */}
            <div
              className="flex items-center justify-between p-3.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--brand-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Temperature Scale
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Celsius (°C) or Fahrenheit (°F)
                </span>
              </div>
              <div
                className="flex items-center gap-1 p-0.5 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setTempUnit('C')}
                  className="px-2.5 py-1 rounded text-xs transition-colors"
                  style={
                    tempUnit === 'C'
                      ? {
                          backgroundColor: 'var(--brand)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                        }
                      : {
                          color: 'var(--text-muted)',
                        }
                  }
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('F')}
                  className="px-2.5 py-1 rounded text-xs transition-colors"
                  style={
                    tempUnit === 'F'
                      ? {
                          backgroundColor: 'var(--brand)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                        }
                      : {
                          color: 'var(--text-muted)',
                        }
                  }
                >
                  °F
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Hardware & MQTT Bus Connectivity ── */}
        <div
          className="mono-card p-6 space-y-4"
        >
          <h3
            className="text-sm font-semibold tracking-tight border-b pb-2"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            Edge Bus & Hardware Parameters
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block uppercase text-[10px] mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                Local MQTT Broker Endpoint URI
              </label>
              <input
                type="text"
                value={mqttBroker}
                onChange={(e) => setMqttBroker(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-hidden"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--text-muted)' }}>
                Network endpoint polled by the Arduino UNO Q microcontroller.
              </span>
            </div>

            <div>
              <label className="block uppercase text-[10px] mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                Hardware Polling Interval
              </label>
              <select
                value={pollingFrequency}
                onChange={(e) => setPollingFrequency(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-hidden cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="500">500 ms (High-Frequency Diagnostic)</option>
                <option value="1000">1000 ms (Standard 1 Hz Environmental)</option>
                <option value="5000">5000 ms (Low-Power Energy Conservation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Offline-First Storage & Synchronization ── */}
        <div
          className="mono-card p-6 space-y-4"
        >
          <h3
            className="text-sm font-semibold tracking-tight border-b pb-2"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            Offline-First Data Storage & Reconciliation
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div
              className="flex items-center justify-between p-3.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--brand-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Auto-Sync on Reconnection
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Automatically flush local IndexedDB queue when WebSocket reconnects
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSyncOnReconnect}
                onChange={(e) => setAutoSyncOnReconnect(e.target.checked)}
                style={{ accentColor: 'var(--brand)' }}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-3.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--brand-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Cached Offline Records
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {pendingSyncCount} readings pending upstream synchronization
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSyncOfflineData}
                  className="px-3 py-1.5 rounded-lg border font-semibold transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--brand)',
                  }}
                >
                  Force Sync Now
                </button>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)',
                  }}
                  title="Clear cache"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedNotification ? (
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: 'var(--brand)' }}
            >
              ✓ Monochromatic configuration and system preferences updated.
            </span>
          ) : (
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              Changes are immediately applied to the entire application.
            </span>
          )}

          <button
            type="submit"
            className="mono-btn-primary"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
