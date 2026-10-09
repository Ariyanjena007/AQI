import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Box,
  Cpu,
  MapPin,
  BarChart3,
  HardDrive,
  Bell,
  FileText,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  RefreshCw,
  Wind
} from 'lucide-react';
import { EnvironmentalPulse } from '../common/EnvironmentalPulse';
import { ConnectionStatus } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  connectionStatus: ConnectionStatus;
  pendingSyncCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  connectionStatus,
  pendingSyncCount,
}) => {
  const navItems = [
    { label: 'Overview',          path: '/dashboard',       icon: LayoutDashboard },
    { label: 'Live Monitoring',   path: '/live',            icon: Activity },
    { label: '3D Digital Twin',   path: '/digital-twin',    icon: Box },
    { label: 'AI Intelligence',   path: '/ai-intelligence', icon: Cpu },
    { label: 'Environmental Map', path: '/map',             icon: MapPin },
    { label: 'Analytics',         path: '/analytics',       icon: BarChart3 },
    { label: 'Devices',           path: '/devices',         icon: HardDrive },
    { label: 'Alerts',            path: '/alerts',          icon: Bell },
    { label: 'Reports',           path: '/reports',         icon: FileText },
    { label: 'Settings',          path: '/settings',        icon: Settings },
    { label: 'About Project',     path: '/about',           icon: Info },
  ];

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'ONLINE':
        return (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
            <span>ONLINE</span>
          </span>
        );
      case 'SYNCING':
        return (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>SYNCING</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-white/40">
            <WifiOff className="w-3 h-3" />
            <span>OFFLINE {pendingSyncCount > 0 ? `(${pendingSyncCount})` : ''}</span>
          </span>
        );
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen flex flex-col justify-between transition-all duration-300 bg-black/80 backdrop-blur-2xl border-r border-white/10 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* ── Brand Header ── */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center flex-shrink-0 text-black font-bold text-xs tracking-tight shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-transform group-hover:scale-105">
              AQ
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="font-display font-bold text-sm tracking-tight block text-white">
                  AQ Intelligence
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 truncate block">
                  Node-Q-01 · Edge AI
                </span>
              </div>
            )}
          </NavLink>
        </div>

        {/* ── Navigation ── */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-semibold border border-white/15 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── Footer: Status & Collapse ── */}
      <div className="p-3 space-y-2 border-t border-white/10">
        {/* Connection Status Pill */}
        <div className={`px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Network
              </span>
              {getStatusIndicator()}
            </div>
          ) : (
            <div className="flex justify-center" title={`Status: ${connectionStatus}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            </div>
          )}
        </div>

        {/* Collapse button & Profile */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-xs flex items-center justify-center flex-shrink-0 text-white shadow-md">
              A
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <p className="text-xs font-semibold text-white truncate font-sans">
                  Analyst Room
                </p>
                <p className="text-[10px] font-mono text-white/40 truncate">
                  Node-Q-01 Lead
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar collapse"
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
