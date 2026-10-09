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
  X
} from 'lucide-react';
import { ConnectionStatus } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  connectionStatus: ConnectionStatus;
  currentMonoThemeId?: string;
  onSelectMonoTheme?: (id: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  connectionStatus,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/live', icon: Activity },
    { label: '3D Digital Twin', path: '/digital-twin', icon: Box },
    { label: 'AI Intelligence', path: '/ai-intelligence', icon: Cpu },
    { label: 'Environmental Map', path: '/map', icon: MapPin },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Devices', path: '/devices', icon: HardDrive },
    { label: 'Alerts', path: '/alerts', icon: Bell },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Glass Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col justify-between bg-black/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="overflow-y-auto">
          {/* Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-xs text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                AQ
              </div>
              <div>
                <span className="font-display font-bold text-sm block text-white">
                  AQ Intelligence
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Node-Q-01 Live
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-white/40">
            <span>Hardware Edge:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
