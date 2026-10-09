import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Activity,
  WifiOff,
  BarChart2,
  HardDrive,
  Terminal,
  Wind,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { EnvironmentalPulse } from '../components/common/EnvironmentalPulse';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-400 selection:text-black">
      
      {/* ── Background Ambient Light Refraction Orbs ── */}
      <div className="fixed -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Top Navigation Bar (Frosted Glass) ── */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-elevated px-5 py-3.5 flex items-center justify-between rounded-full border border-white/10 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-xs text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              AQ
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                AQ Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-white/60">
            <a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#hardware" className="hover:text-cyan-400 transition-colors">Edge Nodes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-block text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="glass-btn-accent text-xs font-mono py-2 px-4 flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-24 pb-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text */}
          <div className="lg:col-span-7 space-y-7">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
              <span>Arduino UNO Q · Edge ML Telemetry Online</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
              See the Air.{' '}
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Understand the Change.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans max-w-xl">
              An intelligent, glass-crafted environmental intelligence platform. Transforms complex particulate sensor streams into clear, human-understandable insights and real-time forecasts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/dashboard" className="glass-btn-accent text-sm py-3 px-6">
                <span>Enter Live Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <a href="#technology" className="glass-btn text-sm py-3 px-5">
                Explore Technology
              </a>
            </div>

            {/* Micro specs strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
              <div>
                <span className="text-white/40 block">Inference Engine</span>
                <span className="font-semibold text-white mt-0.5 block">Edge Random Forest</span>
              </div>
              <div>
                <span className="text-white/40 block">Hardware Link</span>
                <span className="font-semibold text-cyan-400 mt-0.5 block">I²C / UART Dual-Bus</span>
              </div>
              <div>
                <span className="text-white/40 block">Network Fallback</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">Zero-Loss Offline DB</span>
              </div>
            </div>
          </div>

          {/* Right Hero Frosted Glass Card */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                    Live Telemetry Node
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/40">
                  Node-Q-01 · Active
                </span>
              </div>

              {/* Central AQI dial mini preview */}
              <div className="glass-subtle p-5 rounded-2xl border border-white/10 text-center mb-4 relative overflow-hidden">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-5xl font-display font-bold text-white tracking-tight">
                    42
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider self-start mt-2">
                    AQI
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  Optimal Air Quality
                </span>
                <p className="text-xs text-white/60 mt-2 font-sans">
                  Particulate concentrations are minimal. Windows can remain open.
                </p>
              </div>

              {/* 4 Sensor Micro Tiles */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-white/40 text-[10px] block">PM2.5 Laser</span>
                  <span className="text-cyan-400 font-semibold text-sm">35.8 µg/m³</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-white/40 text-[10px] block">CO₂ NDIR</span>
                  <span className="text-emerald-400 font-semibold text-sm">642 ppm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-white/40 text-[10px] block">Temperature</span>
                  <span className="text-white font-semibold text-sm">22.4 °C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-white/40 text-[10px] block">Relative Humidity</span>
                  <span className="text-white font-semibold text-sm">48.2 %</span>
                </div>
              </div>

              {/* Micro Stream Bus */}
              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-center text-[11px] font-mono text-white/60">
                <span className="text-cyan-400 font-semibold">Offline-First Engine</span> · Continuous sync with zero data drop
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 1: Core Pillars ── */}
      <section id="technology" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2 font-semibold">
            Core Philosophy
          </span>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">
            Precision Science, Zero Visual Clutter.
          </h2>
          <p className="text-sm text-white/60 mt-2 font-sans leading-relaxed">
            Unlike legacy portals crowded with complex tables, AQ Intelligence pairs laboratory-grade laser scattering with intuitive glassmorphic visualizations that make environmental health obvious in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Activity,
              title: 'Multi-Channel Telemetry',
              body: 'Continuous streaming across PM1.0, PM2.5, PM10 laser channels, non-dispersive infrared CO₂, VOC organic index, and ambient humidity.',
            },
            {
              icon: Cpu,
              title: 'Embedded Edge Machine Learning',
              body: 'On-device models run directly on the Arduino microcontroller to predict rapid spikes, traffic surges, and dispersion trends with no server lag.',
            },
            {
              icon: WifiOff,
              title: 'Resilient Offline Continuity',
              body: 'Local IndexedDB cache stores sensor telemetry during field disconnections, then seamlessly reconciles with cloud nodes on reconnect.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">{title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Architecture Stages ── */}
      <section id="architecture" className="py-20 px-6 max-w-6xl mx-auto relative z-10 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2 font-semibold">
            System Pipeline
          </span>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">
            From Sensor Optics to Human Action.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { stage: 'STAGE 01', title: 'Laser Detection', body: 'PMS5003 laser diode scatters light across particles 0.3µm to 10µm in size.' },
            { stage: 'STAGE 02', title: 'Edge Filtering', body: 'Microcontroller filters electrical noise and calculates rolling baseline distributions.' },
            { stage: 'STAGE 03', title: 'Dual Dispatch', body: 'Data streams instantly over WebSocket and writes to offline flash memory.' },
            { stage: 'STAGE 04', title: 'Glass Interface', body: 'Clear, elegant frosted interface presents instant status and plain-language guidance.' },
          ].map(({ stage, title, body }) => (
            <div
              key={stage}
              className="glass-subtle p-5 rounded-2xl border border-white/5 space-y-2 hover:border-white/15 transition-all"
            >
              <span className="font-mono font-bold text-xs text-cyan-400">{stage}</span>
              <h4 className="text-sm font-semibold text-white font-sans">{title}</h4>
              <p className="text-xs text-white/50 leading-relaxed font-sans">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-white/10 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF]" />
          <span>AQ Intelligence · Atmospheric Control Station</span>
        </div>
        <div>
          <span>Crafted with Dark Glassmorphism</span>
        </div>
      </footer>

    </div>
  );
};
