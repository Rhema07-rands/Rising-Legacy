import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FileText, Download, Clock, CheckCircle, Search } from 'lucide-react';
import '../../components.css';

const mockTranscripts = [
  { id: 'TXP-001', student: 'Adaeze Okonkwo', studentId: 'CSC/2021/001', cgpa: 4.81, class: '1st Class',        requestDate: '2026-05-01', status: 'Approved' },
  { id: 'TXP-002', student: 'Emeka Nwachukwu',studentId: 'CSC/2021/002', cgpa: 3.65, class: '2nd Class Upper',  requestDate: '2026-05-02', status: 'Approved' },
  { id: 'TXP-003', student: 'Blessing Iyamu', studentId: 'CSC/2022/001', cgpa: 4.12, class: '2nd Class Upper',  requestDate: '2026-05-05', status: 'Pending' },
  { id: 'TXP-004', student: 'Samuel Idahosa', studentId: 'CSC/2023/002', cgpa: 4.50, class: '1st Class',        requestDate: '2026-05-07', status: 'Pending' },
  { id: 'TXP-005', student: 'Tunde Fashola',  studentId: 'CSC/2022/002', cgpa: 2.55, class: '2nd Class Lower',  requestDate: '2026-04-28', status: 'Approved' },
];

const statusStyle = {
  Approved: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', Icon: CheckCircle },
  Pending:  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', Icon: Clock },
};

const cgpaColor = (cgpa) => {
  if (cgpa >= 4.5) return '#34d399';
  if (cgpa >= 3.5) return '#60a5fa';
  return '#fbbf24';
};

export default function Transcripts() {
  const [search, setSearch] = useState('');
  const filtered = mockTranscripts.filter(t =>
    t.student.toLowerCase().includes(search.toLowerCase()) ||
    t.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const approved = mockTranscripts.filter(t => t.status === 'Approved').length;
  const pending  = mockTranscripts.filter(t => t.status === 'Pending').length;

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" userName="Administrator" />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Transcript Management</h1>
          <p>Review pending transcript requests and issue official documents.</p>
        </header>

        <div className="stats-grid">
          {[
            { label: 'Total Requests',  value: mockTranscripts.length, color: '#6366f1' },
            { label: 'Approved',        value: approved,               color: '#10b981' },
            { label: 'Pending Review',  value: pending,                color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="stat-card glass-panel">
              <div className="stat-icon-wrapper" style={{ background: `${s.color}20` }}>
                <FileText size={22} color={s.color} />
              </div>
              <div className="stat-details">
                <h3>{s.label}</h3>
                <div className="stat-value" style={{ color: s.color, fontSize: '1.7rem' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Transcript Requests</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text" placeholder="Search requests..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '200px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>CGPA</th>
                <th>Classification</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const ss = statusStyle[t.status];
                return (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{t.student}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.studentId}</div>
                    </td>
                    <td style={{ fontWeight: '700', color: cgpaColor(t.cgpa) }}>{t.cgpa.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t.class}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t.requestDate}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '600', background: ss.bg, color: ss.color }}>
                        <ss.Icon size={12} /> {t.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px', padding: '13px 14px' }}>
                      {t.status === 'Pending' && (
                        <button style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Approve
                        </button>
                      )}
                      {t.status === 'Approved' && (
                        <button style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Download size={12} /> PDF
                        </button>
                      )}
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
