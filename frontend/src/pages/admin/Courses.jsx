import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { BookOpen, Plus, Search } from 'lucide-react';
import '../../components.css';

const mockCourses = [
  { code: 'CSC101', title: 'Introduction to Computer Science', units: 3, semester: 'First',  level: 100, lecturer: 'Dr. Amaka Obi' },
  { code: 'CSC201', title: 'Data Structures & Algorithms',     units: 3, semester: 'First',  level: 200, lecturer: 'Dr. Emeka Uche' },
  { code: 'CSC301', title: 'Operating Systems',                units: 3, semester: 'First',  level: 300, lecturer: 'Dr. Ngozi Eze' },
  { code: 'CSC302', title: 'Database Management Systems',      units: 3, semester: 'Second', level: 300, lecturer: 'Dr. Bello Adamu' },
  { code: 'CSC401', title: 'Software Engineering',             units: 3, semester: 'First',  level: 400, lecturer: 'Prof. K. Osaghae' },
  { code: 'CSC402', title: 'Artificial Intelligence',          units: 3, semester: 'Second', level: 400, lecturer: 'Dr. Chuka Nwosu' },
  { code: 'MTH101', title: 'Calculus I',                       units: 3, semester: 'First',  level: 100, lecturer: 'Dr. Yemi Adewale' },
  { code: 'PHY101', title: 'General Physics I',                units: 3, semester: 'First',  level: 100, lecturer: 'Dr. Sola Akin' },
];

const semesterColor = { First: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }, Second: { bg: 'rgba(236,72,153,0.15)', color: '#f9a8d4' } };

export default function Courses() {
  const [search, setSearch] = useState('');
  const filtered = mockCourses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" userName="Administrator" />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Course Management</h1>
          <p>Manage all department courses, credit units, and lecturer assignments.</p>
        </header>

        <div className="stats-grid">
          {[
            { label: 'Total Courses',  value: mockCourses.length, color: '#6366f1' },
            { label: 'First Semester', value: mockCourses.filter(c => c.semester === 'First').length,  color: '#a5b4fc' },
            { label: 'Second Semester',value: mockCourses.filter(c => c.semester === 'Second').length, color: '#f9a8d4' },
            { label: 'Total Credit Units', value: mockCourses.reduce((a, c) => a + c.units, 0), color: '#34d399' },
          ].map((s, i) => (
            <div key={i} className="stat-card glass-panel">
              <div className="stat-icon-wrapper" style={{ background: `${s.color}20` }}>
                <BookOpen size={22} color={s.color} />
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
            <h2 style={{ fontSize: '1.15rem' }}>All Courses</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px' }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text" placeholder="Search courses..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '180px', fontSize: '0.875rem' }}
                />
              </div>
              <button className="btn-primary"><Plus className="icon" /> Add Course</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Level</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Lecturer</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = semesterColor[c.semester];
                return (
                  <tr key={c.code}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent-primary)' }}>{c.code}</td>
                    <td style={{ fontWeight: '500' }}>{c.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.level}L</td>
                    <td style={{ textAlign: 'center' }}>{c.units}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '600', background: sc.bg, color: sc.color }}>
                        {c.semester}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.lecturer}</td>
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
