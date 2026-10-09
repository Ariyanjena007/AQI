import React, { useState } from 'react';
import { Alert } from '../../types';
import { AlertCircle, AlertTriangle, Info, Check, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentAlertsListProps {
  initialAlerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
}

export const RecentAlertsList: React.FC<RecentAlertsListProps> = ({
  initialAlerts,
  onAcknowledge,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const handleAck = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    onAcknowledge?.(id);
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-3 h-3" />
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/5 text-white/60 border border-white/10">
            <Info className="w-3 h-3" />
            Info
          </span>
        );
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-cyan-400/10 text-cyan-400">
            <Bell className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-white font-display">
            Active Telemetry Alerts
          </h3>
        </div>
        <Link
          to="/alerts"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          View All ({alerts.length}) →
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              alert.acknowledged ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getSeverityBadge(alert.severity)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white/90 font-sans">
                    {alert.type}
                  </h4>
                  <span className="text-[11px] font-mono text-white/40">
                    • {alert.deviceName}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5 font-sans leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
              <span className="text-[11px] font-mono text-white/40">
                {alert.time}
              </span>
              {alert.acknowledged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <Check className="w-3 h-3" />
                  Acknowledged
                </span>
              ) : (
                <button
                  onClick={() => handleAck(alert.id)}
                  className="px-3 py-1 text-[11px] font-mono font-medium rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
