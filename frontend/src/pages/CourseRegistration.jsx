import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Save, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import '../components.css';

export default function CourseRegistration() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: '',
    matric_no: '',
    faculty: '',
    department: '',
    current_level: 100,
    student_type: 'FULL TIME STUDENT',
    session: '2025/2026',
  });
  
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentProfile = JSON.parse(localStorage.getItem('student_profile') || '{}');

  useEffect(() => {
    if (!studentProfile.id) {
      setError("Please log out and log in again to load your profile.");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch full profile
        const profRes = await axios.get(`${API_BASE}/students/${studentProfile.id}/profile`);
        setProfile({
          full_name: profRes.data.full_name || '',
          matric_no: profRes.data.matric_no || '',
          faculty: profRes.data.faculty || '',
          department: profRes.data.department || '',
          current_level: profRes.data.current_level || 100,
          student_type: profRes.data.student_type || 'FULL TIME STUDENT',
          session: profRes.data.session || '2025/2026',
        });

        // Fetch courses list
        const courseRes = await axios.get(`${API_BASE}/courses`);
        setCourses(courseRes.data);

        // Fetch already registered courses
        const gradesRes = await axios.get(`${API_BASE}/students/${studentProfile.id}/grades`);
        const registeredCodes = gradesRes.data.grades.map(g => g.course_code);
        setSelectedCourses(registeredCodes);
        
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load profile data.");
      }
    };
    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const toggleCourse = (courseCode) => {
    setSelectedCourses(prev => 
      prev.includes(courseCode) ? prev.filter(c => c !== courseCode) : [...prev, courseCode]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentProfile.id) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Update Profile
      await axios.put(`${API_BASE}/students/${studentProfile.id}/profile`, {
        full_name: profile.full_name,
        matric_no: profile.matric_no,
        faculty: profile.faculty,
        department: profile.department,
        current_level: parseInt(profile.current_level),
        student_type: profile.student_type,
        session: profile.session
      });

      // 2. Register Courses
      if (selectedCourses.length > 0) {
        await axios.post(`${API_BASE}/students/${studentProfile.id}/register_courses`, {
          course_codes: selectedCourses
        });
      }

      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Student";

  return (
    <div className="dashboard-layout">
      <Sidebar role="Student" userName={userName} />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Course Registration</h1>
          <p>Update your profile and register for your current semester courses.</p>
        </header>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} /> Registration submitted successfully! Your printout will now reflect these details.
          </div>
        )}

        <div className="results-section glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--accent-primary)" /> Profile Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" name="full_name" value={profile.full_name} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. DEREK-AYEMERE RHEMA OSEGODUWA" />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Matriculation Number</label>
              <input type="text" name="matric_no" value={profile.matric_no} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. SCN/CSC/220880" />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Faculty</label>
              <input type="text" name="faculty" value={profile.faculty} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. SCIENCES" />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Department</label>
              <input type="text" name="department" value={profile.department} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. COMPUTER SCIENCE" />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Current Level</label>
              <select name="current_level" value={profile.current_level} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }}>
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Session</label>
              <input type="text" name="session" value={profile.session} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. 2025/2026" />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Student Type</label>
              <input type="text" name="student_type" value={profile.student_type} onChange={handleProfileChange} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', padding: '12px', borderRadius: '8px' }} placeholder="e.g. FULL TIME STUDENT" />
            </div>
          </div>
        </div>

        <div className="results-section glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--accent-primary)" /> Register Courses
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Select the courses you are registering for this session. The lecturer will grade these.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {courses.map(c => (
              <div 
                key={c.course_code} 
                onClick={() => toggleCourse(c.course_code)}
                style={{ 
                  background: selectedCourses.includes(c.course_code) ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.2)', 
                  border: `1px solid ${selectedCourses.includes(c.course_code) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  padding: '15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '15px'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${selectedCourses.includes(c.course_code) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)'}`, background: selectedCourses.includes(c.course_code) ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  {selectedCourses.includes(c.course_code) && <CheckCircle size={14} color="#fff" />}
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{c.course_code}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.course_title}</p>
                  <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>{c.credit_units} Units • {c.semester}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '40px' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <Save size={18} /> {isSubmitting ? 'Saving Registration...' : 'Complete Registration'}
          </button>
        </div>

      </main>
    </div>
  );
}
