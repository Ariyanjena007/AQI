import React from 'react';
import { 
  Cpu, 
  BookOpen, 
  Activity 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Title */}
      <div
        className="pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <span
          className="text-xs uppercase font-mono tracking-wider font-semibold block mb-1"
          style={{ color: 'var(--brand)' }}
        >
          Technical Documentation & Scientific Lineage
        </span>
        <h2
          className="text-2xl font-heading font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          About the AQ Intelligence Platform
        </h2>
        <p
          className="text-xs font-mono mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Bridging physical environmental optics, edge microcontrollers, and statistical machine learning.
        </p>
      </div>

      {/* Arduino UNO Q Node Architecture */}
      <div
        className="border rounded-lg p-6 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Cpu className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Physical Hardware Infrastructure: Arduino UNO Q
          </h3>
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          The physical hardware monitoring station is centered on the <strong>Arduino UNO Q</strong> microcontroller platform. Featuring an energy-efficient ARM Cortex core with hardware floating-point acceleration, the UNO Q coordinates concurrent multi-protocol communication across UART, I²C, and SPI buses while executing local embedded predictive inference routines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div
            className="p-3 rounded border space-y-1"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              Plantower PMS5003
            </span>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Laser optical particle counter utilizing 90° light scattering to enumerate particles across 0.3µm, 0.5µm, 1.0µm, 2.5µm, and 10µm aerodynamic diameter bins.
            </p>
          </div>

          <div
            className="p-3 rounded border space-y-1"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              Sensirion SCD41
            </span>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Photoacoustic NDIR carbon dioxide transducer providing true optical absorption measurements from 400 to 5,000 ppm with on-die pressure and thermal self-calibration.
            </p>
          </div>

          <div
            className="p-3 rounded border space-y-1"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              Bosch BME688
            </span>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Digital 4-in-1 gas sensor equipped with MOx metal oxide semiconductor resistance to track volatile organic compound (VOC) index, humidity, and barometric pressure.
            </p>
          </div>
        </div>
      </div>

      {/* Edge AI & Mathematical Models */}
      <div
        className="border rounded-lg p-6 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Activity className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Edge AI Modeling & Causal Diagnostics
          </h3>
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          Rather than relying on black-box external cloud inference, the system implements an embedded two-tier architecture:
        </p>

        <ul className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: 'var(--brand)' }}
            />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Isolation Forest Anomaly Detection:</strong> Evaluates multi-dimensional feature vectors (PM2.5/PM10 ratio, VOC gradient, temperature rate of change) to flag sudden physical particulate surges within 90 seconds.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: 'var(--brand)' }}
            />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Diurnal Trajectory Forecasting:</strong> A regularized regression ensemble (Ridge + Seasonal Decomposition) predicts 1h to 12h concentration curves by capturing atmospheric boundary layer expansion and regional traffic rhythms.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: 'var(--brand)' }}
            />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Source Attribution Engine:</strong> Probabilistically correlates fine-to-coarse particulate ratios with auxiliary CO/VOC readings, providing explicit confidence bounds and scientific limitations rather than overclaiming causality.
            </span>
          </li>
        </ul>
      </div>

      {/* Offline Architecture & Scientific Standards */}
      <div
        className="border rounded-lg p-6 shadow-sm space-y-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <BookOpen className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Standards & Scientific Citations
          </h3>
        </div>

        <div className="space-y-3 text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
              1. EPA NAAQS 2024 Particle Exposure Standards
            </span>
            <span className="text-[11px]">
              Primary annual PM2.5 standard revised to 9.0 µg/m³; 24-hour standard sustained at 35.0 µg/m³ (40 CFR Part 50).
            </span>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
              2. World Health Organization (WHO) Global Air Quality Guidelines
            </span>
            <span className="text-[11px]">
              Guideline values for particulate matter (PM2.5: 15 µg/m³ 24h mean, PM10: 45 µg/m³ 24h mean), nitrogen dioxide, and ozone.
            </span>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
              3. ASHRAE Standard 62.1-2022 Ventilation for Acceptable Indoor Air Quality
            </span>
            <span className="text-[11px]">
              Carbon dioxide ventilation adequacy thresholds and continuous mechanical outdoor airflow benchmarks.
            </span>
          </div>
        </div>
      </div>

      {/* Monochromatic Design System & Editorial Philosophy */}
      <div
        className="mono-card p-6 space-y-4"
      >
        <div
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'var(--brand)', color: '#fff' }}>
            M
          </div>
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Design Philosophy: The Monochromatic Interface Architecture
          </h3>
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          A monochromatic design relies on variations of a <strong>single base color</strong>, employing mathematically calibrated <strong>tints</strong> (color + white), <strong>tones</strong> (color + gray), and <strong>shades</strong> (color + black) to create a cohesive, distraction-free environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div
            className="p-3.5 rounded-lg border space-y-1.5"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              1. Tints (L: 90% – 98%)
            </span>
            <p className="text-[11px] leading-normal" style={{ color: 'var(--text-muted)' }}>
              Created by mixing the base hue with pure white. Utilized for airy application canvases, card surfaces, luminous hover feedback, and ambient pill badges.
            </p>
          </div>

          <div
            className="p-3.5 rounded-lg border space-y-1.5"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              2. Tones (L: 45% – 75%)
            </span>
            <p className="text-[11px] leading-normal" style={{ color: 'var(--text-muted)' }}>
              Formed by desaturating the hue with balanced neutral gray. Powers crisp hairline border dividers, secondary telemetry metadata, and sparkline axes without visual aggression.
            </p>
          </div>

          <div
            className="p-3.5 rounded-lg border space-y-1.5"
            style={{
              backgroundColor: 'var(--brand-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold block" style={{ color: 'var(--brand)' }}>
              3. Shades (L: 8% – 35%)
            </span>
            <p className="text-[11px] leading-normal" style={{ color: 'var(--text-muted)' }}>
              Generated by deepening the hue toward black. Establishes authoritative typographic hierarchy, primary interaction buttons, and velvety dark-mode surfaces.
            </p>
          </div>
        </div>

        <div
          className="p-3.5 rounded-lg border flex items-start gap-3 mt-2"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--brand)' }} />
          <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <strong>Why Single-Color Architecture for Telemetry:</strong> In multi-sensor monitoring (PM2.5, PM10, CO₂, VOCs, BME688), arbitrary rainbow color schemes trigger cognitive fatigue. Monochromatic discipline lets luminance and typography communicate urgency, creating the refined visual calm of a Swiss architectural portfolio or museum exhibition catalogue.
          </p>
        </div>
      </div>

    </div>
  );
};
