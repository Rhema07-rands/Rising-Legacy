import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

export default function Transcript() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTranscript = async () => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        navigate('/auth');
        return;
      }
      const u = JSON.parse(stored);
      
      try {
        const res = await fetch(`${API_BASE}/transcript/${u.id}`);
        if (!res.ok) throw new Error('Failed to load transcript');
        const d = await res.json();
        setData(d);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [navigate]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!data) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', color: 'black' }}>
        <div className="no-print flex justify-between mb-4">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>&larr; Back to Dashboard</button>
          <button className="btn btn-primary" onClick={() => window.print()}>Print Transcript</button>
        </div>

        <div style={{ textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>BENSON IDAHOSA UNIVERSITY</h1>
          <h2 style={{ fontSize: '18px', margin: '5px 0' }}>STUDENT ACADEMIC TRANSCRIPT</h2>
          <p style={{ fontSize: '14px', margin: '0', color: '#555' }}>Department of Computer Science</p>
        </div>

        <div className="flex justify-between" style={{ marginBottom: '2rem', fontSize: '14px' }}>
          <div>
            <p><strong>Name:</strong> {data.student.full_name}</p>
            <p><strong>Matric No:</strong> {data.student.username}</p>
            <p><strong>Level:</strong> {data.student.level}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Total CGPA:</strong> <span style={{ fontSize: '1.2em', color: '#000' }}>{data.total_cgpa.toFixed(2)}</span></p>
            <p><strong>Classification:</strong> {data.degree_classification}</p>
          </div>
        </div>

        {data.levels.map(levelObj => (
          <div key={levelObj.level} style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{levelObj.level} LEVEL</h3>
            {levelObj.semesters.map(semObj => (
              <div key={semObj.semester} style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '14px', color: '#666' }}>{semObj.semester.toUpperCase()} SEMESTER</h4>
                <table className="data-table" style={{ marginTop: '0.5rem', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                      <th style={{ color: '#333' }}>Course Code</th>
                      <th style={{ color: '#333' }}>Course Title</th>
                      <th style={{ color: '#333' }}>Units</th>
                      <th style={{ color: '#333' }}>Grade</th>
                      <th style={{ color: '#333' }}>GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semObj.courses.map(course => (
                      <tr key={course.id}>
                        <td>{course.course_code}</td>
                        <td>{course.course_title}</td>
                        <td>{course.credit_units}</td>
                        <td>{course.grade}</td>
                        <td>{course.grade_point.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Semester GPA:</td>
                      <td style={{ fontWeight: 'bold' }}>{semObj.gpa.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
        ))}
        
        {data.levels.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No courses recorded yet.
          </div>
        )}

      </div>
    </div>
  );
}
