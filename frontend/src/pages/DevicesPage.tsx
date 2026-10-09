import React, { useState } from 'react';
import { Device } from '../types';
import { INITIAL_DEVICES } from '../services/demoData';
import { EnvironmentalPulse } from '../components/common/EnvironmentalPulse';
import { 
  HardDrive, 
  Plus, 
  Battery, 
  Zap, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Play,
  Terminal
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testModalDevice, setTestModalDevice] = useState<Device | null>(null);
  const [pingLog, setPingLog] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // New Device Form state
  const [newDevice, setNewDevice] = useState({
    id: `NODE-Q-0${devices.length + 1}`,
    name: '',
    location: '',
    lat: '37.7833',
    lng: '-122.4167',
    hardwareModel: 'Arduino UNO Q + PMS5003 + SCD41 + BME688',
    firmwareVersion: 'v2.4.1-edge',
    commProtocol: 'MQTT / WebSocket (Dual)',
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.location) return;

    const created: Device = {
      id: newDevice.id,
      name: newDevice.name,
      location: newDevice.location,
      lat: parseFloat(newDevice.lat) || 37.7749,
      lng: parseFloat(newDevice.lng) || -122.4194,
      hardwareModel: newDevice.hardwareModel,
      firmwareVersion: newDevice.firmwareVersion,
      status: 'online',
      lastCommunication: 'Just now',
      sensorAvailability: {
        pm25: true,
        pm10: true,
        co2: true,
        temperature: true,
        humidity: true,
        voc: true,
        co: true,
        no2: false,
      },
      offlineBufferCount: 0,
    };

    setDevices([...devices, created]);
    setIsAddModalOpen(false);
    setNewDevice({
      id: `NODE-Q-0${devices.length + 2}`,
      name: '',
      location: '',
      lat: '37.7833',
      lng: '-122.4167',
      hardwareModel: 'Arduino UNO Q + PMS5003 + SCD41 + BME688',
      firmwareVersion: 'v2.4.1-edge',
      commProtocol: 'MQTT / WebSocket (Dual)',
    });
  };

  const handleTestConnection = (dev: Device) => {
    setTestModalDevice(dev);
    setIsTesting(true);
    setPingLog([
      `[0.00s] Initializing hardware bus handshake for ${dev.id}...`,
      `[0.12s] Probing I²C bus lines (SDA/SCL at 400kHz)...`,
    ]);

    setTimeout(() => {
      setPingLog((prev) => [
        ...prev,
        `[0.34s] ACK received from PMS5003 UART controller (9600 baud).`,
        `[0.55s] ACK received from Sensirion SCD41 at 0x62.`,
        `[0.72s] ACK received from Bosch BME688 at 0x76.`,
        `[0.98s] Zero parity errors detected. Local SQLite flash healthy.`,
        `[1.05s] Node status verified: SYNCHRONIZED & NOMINAL.`,
      ]);
      setIsTesting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div>
          <h2
            className="text-xl font-heading font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Hardware Node Fleet Management
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Configure Arduino UNO Q edge stations, audit bus health, and provision telemetry channels.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-xs font-semibold tracking-tight shadow-sm transition-all mono-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Node</span>
        </button>
      </div>

      {/* Devices Cards Grid */}
      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border rounded-lg p-5 shadow-sm space-y-4 transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Top row */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <HardDrive className="w-5 h-5" style={{ color: 'var(--brand)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {device.name}
                    </h3>
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {device.id}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{device.location}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <EnvironmentalPulse
                    status={device.status === 'online' ? 'active' : 'offline'}
                    showLabel={false}
                    size="sm"
                  />
                  <span
                    className="font-semibold uppercase"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {device.status}
                  </span>
                </div>

                <button
                  onClick={() => handleTestConnection(device)}
                  className="px-3 py-1.5 rounded text-xs font-mono font-medium border transition-colors flex items-center gap-1.5 hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Play className="w-3 h-3" style={{ color: 'var(--brand)' }} />
                  <span>Test Bus</span>
                </button>
              </div>
            </div>

            {/* Hardware Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>
                  Hardware Architecture
                </span>
                <span className="font-semibold truncate block" style={{ color: 'var(--text-primary)' }}>
                  {device.hardwareModel}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>
                  Firmware Release
                </span>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  {device.firmwareVersion}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>
                  Power Supply
                </span>
                <div className="flex items-center gap-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {device.batteryLevel !== undefined ? (
                    <>
                      <Battery className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                      <span>{device.batteryLevel}% (LiPo)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                      <span>AC 5V 2A Grid</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>
                  Last Synchronization
                </span>
                <span className="font-semibold block" style={{ color: 'var(--text-muted)' }}>
                  {device.lastCommunication}
                </span>
              </div>
            </div>

            {/* Sensor Availability Matrix */}
            <div
              className="pt-2 border-t"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span
                className="text-[10px] font-mono uppercase tracking-wider block mb-2 font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                Detected Hardware Sensor Channels
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                {Object.entries(device.sensorAvailability).map(([sensorKey, isAvail]) => (
                  <span
                    key={sensorKey}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-colors"
                    style={
                      isAvail
                        ? {
                            backgroundColor: 'var(--brand-light)',
                            color: 'var(--brand)',
                            borderColor: 'var(--border-color)',
                          }
                        : {
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-muted)',
                            borderColor: 'var(--border-color)',
                          }
                    }
                  >
                    {isAvail ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{sensorKey.toUpperCase()}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Add New Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="border rounded-xl p-6 shadow-xl w-full max-w-lg space-y-4"
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
                className="font-heading font-bold text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                Provision New Arduino UNO Q Node
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Device ID
                  </label>
                  <input
                    type="text"
                    value={newDevice.id}
                    onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
                    className="w-full p-2 rounded border focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Station Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. North Atrium Sensor"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="w-full p-2 rounded border focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Physical Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roof Tower 4, Intake Grate"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  className="w-full p-2 rounded border focus:outline-hidden"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={newDevice.lat}
                    onChange={(e) => setNewDevice({ ...newDevice, lat: e.target.value })}
                    className="w-full p-2 rounded border focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={newDevice.lng}
                    onChange={(e) => setNewDevice({ ...newDevice, lng: e.target.value })}
                    className="w-full p-2 rounded border focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 uppercase text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Hardware Sensor Configuration
                </label>
                <select
                  value={newDevice.hardwareModel}
                  onChange={(e) => setNewDevice({ ...newDevice, hardwareModel: e.target.value })}
                  className="w-full p-2 rounded border focus:outline-hidden"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="Arduino UNO Q + PMS5003 + SCD41 + BME688">Full Suite: UNO Q + PMS5003 + SCD41 + BME688</option>
                  <option value="Arduino UNO Q + PMS5003 + SCD41">Particulate + CO₂: UNO Q + PMS5003 + SCD41</option>
                  <option value="Arduino UNO Q + PMS5003 + BME688">Particulate + MEMS: UNO Q + PMS5003 + BME688</option>
                </select>
              </div>

              <div
                className="flex items-center justify-end gap-3 pt-3 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-mono transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white text-xs font-semibold shadow-sm transition-all mono-btn-primary"
                >
                  Save & Connect Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Connection Testing Terminal */}
      {testModalDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="border rounded-xl p-6 shadow-xl w-full max-w-lg space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                <h3
                  className="font-heading font-bold text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Hardware Bus Handshake Diagnostic — {testModalDevice.id}
                </h3>
              </div>
              <button
                onClick={() => setTestModalDevice(null)}
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Terminal View */}
            <div
              className="p-4 rounded-md font-mono text-xs space-y-1.5 h-64 overflow-y-auto border"
              style={{
                backgroundColor: 'hsl(220, 30%, 8%)',
                borderColor: 'var(--border-color)',
                color: 'hsl(220, 20%, 90%)',
              }}
            >
              {pingLog.map((logLine, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span style={{ color: 'var(--brand)' }}>❯</span> {logLine}
                </div>
              ))}
              {isTesting && (
                <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>
                  Executing hardware bus diagnostic...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs font-mono">
              <span style={{ color: 'var(--text-muted)' }}>
                No device secrets or private tokens are leaked in transport.
              </span>
              <button
                onClick={() => setTestModalDevice(null)}
                className="px-4 py-2 rounded border font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
