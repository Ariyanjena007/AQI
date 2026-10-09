import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Device } from '../types';
import { INITIAL_DEVICES } from '../services/demoData';
import {
  Search,
  Layers,
  MapPin,
  Wifi,
  WifiOff,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9OqbVgibXD6UuDEw19mbE4zrdWHHazNA';

// AQI colour helper
const aqiColor = (aqi: number) => {
  if (aqi <= 50)  return '#10B981';
  if (aqi <= 100) return '#00E5FF';
  if (aqi <= 150) return '#F59E0B';
  if (aqi <= 200) return '#EF4444';
  return '#A855F7';
};

// Demo AQI values per device
const deviceAqi: Record<string, { aqi: number; pm25: number; pm10: number; co2: number; temp: number }> = {
  'NODE-Q-01': { aqi: 102, pm25: 35.8, pm10: 68.4, co2: 642, temp: 23.4 },
  'NODE-Q-02': { aqi: 61,  pm25: 18.2, pm10: 42.1, co2: 589, temp: 21.8 },
  'NODE-Q-03': { aqi: 28,  pm25: 8.1,  pm10: 19.3, co2: 410, temp: 19.2 },
};

// Dark Google Maps style
const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0a0a12' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a12' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: 'rgba(255,255,255,0.35)' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#14141f' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e1e2e' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#252540' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(255,255,255,0.5)' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#07071a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(0,229,255,0.3)' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0d0d1a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(255,255,255,0.2)' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0a1a12' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e2040' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(255,255,255,0.15)' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0c0c18' }] },
];

