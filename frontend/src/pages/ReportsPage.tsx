import React, { useState } from 'react';
import { INITIAL_REPORTS } from '../services/demoData';
import { ReportItem } from '../types';
import { 
  FileText, 
  Download, 
  Plus, 
  Clock, 
  FileSpreadsheet, 
  Printer, 
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newRep: ReportItem = {
        id: `REP-2026-${Date.now().toString().slice(-4)}`,
        title: 'Ad-hoc Multi-Sensor Audit & Air Quality Compliance',
        period: 'Last 7 Days (Auto-Aggregated)',
        format: 'PDF',
        size: '2.1 MB',
        dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Ready',
      };
      setReports([newRep, ...reports]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleDownload = (rep: ReportItem) => {
    const content = `AQ INTELLIGENCE COMPLIANCE AUDIT\nID: ${rep.id}\nTitle: ${rep.title}\nPeriod: ${rep.period}\nStatus: Verified\nStandards: EPA NAAQS 2024 / WHO Air Quality Guidelines\nHardware Node: Arduino UNO Q Fleet\nGenerated: ${rep.dateGenerated}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${rep.id}_compliance_summary.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div>
          <h2
            className="text-xl font-heading font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Environmental Compliance & Research Reports
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Audit-ready formal summaries aligned with EPA NAAQS, WHO guidelines, and ASHRAE ventilation benchmarks.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-xs font-semibold tracking-tight shadow-sm transition-all disabled:opacity-50 mono-btn-primary"
        >
          {isGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{isGenerating ? 'Compiling Telemetry...' : 'Generate New Report'}</span>
        </button>
      </div>

      {/* Reports Table */}
      <div
        className="border rounded-lg p-5 shadow-sm space-y-4 transition-colors"
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
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Generated Document Archive
          </h3>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Total {reports.length} compiled records
          </span>
        </div>

        <div
          className="divide-y font-mono text-xs"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {reports.map((report) => (
            <div
              key={report.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: 'var(--brand-light)',
                    color: 'var(--brand)',
                  }}
                >
                  {report.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4
                      className="font-semibold text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {report.title}
                    </h4>
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {report.id}
                    </span>
                  </div>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Period: {report.period} • Size: {report.size} • Created: {report.dateGenerated}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => setPreviewReport(report)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Eye className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white text-xs transition-all shadow-xs mono-btn-primary"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {report.format}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="border rounded-xl p-6 shadow-xl w-full max-w-2xl space-y-4"
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
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--brand)' }} />
                <h3
                  className="font-heading font-bold text-base"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Environmental Audit Document Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div
              className="p-6 rounded border font-mono text-xs space-y-3 leading-relaxed"
              style={{
                backgroundColor: 'var(--brand-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div
                className="border-b pb-2 flex justify-between"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {previewReport.title}
                  </h4>
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Document ID: {previewReport.id}
                  </span>
                </div>
                <span
                  className="font-bold"
                  style={{ color: 'var(--brand)' }}
                >
                  STATUS: COMPLIANT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] py-1">
                <div>
                  <span className="block" style={{ color: 'var(--text-muted)' }}>
                    Reporting Interval
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {previewReport.period}
                  </span>
                </div>
                <div>
                  <span className="block" style={{ color: 'var(--text-muted)' }}>
                    Primary Hardware Sensor Array
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Arduino UNO Q + PMS5003 + SCD41
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-primary)' }}>
                Summary: Over the observation interval, particulate concentrations remained 98.4% within acceptable boundaries under EPA 24-hour PM2.5 standards (35 µg/m³ threshold). Carbon dioxide averages sustained nominal levels (584 ppm), confirming effective HVAC ventilation recirculation.
              </p>

              <div
                className="pt-2 border-t text-[10px] flex justify-between"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Cryptographic Hash: 8bfa942c12...49e</span>
                <span>Digitally signed by Edge-RF Ensemble</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 rounded text-xs font-mono transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded text-white text-xs font-mono font-semibold transition-all mono-btn-primary"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
