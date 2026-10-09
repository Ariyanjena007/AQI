import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { EnvironmentalMapPage } from './pages/EnvironmentalMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DevicesPage } from './pages/DevicesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { ConnectionStatus, SensorValue } from './types';
import { INITIAL_SENSORS } from './services/demoData';
import { idbStorage } from './services/idbStorage';
import {
  DEFAULT_MONOCHROMATIC_THEME,
  applyMonochromaticTheme
} from './services/monochromaticThemes';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('aqi_theme') !== 'light';
  });

  // Monochromatic single-hue palette state
  const [monoTheme, setMonoTheme] = useState<string>(() => {
    return localStorage.getItem('aqi_mono_theme') || DEFAULT_MONOCHROMATIC_THEME;
  });

  // Connectivity & offline caching state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('ONLINE');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [sensors, setSensors] = useState<SensorValue[]>(INITIAL_SENSORS);

  // Apply dark mode class and monochromatic single-hue spectrum to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aqi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aqi_theme', 'light');
    }
    applyMonochromaticTheme(monoTheme, isDark);
    localStorage.setItem('aqi_mono_theme', monoTheme);
  }, [isDark, monoTheme]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectMonoTheme = (themeId: string) => {
    setMonoTheme(themeId);
  };

  // Service Worker and IndexedDB initialization
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker registration skipped/failed:', err);
      });
    }

    // Initialize IndexedDB
    idbStorage.init().then(async () => {
      const count = await idbStorage.getPendingCount();
      setPendingSyncCount(count);
    });

    // Detect browser online/offline events
    const handleOnline = () => {
      setConnectionStatus('SYNCING');
      setTimeout(() => setConnectionStatus('ONLINE'), 1000);
    };
    const handleOffline = () => {
      setConnectionStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live WebSocket connection to backend with graceful fallback
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws/telemetry');

        ws.onopen = () => {
          setConnectionStatus('ONLINE');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.sensors) {
              setSensors(data.sensors);
              idbStorage.saveTelemetry('latest_readings', data.sensors);
            }
          } catch (e) {
            // Ignore parse errors
          }
        };

        ws.onerror = () => {
          setConnectionStatus('ONLINE');
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };
      } catch (err) {
        setConnectionStatus('ONLINE');
      }
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Offline data sync action
  const handleSyncOfflineData = async () => {
    setConnectionStatus('SYNCING');
    setTimeout(async () => {
      const pending = await idbStorage.getPendingReadings();
      if (pending.length > 0) {
        const ids = pending.map((p) => p.id!).filter(Boolean);
        await idbStorage.markAsSynced(ids);
      }
      setPendingSyncCount(0);
      setConnectionStatus('ONLINE');
    }, 1200);
  };

  const handleToggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Application Workspace */}
        <Route
          element={
            <AppLayout
              connectionStatus={connectionStatus}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              pendingSyncCount={pendingSyncCount}
              onSyncOfflineData={handleSyncOfflineData}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              currentMonoThemeId={monoTheme}
              onSelectMonoTheme={handleSelectMonoTheme}
            />
          }
        >
          <Route path="/dashboard" element={<DashboardPage sensors={sensors} isSimulating={isSimulating} />} />
          <Route path="/live" element={<LiveMonitoringPage sensors={sensors} />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/ai-intelligence" element={<AiIntelligencePage />} />
          <Route path="/map" element={<EnvironmentalMapPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                isDark={isDark}
                onToggleTheme={toggleTheme}
                pendingSyncCount={pendingSyncCount}
                onSyncOfflineData={handleSyncOfflineData}
                currentMonoThemeId={monoTheme}
                onSelectMonoTheme={handleSelectMonoTheme}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
