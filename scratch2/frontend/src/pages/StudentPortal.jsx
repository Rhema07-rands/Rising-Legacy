import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Award, Download, FileText, BookOpen, TrendingUp } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import '../components.css';


const gradeBadge = { A: '#34d399', B: '#60a5fa', C: '#fbbf24', D: '#fb923c', E: '#f87171', F: '#ef4444' };

const cgpa = (gs) => {
  const tqp = gs.reduce((a, g) => a + g.gp * g.units, 0);
  const tcu = gs.reduce((a, g) => a + g.units, 0);
  return (tqp / tcu).toFixed(2);
};

const classification = (c) => {
  const n = parseFloat(c);
  if (n >= 4.5) return { label: '1st Class Honours', color: '#34d399' };
  if (n >= 3.5) return { label: '2nd Class Upper',   color: '#60a5fa' };
  if (n >= 2.4) return { label: '2nd Class Lower',   color: '#fbbf24' };
  return              { label: '3rd Class',           color: '#f87171' };
};

export default function StudentPortal() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [currentCgpa, setCurrentCgpa] = useState(0.0);
  const [degreeClass, setDegreeClass] = useState("N/A");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Retrieve user data stored during login
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentProfile = JSON.parse(localStorage.getItem('student_profile') || '{}');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        if (!studentProfile || !studentProfile.id) {
          console.warn("No student profile ID found in localStorage.");
          setIsLoading(false);
          return;
        }
        const res = await axios.get(`${API_BASE}/students/${studentProfile.id}/grades`);
        setGrades(res.data.grades);
        setCurrentCgpa(res.data.cgpa);
        setDegreeClass(res.data.degree_classification || "N/A");
      } catch (err) {
        console.error("Failed to fetch grades", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const cls = classification(currentCgpa);
  // Prefer API classification if available and valid
  const displayClassLabel = degreeClass !== "N/A" ? degreeClass : cls.label;

  const userName = user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Student";

  // Filter grades
  const filteredGrades = grades.filter(g => {
    let match = true;
    if (selectedLevel !== 'All') {
      if (g.level) {
        if (g.level.toString() !== selectedLevel) match = false;
      } else {
        // Fallback: Deduce level from course code (e.g., CSC 111 -> 100)
        const codeMatches = g.course_code.match(/\d+/);
        const levelDigit = codeMatches ? codeMatches[0][0] : null;
        if (levelDigit + "00" !== selectedLevel) match = false;
      }
    }
    if (selectedSemester !== 'All') {
      if (g.semester.toLowerCase() !== selectedSemester.toLowerCase()) match = false;
    }
    return match;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="Student" userName={userName} />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Student Portal</h1>
          <p>Track your academic performance and manage transcript requests.</p>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Current CGPA',    value: currentCgpa.toFixed(2), icon: Award,     color: '#f59e0b' },
            { label: 'Classification',  value: displayClassLabel,   icon: TrendingUp, color: cls.color, small: true },
            { label: 'Courses Filtered',   value: filteredGrades.length, icon: BookOpen,  color: '#6366f1' },
            { label: 'Filtered Credits',   value: filteredGrades.reduce((a,g) => a + (g.credit_units || 0), 0), icon: FileText, color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} className="stat-card glass-panel">
              <div className="stat-icon-wrapper" style={{ background: `${s.color}20` }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div className="stat-details">
                <h3>{s.label}</h3>
                <div className="stat-value" style={{ color: s.color, fontSize: s.small ? '1rem' : '1.7rem', paddingTop: s.small ? '6px' : '0' }}>
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Table */}
        <div className="results-section glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Academic Results</h2>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="All">All Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
              <select 
                value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="All">All Semesters</option>
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
              </select>

              <button onClick={() => navigate('/student/print')} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', padding: '8px 16px', borderRadius: '8px',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s', marginLeft: '10px'
              }}>
                <Download size={14} /> Print Official Result
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Semester</th>
                <th>Credit Units</th>
                <th>Score</th>
                <th>Grade</th>
                <th>GP</th>
                <th>Quality Pts</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Loading your academic record...</td></tr>
              ) : (!studentProfile || !studentProfile.id) ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px', color: '#f87171'}}>Error: Please log out and log in again to load your profile.</td></tr>
              ) : filteredGrades.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No grades found for the selected filters.</td></tr>
              ) : filteredGrades.map(g => (
                <tr key={g.course_code}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent-primary)' }}>{g.course_code}</td>
                  <td style={{ fontWeight: '500' }}>{g.course_title}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{g.semester}</td>
                  <td style={{ textAlign: 'center' }}>{g.credit_units}</td>
                  <td>{g.score}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '9999px', fontSize: '0.8rem',
                      fontWeight: '700', background: `${gradeBadge[g.grade_letter]}20`, color: gradeBadge[g.grade_letter],
                    }}>{g.grade_letter}</span>
                  </td>
                  <td style={{ fontWeight: '600', color: gradeBadge[g.grade_letter] }}>{g.gp.toFixed(1)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{(g.gp * g.credit_units).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                <td colSpan={3} style={{ padding: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Totals / CGPA</td>
                <td style={{ padding: '14px', fontWeight: '700' }}>{filteredGrades.reduce((a,g) => a + (g.credit_units || 0), 0)}</td>
                <td />
                <td />
                <td />
                <td style={{ padding: '14px', fontWeight: '700', color: '#f59e0b', fontSize: '1.1rem' }}>
                  {currentCgpa.toFixed(2)} / 5.0
                </td>
              </tr>
            </tfoot>
          </table>
          </div>
        </div>
      </main>
    </div>
  );
}
