import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Users, Search, Plus, Mail, BookOpen } from 'lucide-react';
import '../../components.css';

const mockStudents = [
  { id: 'CSC/2021/001', name: 'Adaeze Okonkwo',  level: 400, dept: 'Computer Science', cgpa: 4.81, status: 'Active' },
  { id: 'CSC/2021/002', name: 'Emeka Nwachukwu', level: 400, dept: 'Computer Science', cgpa: 3.65, status: 'Active' },
  { id: 'CSC/2022/001', name: 'Blessing Iyamu',  level: 300, dept: 'Computer Science', cgpa: 4.12, status: 'Active' },
  { id: 'CSC/2022/002', name: 'Tunde Fashola',   level: 300, dept: 'Computer Science', cgpa: 2.55, status: 'Active' },
  { id: 'CSC/2023/001', name: 'Chioma Eze',      level: 200, dept: 'Computer Science', cgpa: 3.90, status: 'Active' },
  { id: 'CSC/2023/002', name: 'Samuel Idahosa',  level: 200, dept: 'Computer Science', cgpa: 4.50, status: 'Active' },
];

const classColor = (cgpa) => {
  if (cgpa >= 4.5) return { bg: 'rgba(16,185,129,0.15)', color: '#34d399' };
  if (cgpa >= 3.5) return { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' };
  if (cgpa >= 2.4) return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
  return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
};

const classLabel = (cgpa) => {
  if (cgpa >= 4.5) return '1st Class';
  if (cgpa >= 3.5) return '2nd Upper';
  if (cgpa >= 2.4) return '2nd Lower';
  return '3rd Class';
};

export default function Students() {
  const [search, setSearch] = useState('');
  const filtered = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" userName="Administrator" />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Student Management</h1>
          <p>View, search and manage all enrolled students in the department.</p>
        </header>

        {/* Quick Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Students', value: mockStudents.length, icon: Users, color: '#6366f1' },
            { label: '1st Class', value: mockStudents.filter(s => s.cgpa >= 4.5).length, icon: BookOpen, color: '#10b981' },
            { label: '2nd Class Upper', value: mockStudents.filter(s => s.cgpa >= 3.5 && s.cgpa < 4.5).length, icon: BookOpen, color: '#3b82f6' },
            { label: 'Avg. CGPA', value: (mockStudents.reduce((a, s) => a + s.cgpa, 0) / mockStudents.length).toFixed(2), icon: BookOpen, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="stat-card glass-panel">
              <div className="stat-icon-wrapper" style={{ background: `${s.color}20` }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div className="stat-details">
                <h3>{s.label}</h3>
                <div className="stat-value" style={{ color: s.color, fontSize: '1.7rem' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.15rem' }}>All Students</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
                borderRadius: '8px', padding: '8px 14px',
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text" placeholder="Search by name or ID..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '200px', fontSize: '0.875rem' }}
                />
              </div>
              <button className="btn-primary"><Plus className="icon" /> Enroll Student</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Level</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Classification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const cc = classColor(s.cgpa);
                return (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.id}</td>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>{s.level}L</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.dept}</td>
                    <td style={{ fontWeight: '700', color: cc.color }}>{s.cgpa.toFixed(2)}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '600', background: cc.bg, color: cc.color }}>
                        {classLabel(s.cgpa)}
                      </span>
                    </td>
                    <td>
                      <button style={{
                        background: 'transparent', border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)', padding: '5px 12px',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        transition: 'all 0.2s ease',
                      }}>
                        <Mail size={13} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </main>
    </div>
  );
}
