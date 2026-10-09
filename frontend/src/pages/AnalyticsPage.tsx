import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [exporting, setExporting] = useState<string | null>(null);

  // Weekly pattern dataset
  const weeklyData = [
    { day: 'Mon', pm25: 22.4, pm10: 42.1, co2: 540, aqi: 72 },
    { day: 'Tue', pm25: 28.1, pm10: 51.0, co2: 590, aqi: 84 },
    { day: 'Wed', pm25: 35.8, pm10: 68.4, co2: 642, aqi: 102 },
    { day: 'Thu', pm25: 31.2, pm10: 59.5, co2: 610, aqi: 91 },
    { day: 'Fri', pm25: 39.5, pm10: 74.0, co2: 680, aqi: 110 },
    { day: 'Sat', pm25: 18.2, pm10: 34.0, co2: 480, aqi: 62 },
    { day: 'Sun', pm25: 14.5, pm10: 29.1, co2: 460, aqi: 53 },
  ];

  // Location comparison dataset
  const locationComparison = [
    { name: 'Central Lab (Node-01)', avgPm25: 28.4, peakPm25: 44.2, uptime: '99.8%', completeness: '99.4%' },
    { name: 'Cleanroom Sensor B (Node-02)', avgPm25: 8.2, peakPm25: 14.0, uptime: '100%', completeness: '99.9%' },
    { name: 'Perimeter West (Node-03)', avgPm25: 41.6, peakPm25: 78.5, uptime: '94.2%', completeness: '91.8%' },
  ];

  const handleExportCSV = () => {
    setExporting('CSV');
    const headers = 'Day,PM2.5 (ug/m3),PM10 (ug/m3),CO2 (ppm),AQI\n';
    const rows = weeklyData.map(d => `${d.day},${d.pm25},${d.pm10},${d.co2},${d.aqi}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AQ_Analytics_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExporting(null), 800);
  };

  const handleExportPDF = () => {
    setExporting('PDF');
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Export Actions */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div>
          <h2
            className="text-xl font-heading font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Environmental Analytics & Trends
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Statistical distribution, diurnal cyclicality, and multi-node completeness metrics.
          </p>
        </div>

        {/* View Switcher & Export buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1 p-1 rounded-md border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1 rounded capitalize font-medium transition-colors"
                style={
                  viewMode === mode
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
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors shadow-2xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
              <span>{exporting === 'CSV' ? 'Exporting...' : 'Export CSV'}</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors shadow-2xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
              <span>{exporting === 'PDF' ? 'Preparing...' : 'Export Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Completeness & Quality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div
          className="p-4 rounded-lg border space-y-1"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="uppercase text-[10px] block" style={{ color: 'var(--text-muted)' }}>
            Network Data Completeness
          </span>
          <span className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>
            98.6%
          </span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            141,820 packets captured of 143,800 expected
          </p>
        </div>

        <div
          className="p-4 rounded-lg border space-y-1"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="uppercase text-[10px] block" style={{ color: 'var(--text-muted)' }}>
            Diurnal PM2.5 Peak
          </span>
          <span className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>
            44.2 µg/m³
          </span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Observed at 10:15 AM (Traffic Influx)
          </p>
        </div>

        <div
          className="p-4 rounded-lg border space-y-1"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="uppercase text-[10px] block" style={{ color: 'var(--text-muted)' }}>
            Mean Baseline PM2.5
          </span>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            24.6 µg/m³
          </span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Well within EPA NAAQS 24h standard
          </p>
        </div>

        <div
          className="p-4 rounded-lg border space-y-1"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="uppercase text-[10px] block" style={{ color: 'var(--text-muted)' }}>
            Sensor Bus Reliability
          </span>
          <span className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>
            99.9%
          </span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Zero I²C bus arbitration collision errors
          </p>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div
        className="border rounded-lg p-6 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h3
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Diurnal Particulate & Gas Distribution ({viewMode.toUpperCase()})
            </h3>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Comparative review of PM2.5 vs PM10 vs composite AQI over monitoring intervals.
            </p>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Unit: µg/m³ & AQI
          </span>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  return (
                    <div
                      className="border rounded p-3 text-xs font-mono shadow-md"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <p
                        className="font-bold mb-1 border-b pb-1"
                        style={{
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Interval: {label}
                      </p>
                      {payload.map((entry, idx) => (
                        <div key={idx} className="flex justify-between gap-4 py-0.5" style={{ color: entry.color }}>
                          <span>{entry.name}:</span>
                          <span className="font-semibold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
              <Bar dataKey="pm25" name="PM2.5 (µg/m³)" fill="var(--brand)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pm10" name="PM10 (µg/m³)" fill="var(--mono-400)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aqi" name="Composite AQI" fill="var(--mono-600)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Node Comparison Table */}
      <div
        className="border rounded-lg p-5 shadow-sm space-y-3 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Location & Hardware Node Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b text-[11px] font-mono uppercase"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <th className="pb-2 font-medium">Monitoring Location</th>
                <th className="pb-2 font-medium">Average PM2.5</th>
                <th className="pb-2 font-medium">Peak PM2.5</th>
                <th className="pb-2 font-medium">Node Uptime</th>
                <th className="pb-2 font-medium text-right">Data Completeness</th>
              </tr>
            </thead>
            <tbody
              className="divide-y font-mono"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {locationComparison.map((loc, idx) => (
                <tr key={idx} className="hover:opacity-85 transition-opacity">
                  <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {loc.name}
                  </td>
                  <td className="py-3 font-medium" style={{ color: 'var(--brand)' }}>
                    {loc.avgPm25} µg/m³
                  </td>
                  <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {loc.peakPm25} µg/m³
                  </td>
                  <td className="py-3" style={{ color: 'var(--text-muted)' }}>
                    {loc.uptime}
                  </td>
                  <td className="py-3 text-right font-semibold" style={{ color: 'var(--brand)' }}>
                    {loc.completeness}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
