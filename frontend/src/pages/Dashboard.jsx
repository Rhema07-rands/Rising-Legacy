import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Award, TrendingUp, BookOpen, FileText } from 'lucide-react';
import API_BASE from '../api';
import { curriculum } from '../utils/curriculum';
import '../components.css';

const classification = (c) => {
  const n = parseFloat(c);
  if (isNaN(n) || n === 0) return { label: 'N/A', color: '#64748b' };
  if (n >= 4.5) return { label: '1st Class Honours', color: '#34d399' };
  if (n >= 3.5) return { label: '2nd Class Upper',   color: '#60a5fa' };
  if (n >= 2.4) return { label: '2nd Class Lower',   color: '#fbbf24' };
  return              { label: '3rd Class',           color: '#f87171' };
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeLevel, setActiveLevel] = useState(100);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Stats state
  const [currentCgpa, setCurrentCgpa] = useState(0.0);
  const [degreeClass, setDegreeClass] = useState("N/A");
  const [coursesTaken, setCoursesTaken] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

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
        let totalC = 0;
        let totalU = 0;
        
        data.levels.forEach(l => {
          l.semesters.forEach(s => {
            s.courses.forEach(c => {
              initialGrades[c.course_code] = c.grade;
              totalC += 1;
              totalU += c.credit_units;
            });
          });
        });
        
        setGrades(initialGrades);
        setCurrentCgpa(data.total_cgpa);
        setDegreeClass(data.degree_classification || "N/A");
        setCoursesTaken(totalC);
        setTotalCredits(totalU);
      }
    } catch (err) {
      console.error("Failed to load existing grades", err);
    }
  };

  const getPoints = (grade) => {
    const map = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
    return map[grade] !== undefined ? map[grade] : null;
  };

  const calculateGpa = (level, semester) => {
    let tqp = 0;
    let tcu = 0;
    let courses = [];
    
    if (semester === 'All') {
      courses = [...(curriculum[level]?.['First'] || []), ...(curriculum[level]?.['Second'] || [])];
    } else {
      courses = curriculum[level]?.[semester] || [];
    }

    courses.forEach(c => {
      const g = grades[c.code];
      const pts = getPoints(g);
      if (pts !== null) {
        tqp += pts * c.units;
        tcu += c.units;
      }
    });

    return tcu > 0 ? (tqp / tcu).toFixed(2) : "0.00";
  };

  const handleGradeChange = (code, val) => {
    setGrades(prev => ({ ...prev, [code]: val }));
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
      
      // Refresh stats
      fetchExistingGrades(user.id);
      
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const cls = classification(currentCgpa);
  const displayClassLabel = degreeClass !== "N/A" ? degreeClass : cls.label;
  const userName = user?.full_name || user?.username || "Student";

  return (
    <div className="dashboard-layout">
      <Sidebar role="Student" userName={userName} />
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Track your academic performance and manage transcript requests.</p>
        </header>

        {message && (
          <div style={{ padding: '1rem', background: message.includes('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: message.includes('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: '8px', marginBottom: '1rem' }}>
            {message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="Current CGPA" value={currentCgpa.toFixed(2)} icon={Award} color="#f59e0b" />
          <StatCard title="Classification" value={displayClassLabel} icon={TrendingUp} color={cls.color} />
          <StatCard title="Courses Taken" value={coursesTaken} icon={BookOpen} color="#6366f1" />
          <StatCard title="Total Credits" value={totalCredits} icon={FileText} color="#8b5cf6" />
        </div>

        {/* Grade Input Section */}
        <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
            {[100, 200, 300, 400].map(lvl => (
              <button 
                key={lvl}
                className={`btn ${activeLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveLevel(lvl)}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                {lvl} Level
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {['First', 'Second'].map(sem => (
              <div key={sem}>
                <h3 style={{ color: 'var(--accent-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '15px', fontSize: '1.1rem' }}>
                  {sem} Semester
                </h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Code</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Units</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curriculum[activeLevel]?.[sem]?.map(course => (
                      <tr key={course.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td title={course.title} style={{ padding: '12px 10px', fontWeight: '600' }}>{course.code}</td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{course.units}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <select 
                            style={{ 
                              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', 
                              color: '#fff', padding: '6px 12px', borderRadius: '6px', width: '70px',
                              outline: 'none'
                            }}
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
                      <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No courses found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* GPA Summary Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px',
            marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>1st Semester GPA</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>{calculateGpa(activeLevel, 'First')}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>2nd Semester GPA</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>{calculateGpa(activeLevel, 'Second')}</span>
              </div>
              <div style={{ paddingLeft: '20px', borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontWeight: '600' }}>{activeLevel}L Total GPA</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{calculateGpa(activeLevel, 'All')}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ padding: '12px 32px' }}>
                {loading ? 'Saving...' : 'Save Grades'}
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Grades must be saved to update overall CGPA</span>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
