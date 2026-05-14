import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        navigate('/auth');
        return false;
      }
      const u = JSON.parse(stored);
      if (u.role !== 'Admin') {
        navigate('/dashboard');
        return false;
      }
      return true;
    };

    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/students`);
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (checkAuth()) {
      fetchStudents();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>System Administrator</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="glass-panel animate-fade-in">
        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>All Registered Students</h3>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric No</th>
              <th>Level</th>
              <th>Total CGPA</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td><strong>{s.full_name}</strong></td>
                <td>{s.username}</td>
                <td>{s.level}</td>
                <td>
                  <span className={`badge ${s.total_cgpa >= 3.5 ? 'badge-success' : s.total_cgpa >= 2.4 ? 'badge-info' : s.total_cgpa >= 1.5 ? 'badge-warning' : 'badge-danger'}`}>
                    {s.total_cgpa.toFixed(2)}
                  </span>
                </td>
                <td>{s.degree_classification}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan="5" className="text-center" style={{ padding: '2rem' }}>No students registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