export const EnvironmentalMapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<google.maps.Map | null>(null);
  const markersRef      = useRef<google.maps.Marker[]>([]);
  const infoWindowRef   = useRef<google.maps.InfoWindow | null>(null);

  const [devices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device>(INITIAL_DEVICES[0]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [mapLoaded, setMapLoaded]           = useState(false);
  const [mapError, setMapError]             = useState<string | null>(null);
  const [showSatellite, setShowSatellite]   = useState(false);
  const [isRefreshing, setIsRefreshing]     = useState(false);

  const filteredDevices = devices.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build SVG marker icons
  const makeMarkerIcon = useCallback((device: Device, isSelected: boolean) => {
    const info = deviceAqi[device.id];
    const color = device.status === 'online' ? aqiColor(info?.aqi ?? 0) : '#4B5563';
    const size = isSelected ? 52 : 42;
    const aqi  = info?.aqi ?? '--';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 14}" viewBox="0 0 ${size} ${size + 14}">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="${isSelected ? 3 : 2}" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Pin body -->
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}"
          fill="${color}22" stroke="${color}" stroke-width="${isSelected ? 2.5 : 1.8}"
          filter="url(#glow)" />
        <!-- Inner circle -->
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 9}"
          fill="${color}33" />
        <!-- AQI text -->
        <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle"
          font-family="Outfit, sans-serif" font-size="${isSelected ? 14 : 11}" font-weight="800"
          fill="${color}" filter="url(#glow)">${aqi}</text>
        <!-- Tail -->
        <polygon points="${size / 2 - 5},${size - 2} ${size / 2},${size + 12} ${size / 2 + 5},${size - 2}"
          fill="${color}" opacity="0.9"/>
      </svg>`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(size, size + 14),
      anchor: new google.maps.Point(size / 2, size + 14),
    };
  }, []);

  // Build info window content
  const makeInfoContent = (device: Device) => {
    const info = deviceAqi[device.id];
    const color = device.status === 'online' ? aqiColor(info?.aqi ?? 0) : '#6B7280';
    const isOnline = device.status === 'online';
    return `
      <div style="
        background: #0e0e1a;
        border: 1px solid rgba(255,255,255,0.1);
        border-top: 1px solid ${color}50;
        border-radius: 14px;
        padding: 14px 16px;
        min-width: 220px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: rgba(255,255,255,0.85);
        box-shadow: 0 16px 40px rgba(0,0,0,0.7), 0 0 20px ${color}20;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div>
            <div style="font-size:10px; font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.35); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2px;">${device.id}</div>
            <div style="font-size:13px; font-weight:700; color:#fff;">${device.name}</div>
          </div>
          <div style="
            font-size:10px; font-family:'JetBrains Mono',monospace; font-weight:700;
            padding: 3px 8px; border-radius:999px;
            background: ${isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(75,85,99,0.2)'};
            color: ${isOnline ? '#10B981' : '#6B7280'};
            border: 1px solid ${isOnline ? 'rgba(16,185,129,0.35)' : 'rgba(107,114,128,0.3)'};
          ">${isOnline ? '● ONLINE' : '○ OFFLINE'}</div>
        </div>

        ${isOnline ? `
        <div style="
          background: ${color}15;
          border: 1px solid ${color}30;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 10px;
          text-align: center;
        ">
          <div style="font-size:10px; font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.35); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:2px;">AQI</div>
          <div style="font-size:28px; font-weight:900; color:${color}; font-family:'Outfit',sans-serif; letter-spacing:-0.03em; line-height:1; text-shadow: 0 0 20px ${color}60;">${info?.aqi ?? '--'}</div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px;">
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:7px 10px;">
            <div style="color:rgba(255,255,255,0.3); margin-bottom:2px; font-size:10px;">PM2.5</div>
            <div style="color:rgba(255,255,255,0.85); font-weight:700;">${info?.pm25} <span style="color:rgba(255,255,255,0.3); font-size:9px;">µg/m³</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:7px 10px;">
            <div style="color:rgba(255,255,255,0.3); margin-bottom:2px; font-size:10px;">PM10</div>
            <div style="color:rgba(255,255,255,0.85); font-weight:700;">${info?.pm10} <span style="color:rgba(255,255,255,0.3); font-size:9px;">µg/m³</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:7px 10px;">
            <div style="color:rgba(255,255,255,0.3); margin-bottom:2px; font-size:10px;">CO₂</div>
            <div style="color:rgba(255,255,255,0.85); font-weight:700;">${info?.co2} <span style="color:rgba(255,255,255,0.3); font-size:9px;">ppm</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:7px 10px;">
            <div style="color:rgba(255,255,255,0.3); margin-bottom:2px; font-size:10px;">Temp</div>
            <div style="color:rgba(255,255,255,0.85); font-weight:700;">${info?.temp} <span style="color:rgba(255,255,255,0.3); font-size:9px;">°C</span></div>
          </div>
        </div>` : `
        <div style="text-align:center; padding: 12px 0; color:rgba(255,255,255,0.3); font-size:12px; font-family:'JetBrains Mono',monospace;">
          Last seen: ${device.lastCommunication}
        </div>`}

        <div style="margin-top:10px; font-size:10px; font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.25); border-top:1px solid rgba(255,255,255,0.06); padding-top:8px;">
          ${device.lat.toFixed(4)}°N, ${Math.abs(device.lng).toFixed(4)}°W
        </div>
      </div>`;
  };

  // Initialise Google Maps
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current || !window.google?.maps) return;

      try {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 14,
          styles: DARK_MAP_STYLE,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#0a0a12',
        });

        mapRef.current = map;

        // Create shared info window
        infoWindowRef.current = new window.google.maps.InfoWindow({
          disableAutoPan: false,
        });

        // Style info window to remove default chrome
        window.google.maps.event.addListener(infoWindowRef.current, 'domready', () => {
          const iwOuter = document.querySelector('.gm-style-iw-a');
          if (iwOuter) {
            const parent = iwOuter.parentElement;
            if (parent) (parent as HTMLElement).style.background = 'transparent';
          }
          const closeBtn = document.querySelector('.gm-ui-hover-effect') as HTMLElement;
          if (closeBtn) {
            closeBtn.style.filter = 'invert(1) brightness(0.7)';
          }
          const iwInner = document.querySelector('.gm-style-iw-d') as HTMLElement;
          if (iwInner) {
            iwInner.style.overflow = 'hidden';
          }
          const iwContainer = document.querySelector('.gm-style-iw-c') as HTMLElement;
          if (iwContainer) {
            iwContainer.style.background = 'transparent';
            iwContainer.style.boxShadow = 'none';
            iwContainer.style.padding = '0';
            iwContainer.style.borderRadius = '0';
          }
          const iwTail = document.querySelector('.gm-style-iw-t') as HTMLElement;
          if (iwTail) iwTail.style.display = 'none';
        });

        setMapLoaded(true);
      } catch (err) {
        console.error('Error initializing map:', err);
        setMapError('Failed to initialize map');
      }
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    const scriptId = 'google-maps-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (script) {
      script.addEventListener('load', initMap);
      return () => {
        isMounted = false;
        script?.removeEventListener('load', initMap);
      };
    }

    script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    script.onerror = () => {
      if (isMounted) {
        setMapError('Failed to load Google Maps script. Check network or API key.');
      }
    };
    document.head.appendChild(script);

    return () => {
      isMounted = false;
    };
  }, []);

  // Add/refresh markers whenever map is ready or devices change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    filteredDevices.forEach(device => {
      const isSelected = selectedDevice.id === device.id;
      const icon = makeMarkerIcon(device, isSelected);

      const marker = new google.maps.Marker({
        position: { lat: device.lat, lng: device.lng },
        map: mapRef.current!,
        icon,
        title: device.name,
        zIndex: isSelected ? 10 : 1,
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
      });

      // Stop bounce after 2 cycles
      if (isSelected) {
        setTimeout(() => marker.setAnimation(null), 1400);
      }

      marker.addListener('click', () => {
        setSelectedDevice(device);
        mapRef.current!.panTo({ lat: device.lat, lng: device.lng });
        mapRef.current!.setZoom(15);

        infoWindowRef.current!.setContent(makeInfoContent(device));
        infoWindowRef.current!.open({ anchor: marker, map: mapRef.current! });
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, filteredDevices, selectedDevice, makeMarkerIcon]);

  // Switch map type
  useEffect(() => {
    if (!mapRef.current) return;
    if (showSatellite) {
      mapRef.current.setMapTypeId('hybrid');
      mapRef.current.setOptions({ styles: [] });
    } else {
      mapRef.current.setMapTypeId('roadmap');
      mapRef.current.setOptions({ styles: DARK_MAP_STYLE });
    }
  }, [showSatellite]);

  const handleSelectDevice = (dev: Device) => {
    setSelectedDevice(dev);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: dev.lat, lng: dev.lng });
      mapRef.current.setZoom(15);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const selected = deviceAqi[selectedDevice.id];
  const selectedColor = selectedDevice.status === 'online'
    ? aqiColor(selected?.aqi ?? 0)
    : '#6B7280';

  return (
    <div className="space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
              Live Geospatial Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
            Environmental Map
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1">
            Real-time node positions &amp; sensor telemetry on Google Maps.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search node..."
              className="pl-8 pr-3 py-2 rounded-xl text-xs font-mono focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            />
          </div>

          {/* Satellite toggle */}
          <button
            onClick={() => setShowSatellite(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all"
            style={{
              background: showSatellite ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showSatellite ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: showSatellite ? '#00E5FF' : 'rgba(255,255,255,0.5)',
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            {showSatellite ? 'Satellite' : 'Dark Map'}
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono glass-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 space-y-4">

          {/* Selected device detail card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${selectedColor}30`,
              borderTop: `1px solid ${selectedColor}50`,
              boxShadow: `0 0 30px ${selectedColor}15`,
            }}
          >
            {/* Header */}
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Selected Node
                  </div>
                  <h3 className="text-sm font-bold text-white">{selectedDevice.name}</h3>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {selectedDevice.id}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold"
                  style={{
                    background: selectedDevice.status === 'online' ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.15)',
                    border: `1px solid ${selectedDevice.status === 'online' ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`,
                    color: selectedDevice.status === 'online' ? '#10B981' : '#6B7280',
                  }}
                >
                  {selectedDevice.status === 'online'
                    ? <Wifi className="w-3 h-3" />
                    : <WifiOff className="w-3 h-3" />}
                  {selectedDevice.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* AQI Big Number */}
            {selectedDevice.status === 'online' && selected && (
              <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Current AQI
                    </div>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: selectedColor,
                        textShadow: `0 0 30px ${selectedColor}60`,
                      }}
                    >
                      {selected.aqi}
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {[
                      { icon: Wind,        label: 'PM2.5', val: `${selected.pm25}`, unit: 'µg/m³' },
                      { icon: Activity,    label: 'PM10',  val: `${selected.pm10}`, unit: 'µg/m³' },
                      { icon: Droplets,    label: 'CO₂',   val: `${selected.co2}`,  unit: 'ppm'   },
                      { icon: Thermometer, label: 'Temp',  val: `${selected.temp}`, unit: '°C'    },
                    ].map(({ icon: Icon, label, val, unit }) => (
                      <div
                        key={label}
                        className="p-2.5 rounded-xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {label}
                        </div>
                        <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {val} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="px-5 py-3 space-y-1.5">
              {[
                { label: 'Location', val: selectedDevice.location },
                { label: 'Hardware', val: selectedDevice.hardwareModel },
                { label: 'Firmware', val: selectedDevice.firmwareVersion },
                { label: 'Last Seen', val: selectedDevice.lastCommunication },
                { label: 'Coords', val: `${selectedDevice.lat.toFixed(4)}°N, ${Math.abs(selectedDevice.lng).toFixed(4)}°W` },
              ].map(({ label, val }) => (
                <div key={label} className="flex gap-2 text-[11px] font-mono">
                  <span className="w-20 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                  <span className="truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node list */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Active Nodes ({filteredDevices.length})
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {filteredDevices.map(dev => {
                const devInfo = deviceAqi[dev.id];
                const devColor = dev.status === 'online' ? aqiColor(devInfo?.aqi ?? 0) : '#6B7280';
                const isActive = selectedDevice.id === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => handleSelectDevice(dev)}
                    className="w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all hover:bg-white/[0.03]"
                    style={{
                      background: isActive ? `${devColor}10` : 'transparent',
                    }}
                  >
                    {/* AQI dot */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm"
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        background: `${devColor}18`,
                        border: `1px solid ${devColor}35`,
                        color: devColor,
                        textShadow: `0 0 10px ${devColor}60`,
                      }}
                    >
                      {dev.status === 'online' ? devInfo?.aqi ?? '--' : '--'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{dev.name}</span>
                        {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: devColor }} />}
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {dev.id} · {dev.status}
                      </span>
                    </div>
                    {/* Status dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: dev.status === 'online' ? '#10B981' : '#6B7280',
                        boxShadow: dev.status === 'online' ? '0 0 6px #10B981' : 'none',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* AQI legend */}
          <div
            className="rounded-2xl px-4 py-4"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              AQI Legend
            </div>
            <div className="space-y-2">
              {[
                { label: 'Good',      range: '0–50',   color: '#10B981' },
                { label: 'Moderate',  range: '51–100', color: '#00E5FF' },
                { label: 'Sensitive', range: '101–150',color: '#F59E0B' },
                { label: 'Unhealthy', range: '151–200',color: '#EF4444' },
                { label: 'Hazardous', range: '201+',   color: '#A855F7' },
              ].map(z => (
                <div key={z.label} className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: z.color, boxShadow: `0 0 6px ${z.color}80` }}
                  />
                  <span className="text-xs font-mono flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{z.label}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{z.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAP */}
        <div
          className="lg:col-span-8 rounded-2xl overflow-hidden relative"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            minHeight: 580,
          }}
        >
          {/* Error state */}
          {mapError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-8"
              style={{ background: '#0a0a12' }}>
              <MapPin className="w-12 h-12 mb-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <h3 className="text-sm font-semibold text-white mb-1">Map failed to load</h3>
              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{mapError}</p>
            </div>
          )}

          {/* Loading shimmer */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: '#0a0a12' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 flex items-center justify-center animate-pulse">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-xs font-mono text-white/40 animate-pulse">Loading Google Maps…</span>
              </div>
            </div>
          )}

          {/* Map container */}
          <div ref={mapContainerRef} className="w-full" style={{ height: 600 }} />

          {/* Map top overlay badge */}
          {mapLoaded && (
            <div
              className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono"
              style={{
                background: 'rgba(10,10,18,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
              <span>{devices.filter(d => d.status === 'online').length}/{devices.length} Nodes Online</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
