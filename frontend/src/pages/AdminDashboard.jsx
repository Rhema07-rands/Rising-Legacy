import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Users, GraduationCap, Search, UserPlus } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import EnrollStudentModal from '../components/EnrollStudentModal';
import '../components.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total_students: 0,
    avg_cgpa: 0,
    active_courses: 0,
    transcripts_generated: 0
  });
  const [isEnrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div className="dashboard-layout">
    <Sidebar role="Admin" userName="Administrator" />

    <main className="dashboard-content">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Manage student records and track performance.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '30px', gap: '8px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px', fontSize: '0.875rem' }}
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => setEnrollModalOpen(true)}
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            <UserPlus size={18} />
            Enroll Student
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Total Students" value={stats.total_students} icon={Users} color="#6366f1" />
        <StatCard title="Dept. Avg. CGPA" value={stats.avg_cgpa.toFixed(2)} icon={GraduationCap} color="#f59e0b" />
        <StatCard title="Total Courses" value={stats.active_courses} icon={GraduationCap} color="#8b5cf6" />
        <StatCard title="Transcripts Issued" value={stats.transcripts_generated} icon={GraduationCap} color="#10b981" />
      </div>

      {/* Main Grid */}
      <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Registered Students</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Matric No</th>
              <th>Full Name</th>
              <th>Level</th>
              <th>CGPA</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No students found.</td></tr>
            ) : filteredStudents.map((s, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.username}</td>
                <td style={{ fontWeight: '600' }}>{s.full_name}</td>
                <td>{s.level}L</td>
                <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{s.total_cgpa.toFixed(2)}</td>
                <td>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '3px 10px', borderRadius: '9999px',
                    background: s.total_cgpa >= 4.5 ? 'rgba(16,185,129,0.1)' : s.total_cgpa >= 3.5 ? 'rgba(96,165,250,0.1)' : 'rgba(245,158,11,0.1)',
                    color: s.total_cgpa >= 4.5 ? '#34d399' : s.total_cgpa >= 3.5 ? '#60a5fa' : '#f59e0b'
                  }}>
                    {s.degree_classification}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </main>

    <EnrollStudentModal 
      isOpen={isEnrollModalOpen} 
      onClose={() => setEnrollModalOpen(false)}
      onSuccess={() => {
        setEnrollModalOpen(false);
        fetchStudents();
        fetchStats();
      }}
    />
  </div>
  );
};

export default AdminDashboard;
