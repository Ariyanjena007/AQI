import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ConnectionStatus } from '../../types';
import { WifiOff, RefreshCw } from 'lucide-react';

interface AppLayoutProps {
  connectionStatus: ConnectionStatus;
  isDark: boolean;
  onToggleTheme: () => void;
  pendingSyncCount: number;
  onSyncOfflineData: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  currentMonoThemeId?: string;
  onSelectMonoTheme?: (id: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  connectionStatus,
  isDark,
  onToggleTheme,
  pendingSyncCount,
  onSyncOfflineData,
  isSimulating,
  onToggleSimulation,
  currentMonoThemeId = 'nordic-slate',
  onSelectMonoTheme = () => {},
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
      {/* Desktop Frosted Glass Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          connectionStatus={connectionStatus}
          pendingSyncCount={pendingSyncCount}
        />
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        connectionStatus={connectionStatus}
        currentMonoThemeId={currentMonoThemeId}
        onSelectMonoTheme={onSelectMonoTheme}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-[68px]' : 'lg:pl-64'
        }`}
      >
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          connectionStatus={connectionStatus}
          activeDeviceId="NODE-Q-01"
          isSimulating={isSimulating}
          onToggleSimulation={onToggleSimulation}
          currentMonoThemeId={currentMonoThemeId}
          onSelectMonoTheme={onSelectMonoTheme}
        />

        {/* Offline Alert Bar when disconnected */}
        {connectionStatus === 'OFFLINE' && (
          <div className="px-4 py-2.5 flex items-center justify-between text-xs font-mono bg-amber-500/10 border-b border-amber-500/20 text-amber-300 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Operating in <strong>Offline-First Mode</strong>. Edge logs cached locally in IndexedDB ({pendingSyncCount} records pending sync).
              </span>
            </div>
            <button
              onClick={onSyncOfflineData}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Reconnect</span>
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
