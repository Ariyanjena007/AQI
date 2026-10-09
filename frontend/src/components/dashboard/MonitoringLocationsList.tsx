import React from 'react';
import { Device } from '../../types';
import { Battery, Zap, Radio, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MonitoringLocationsListProps {
  devices: Device[];
}

export const MonitoringLocationsList: React.FC<MonitoringLocationsListProps> = ({ devices }) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-cyan-400/10 text-cyan-400">
            <Radio className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-white font-display">
            Active Monitoring Nodes
          </h3>
        </div>
        <Link
          to="/devices"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Manage All Hardware ({devices.length}) →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-white/40">
              <th className="pb-3 font-medium">Node ID</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Architecture</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Power</th>
              <th className="pb-3 font-medium text-right">Heartbeat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {devices.map((device) => {
              const isOnline = device.status === 'online';
              return (
                <tr
                  key={device.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-3.5 font-mono font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOnline
                            ? 'bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse'
                            : 'bg-white/20'
                        }`}
                      />
                      <span>{device.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-white/80">
                    <div className="flex items-center gap-1.5 text-xs font-sans">
                      <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      <span className="truncate max-w-xs">{device.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-white/50">
                    {device.hardwareModel}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        isOnline
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      {device.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-white/60">
                    {device.batteryLevel !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <Battery className="w-3.5 h-3.5 text-white/50" />
                        <span>{device.batteryLevel}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Mains AC</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-right text-white/40">
                    {device.lastCommunication}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
