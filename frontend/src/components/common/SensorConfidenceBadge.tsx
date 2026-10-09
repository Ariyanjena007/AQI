import React from 'react';
import { QualityStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface SensorConfidenceBadgeProps {
  status: QualityStatus;
  showIcon?: boolean;
}

export const SensorConfidenceBadge: React.FC<SensorConfidenceBadgeProps> = ({
  status,
  showIcon = true,
}) => {
  const configs = {
    valid: {
      label: 'Live Active',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
      icon: CheckCircle2,
    },
    stale: {
      label: 'Cached',
      color: '#9CA3AF',
      bg: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      icon: Clock,
    },
    attention: {
      label: 'Calibrating',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: AlertTriangle,
    },
    unavailable: {
      label: 'No Signal',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      icon: AlertCircle,
    },
  };

  const current = configs[status] || configs.valid;
  const Icon = current.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium rounded-full backdrop-blur-md transition-colors"
      style={{
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
      }}
    >
      {showIcon && <Icon className="w-2.5 h-2.5 stroke-[2.5]" />}
      <span>{current.label}</span>
    </span>
  );
};
