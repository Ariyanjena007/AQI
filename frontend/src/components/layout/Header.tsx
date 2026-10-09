import React from 'react';
import {
  Bell,
  Moon,
  Sun,
  Menu,
  HardDrive,
  Wind
} from 'lucide-react';
import { ConnectionStatus } from '../../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  connectionStatus: ConnectionStatus;
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
  activeDeviceId?: string;
  onToggleSimulation?: () => void;
  isSimulating?: boolean;
  currentMonoThemeId?: string;
  onSelectMonoTheme?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  isDark,
  onToggleTheme,
  connectionStatus,
  unreadAlertsCount = 2,
  onOpenAlerts,
  activeDeviceId = 'NODE-Q-01',
  onToggleSimulation,
  isSimulating = true,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 bg-black/60 backdrop-blur-2xl border-b border-white/10 transition-colors">
      
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="font-display font-semibold text-sm tracking-tight text-white">
              AQ / Control Room
            </span>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.03] text-white/40 border border-white/5">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Right: Controls & Alerts */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Hardware / Simulator Feed Toggle */}
        <button
          onClick={onToggleSimulation}
          title="Toggle Hardware Stream / Edge Simulator"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span>Feed: {isSimulating ? 'Simulated' : 'Hardware'}</span>
        </button>

        {/* Live Device Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
          <span>{activeDeviceId}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenAlerts}
          aria-label="Open notifications"
          className="relative p-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF]" />
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 font-bold text-xs flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            A
          </div>
        </div>

      </div>
    </header>
  );
};
