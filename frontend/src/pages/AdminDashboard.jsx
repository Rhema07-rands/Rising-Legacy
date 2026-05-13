import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Users, BookOpen, GraduationCap, TrendingUp, Search, Bell, FileText, Settings } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import EnrollStudentModal from '../components/EnrollStudentModal';
import '../components.css';

const recentGrades = [
  { name: 'Adaeze Okonkwo',  course: 'CSC-401', grade: 'A',  gp: 5.0, status: 'Verified' },
  { name: 'Emeka Nwachukwu', course: 'MTH-205', grade: 'B',  gp: 4.0, status: 'Verified' },
  { name: 'Blessing Iyamu',  course: 'PHY-101', grade: 'A',  gp: 5.0, status: 'Pending'  },
  { name: 'Tunde Fashola',   course: 'CSC-302', grade: 'C',  gp: 3.0, status: 'Verified' },
  { name: 'Samuel Idahosa',  course: 'CSC-201', grade: 'A',  gp: 5.0, status: 'Pending'  },
];

const quickActions = [
  { id: 'enroll', label: 'Enroll New Student',  icon: Users,        color: '#8b5cf6' },
  { id: 'transcript', label: 'Generate Transcript', icon: FileText,     color: '#6366f1' },
  { id: 'course', label: 'Create Course',       icon: BookOpen,     color: '#ec4899' },
  { id: 'settings', label: 'System Settings',     icon: Settings,     color: '#64748b' },
];

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [isEnrollModalOpen, setEnrollModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleActionClick = (id) => {
    if (id === 'enroll') setEnrollModalOpen(true);
  };

  return (
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
            <h3 style={{ fontSize: '1.1rem' }}>Registered Students</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>View All</button>
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
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '15px'}}>No students enrolled yet.</td></tr>
              ) : students.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.student_id}</td>
                  <td style={{ fontWeight: '600' }}>{row.full_name}</td>
                  <td>{row.level}L</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{row.department}</td>
                  <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{row.cgpa.toFixed(2)}</td>
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
              <button key={i} onClick={() => handleActionClick(action.id)} className="action-card" style={{
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

    <EnrollStudentModal 
      isOpen={isEnrollModalOpen} 
      onClose={() => setEnrollModalOpen(false)}
      onSuccess={() => {
        setEnrollModalOpen(false);
        fetchStudents();
      }}
    />
  </div>
  );
};

export default AdminDashboard;
