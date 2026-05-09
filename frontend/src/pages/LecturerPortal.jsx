import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Upload, FileText, CheckCircle, Plus, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import '../components.css';



const gradeFromScore = (score) => {
  const s = parseFloat(score);
  if (isNaN(s)) return { letter: '–', gp: '–', color: 'var(--text-muted)' };
  if (s >= 70) return { letter: 'A', gp: '5.0', color: '#34d399' };
  if (s >= 60) return { letter: 'B', gp: '4.0', color: '#60a5fa' };
  if (s >= 50) return { letter: 'C', gp: '3.0', color: '#fbbf24' };
  if (s >= 45) return { letter: 'D', gp: '2.0', color: '#fb923c' };
  if (s >= 40) return { letter: 'E', gp: '1.0', color: '#f87171' };
  return { letter: 'F', gp: '0.0', color: '#ef4444' };
};

export default function LecturerPortal() {
  const [selectedCourse, setSelectedCourse] = useState('CSC 111');
  const [courses, setCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grades, setGrades] = useState([
    { id: 1, studentId: '1', score: '' },
    { id: 2, studentId: '2', score: '' },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/courses`);
        setCourses(res.data);
        if (res.data.length > 0) setSelectedCourse(res.data[0].course_code);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  const handleScoreChange = (id, val) => {
    const num = Math.min(100, Math.max(0, parseFloat(val) || ''));
    setGrades(grades.map(g => g.id === id ? { ...g, score: val === '' ? '' : num } : g));
  };

  const handleStudentIdChange = (id, val) => {
    setGrades(grades.map(g => g.id === id ? { ...g, studentId: val } : g));
  };

  const handleSubmit = async () => {
    const validGrades = grades.filter(g => g.studentId && g.score !== '');
    if (validGrades.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Process serially for demo. Ideally bulk endpoint in production.
      for (const g of validGrades) {
        await axios.post(`${API_BASE}/grades/upload`, {
          student_id: parseInt(g.studentId),
          course_code: selectedCourse,
          score: parseFloat(g.score)
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit grades", err);
      alert("Error submitting grades. Ensure Student ID is correct (e.g. 1)");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Lecturer" userName="Dr. Amaka Obi" />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Lecturer Portal</h1>
          <p>Upload or manually enter scores for your assigned courses.</p>
        </header>

        {submitted ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', marginBottom: '20px' }}>
              <CheckCircle size={48} color="#34d399" />
            </div>
            <h2 style={{ marginBottom: '8px' }}>Grades Submitted Successfully!</h2>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setGrades([{ id: 1, studentId: '', score: '' }]); }}>
              Submit More Grades
            </button>
          </div>
        ) : (
          <>
            <section className="upload-section glass-panel" style={{ marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} color="var(--accent-primary)" /> Bulk CSV Upload
              </h2>
              <div style={{
                border: '2px dashed rgba(99,102,241,0.3)', borderRadius: '12px', padding: '36px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(99,102,241,0.03)',
              }}>
                <FileText size={36} color="#a5b4fc" />
                <p style={{ color: 'var(--text-secondary)' }}>Drag &amp; drop a <strong style={{ color: '#fff' }}>CSV file</strong> here</p>
                <button className="btn-primary">Select CSV File</button>
              </div>
            </section>

            <section className="manual-entry-section glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Manual Grade Entry</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Scores auto-convert to BIU 5.0 grade points.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px 12px', borderRadius: '8px' }}
                  >
                    {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_code}</option>)}
                  </select>
                  <button onClick={() => setGrades([...grades, { id: Date.now(), studentId: '', score: '' }])} className="btn-secondary" style={{ padding: '8px 14px', borderRadius: '8px' }}>
                    <Plus size={14} /> Add Row
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student ID</th>
                      <th>Course</th>
                      <th>Score (0–100)</th>
                      <th>Grade</th>
                      <th>GP</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, i) => {
                      const info = gradeFromScore(g.score);
                      return (
                        <tr key={g.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td>
                            <input
                              type="text" placeholder="CSC/2023/001" value={g.studentId}
                              onChange={e => handleStudentIdChange(g.id, e.target.value)}
                              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', padding: '7px 10px', borderRadius: '6px', color: '#fff', width: '160px' }}
                            />
                          </td>
                          <td style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{selectedCourse}</td>
                          <td>
                            <input
                              type="number" value={g.score} onChange={e => handleScoreChange(g.id, e.target.value)}
                              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', padding: '7px 10px', borderRadius: '6px', color: '#fff', width: '100px' }}
                            />
                          </td>
                          <td><span style={{ fontWeight: '700', color: info.color, fontSize: '1rem' }}>{info.letter}</span></td>
                          <td style={{ color: info.color, fontWeight: '600' }}>{info.gp}</td>
                          <td>
                            <button onClick={() => setGrades(grades.filter(x => x.id !== g.id))} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '6px' }}><AlertCircle size={14} /> Final submission</div>
                <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                  <CheckCircle size={15} /> {isSubmitting ? 'Submitting...' : 'Submit Grades'}
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
