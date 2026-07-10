import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle, Shield } from 'lucide-react';

interface BadgeProps {
  status: 'verified' | 'pending' | 'flagged' | 'rejected';
  size?: 'sm' | 'md';
}

const config = {
  verified: { icon: CheckCircle, label: 'KYC Verified', className: 'verified' },
  pending: { icon: Clock, label: 'Pending Review', className: 'pending' },
  flagged: { icon: AlertTriangle, label: 'Flagged', className: 'flagged' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'rejected' },
};

export function KYCBadge({ status, size = 'md' }: BadgeProps) {
  const { icon: Icon, label, className } = config[status];
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`kyc-badge ${className}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
}

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreGauge({ score, size = 80, label }: ScoreGaugeProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return '#10B981';
    if (s >= 50) return '#FBBF24';
    if (s >= 25) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="score-gauge" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle className="gauge-track" cx={size / 2} cy={size / 2} r={radius} />
          <circle
            className="gauge-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="gauge-value" style={{ color: getColor(score) }}>
          {score}
        </span>
      </div>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  );
}

interface TrustShieldProps {
  score: number;
  verified: boolean;
}

export function TrustShield({ score, verified }: TrustShieldProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Shield
          size={28}
          className={verified ? 'text-accent-500' : 'text-navy-500'}
          fill={verified ? 'rgba(16, 185, 129, 0.15)' : 'none'}
        />
        {verified && (
          <CheckCircle
            size={12}
            className="absolute -bottom-0.5 -right-0.5 text-accent-400 bg-navy-900 rounded-full"
          />
        )}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{score}/100</div>
        <div className="text-xs text-gray-400">Trust Score</div>
      </div>
    </div>
  );
}
