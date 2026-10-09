import React from 'react';

interface EnvironmentalPulseProps {
  status?: 'active' | 'idle' | 'warning' | 'offline';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const EnvironmentalPulse: React.FC<EnvironmentalPulseProps> = ({
  status = 'active',
  label = 'Sensor Bus Active',
  size = 'md',
  showLabel = true,
}) => {
  const colorMap = {
    active: {
      dotBg: 'var(--brand)',
      ringBg: 'hsla(var(--mono-h, 220), var(--mono-s, 30%), 55%, 0.35)',
      textColor: 'var(--brand)',
    },
    idle: {
      dotBg: 'var(--mono-400)',
      ringBg: 'hsla(var(--mono-h, 220), var(--mono-s, 20%), 55%, 0.2)',
      textColor: 'var(--text-muted)',
    },
    warning: {
      dotBg: 'var(--mono-600)',
      ringBg: 'hsla(var(--mono-h, 220), var(--mono-s, 30%), 45%, 0.25)',
      textColor: 'var(--text-primary)',
    },
    offline: {
      dotBg: 'var(--mono-300)',
      ringBg: 'hsla(var(--mono-h, 220), 10%, 50%, 0.15)',
      textColor: 'var(--text-muted)',
    },
  };

  const current = colorMap[status];

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <div className="inline-flex items-center gap-2 select-none" title={`Hardware pulse: ${status}`}>
      <span className="relative flex items-center justify-center">
        {status === 'active' && (
          <span
            className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
            style={{
              backgroundColor: current.ringBg,
              animationDuration: '2.5s',
            }}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${sizeClasses[size]}`}
          style={{ backgroundColor: current.dotBg }}
        />
      </span>
      {showLabel && (
        <span
          className="text-xs font-mono font-medium tracking-tight"
          style={{ color: current.textColor }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
