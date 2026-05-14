import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'var(--accent-primary)' }) => {
  const isPositive = trend >= 0;

  return (
    <div className="stat-card glass-panel">
      <div className="stat-icon-wrapper" style={{ background: `${color}20` }}>
        <Icon size={22} color={color} />
      </div>
      <div className="stat-details">
        <h3>{title}</h3>
        <div className="stat-value" style={{ color }}>{value}</div>
        {trend !== undefined && (
          <p className="stat-label" style={{
            color: isPositive ? '#34d399' : '#f87171',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <span style={{
              fontSize: '0.75rem',
              background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              padding: '1px 6px', borderRadius: '4px', fontWeight: '600',
            }}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>vs last semester</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
