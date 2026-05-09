import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Users, BookOpen, GraduationCap, TrendingUp, Search, Bell, FileText, Settings } from 'lucide-react';
import '../components.css';

const recentGrades = [
  { name: 'Adaeze Okonkwo',  course: 'CSC-401', grade: 'A',  gp: 5.0, status: 'Verified' },
  { name: 'Emeka Nwachukwu', course: 'MTH-205', grade: 'B',  gp: 4.0, status: 'Verified' },
  { name: 'Blessing Iyamu',  course: 'PHY-101', grade: 'A',  gp: 5.0, status: 'Pending'  },
  { name: 'Tunde Fashola',   course: 'CSC-302', grade: 'C',  gp: 3.0, status: 'Verified' },
  { name: 'Samuel Idahosa',  course: 'CSC-201', grade: 'A',  gp: 5.0, status: 'Pending'  },
];

const quickActions = [
  { label: 'Generate Transcript', icon: FileText,     color: '#6366f1' },
  { label: 'Enroll New Student',  icon: Users,        color: '#8b5cf6' },
  { label: 'Create Course',       icon: BookOpen,     color: '#ec4899' },
  { label: 'System Settings',     icon: Settings,     color: '#64748b' },
];

const AdminDashboard = () => (
  <div className="dashboard-layout">
    <Sidebar role="Admin" userName="Administrator" />

    <main className="dashboard-content">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Administrator. Here's what's happening today.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '30px', gap: '8px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search students, courses..."
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px', fontSize: '0.875rem' }}
            />
          </div>

          <button style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
            padding: '10px', borderRadius: '50%', color: 'var(--text-primary)',
            cursor: 'pointer', position: 'relative', display: 'flex',
          }}>
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '8px', height: '8px', background: '#ef4444',
              borderRadius: '50%', border: '2px solid var(--bg-primary)',
            }} />
          </button>

          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem',
          }}>A</div>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Total Students"      value="2,845" icon={Users}         trend={12.5} />
        <StatCard title="Active Courses"      value="142"   icon={BookOpen}      trend={3.2}  />
        <StatCard title="Dept. Avg. CGPA"     value="3.89"  icon={GraduationCap} trend={0.8}  />
        <StatCard title="Transcripts Issued"  value="8,401" icon={TrendingUp}    trend={24.1} />
      </div>

      {/* Main Grid */}
      <div className="admin-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Grades Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Grade Submissions</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>View All</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th>GP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentGrades.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '600' }}>{row.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.course}</td>
                  <td>
                    <span style={{
                      background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)',
                      padding: '3px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem',
                    }}>{row.grade}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row.gp.toFixed(1)}</td>
                  <td>
                    <span style={{ color: row.status === 'Verified' ? '#10b981' : '#f59e0b', fontSize: '0.85rem', fontWeight: '500' }}>
                      {row.status === 'Verified' ? '✓' : '⏳'} {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quickActions.map((action, i) => (
              <button key={i} className="action-card" style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-md)', color: 'var(--text-primary)',
                cursor: 'pointer', transition: 'all var(--transition-fast)', width: '100%',
              }}>
                <div style={{ background: `${action.color}20`, color: action.color, padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                  <action.icon size={18} />
                </div>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* CGPA Scale Reference */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>BIU CGPA Scale</p>
            {[
              { range: '4.50 – 5.00', label: '1st Class',       color: '#34d399' },
              { range: '3.50 – 4.49', label: '2nd Class Upper', color: '#60a5fa' },
              { range: '2.40 – 3.49', label: '2nd Class Lower', color: '#fbbf24' },
              { range: '1.50 – 2.39', label: '3rd Class',       color: '#f87171' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: c.color, fontFamily: 'monospace' }}>{c.range}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default AdminDashboard;
