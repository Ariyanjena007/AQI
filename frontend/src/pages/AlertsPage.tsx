import React, { useState } from 'react';
import { Alert } from '../types';
import { INITIAL_ALERTS } from '../services/demoData';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Check, 
  Sliders 
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [thresholds, setThresholds] = useState({
    pm25Warning: 35.0,
    pm25Critical: 75.0,
    co2Warning: 1000,
    co2Critical: 2000,
  });

  const handleAcknowledge = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const filtered = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div>
          <h2
            className="text-xl font-heading font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Alerts & Environmental Thresholds
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Active threshold triggers, telemetry anomalies, and sensor bus loss notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Severity Filter */}
          <div
            className="flex items-center gap-1 p-1 rounded-md border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className="px-3 py-1 rounded capitalize transition-colors"
                style={
                  filterSeverity === sev
                    ? {
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--brand)',
                        fontWeight: 700,
                        boxShadow: '0 1px 2px hsla(220, 30%, 10%, 0.1)',
                      }
                    : {
                        color: 'var(--text-muted)',
                      }
                }
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Check className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
            <span>Ack All</span>
          </button>
        </div>
      </div>

      {/* Main Alerts List */}
      <div
        className="border rounded-lg p-5 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Incident Register ({filtered.length} entries)
          </h3>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Ordered by reverse chronological receipt
          </span>
        </div>

        <div
          className="divide-y"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={`py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity ${
                alert.acknowledged ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {alert.severity === 'critical' ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border"
                      style={{
                        backgroundColor: 'var(--brand-light)',
                        color: 'var(--brand)',
                        borderColor: 'var(--brand)',
                      }}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Critical
                    </span>
                  ) : alert.severity === 'warning' ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border"
                      style={{
                        backgroundColor: 'var(--brand-subtle)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Warning
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-muted)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <Info className="w-3.5 h-3.5" />
                      Info
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {alert.type}
                    </h4>
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      • {alert.deviceName} ({alert.deviceId})
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 self-end md:self-center text-xs font-mono">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {alert.time}
                </span>
                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 rounded border text-[11px] font-semibold transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Configuration Section */}
      <div
        className="border rounded-lg p-5 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Sliders className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Environmental Threshold Limits Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="text-[10px] uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>
              PM2.5 Warning Ceiling
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={thresholds.pm25Warning}
                onChange={(e) => setThresholds({ ...thresholds, pm25Warning: parseFloat(e.target.value) || 0 })}
                className="w-20 p-1 rounded border font-bold"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>µg/m³</span>
            </div>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="text-[10px] uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>
              PM2.5 Critical Action Limit
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={thresholds.pm25Critical}
                onChange={(e) => setThresholds({ ...thresholds, pm25Critical: parseFloat(e.target.value) || 0 })}
                className="w-20 p-1 rounded border font-bold"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--brand)',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>µg/m³</span>
            </div>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="text-[10px] uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>
              CO₂ Indoor Comfort Ceiling
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={thresholds.co2Warning}
                onChange={(e) => setThresholds({ ...thresholds, co2Warning: parseFloat(e.target.value) || 0 })}
                className="w-20 p-1 rounded border font-bold"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>ppm</span>
            </div>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="text-[10px] uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>
              CO₂ High Ventilation Limit
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={thresholds.co2Critical}
                onChange={(e) => setThresholds({ ...thresholds, co2Critical: parseFloat(e.target.value) || 0 })}
                className="w-20 p-1 rounded border font-bold"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--brand)',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>ppm</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
