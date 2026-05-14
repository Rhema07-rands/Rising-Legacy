import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';
import { curriculum } from '../utils/curriculum';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeLevel, setActiveLevel] = useState(100);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/auth');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setActiveLevel(u.level || 100);
    fetchExistingGrades(u.id);
  }, [navigate]);

  const fetchExistingGrades = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/transcript/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const initialGrades = {};
        data.levels.forEach(l => {
          l.semesters.forEach(s => {
            s.courses.forEach(c => {
              initialGrades[c.course_code] = c.grade;
            });
          });
        });
        setGrades(initialGrades);
      }
    } catch (err) {
      console.error("Failed to load existing grades", err);
    }
  };

  const handleGradeChange = (code, val) => {
    setGrades(prev => ({ ...prev, [code]: val }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    // Construct payload from all levels in curriculum
    const payload = [];
    Object.keys(curriculum).forEach(lvl => {
      ['First', 'Second'].forEach(sem => {
        if(curriculum[lvl][sem]){
          curriculum[lvl][sem].forEach(c => {
            if (grades[c.code]) {
              payload.push({
                course_code: c.code,
                course_title: c.title,
                credit_units: c.units,
                grade: grades[c.code],
                semester: sem,
                level: parseInt(lvl)
              });
            }
          });
        }
      });
    });

    try {
      const res = await fetch(`${API_BASE}/courses/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: payload })
      });
      if (!res.ok) throw new Error('Failed to save grades');
      setMessage('Grades saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2>Student Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.full_name} ({user.username})</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={() => navigate('/transcript')}>
            View Transcript
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {message && (
        <div style={{ padding: '1rem', background: message.includes('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: message.includes('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: '8px', marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      <div className="glass-panel animate-fade-in">
        <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          {[100, 200, 300, 400].map(lvl => (
            <button 
              key={lvl}
              className={`btn ${activeLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveLevel(lvl)}
            >
              {lvl} Level
            </button>
          ))}
        </div>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {['First', 'Second'].map(sem => (
            <div key={sem}>
              <h3 style={{ color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {sem} Semester
              </h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Units</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {curriculum[activeLevel]?.[sem]?.map(course => (
                    <tr key={course.code}>
                      <td title={course.title}><strong>{course.code}</strong></td>
                      <td>{course.units}</td>
                      <td>
                        <select 
                          className="form-select" 
                          style={{ padding: '0.25rem 0.5rem', width: '80px' }}
                          value={grades[course.code] || ''}
                          onChange={(e) => handleGradeChange(course.code, e.target.value)}
                        >
                          <option value="">--</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {(!curriculum[activeLevel]?.[sem] || curriculum[activeLevel][sem].length === 0) && (
                    <tr><td colSpan="3" className="text-center">No courses found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Only courses with selected grades will be saved to your transcript.
          </p>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>
    </div>
  );
}
