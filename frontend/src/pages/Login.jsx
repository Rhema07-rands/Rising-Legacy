import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, GraduationCap, ChevronDown } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

const DEMO_USERS = {
  admin:    { password: 'admin123',    role: 'Admin',    path: '/admin',    name: 'Administrator' },
  lecturer: { password: 'lecturer123', role: 'Lecturer', path: '/lecturer', name: 'Dr. Amaka Obi' },
  student:  { password: 'student123',  role: 'Student',  path: '/student',  name: 'Adaeze Okonkwo' },
};

const Login = () => {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username: username.toLowerCase(),
        password: password
      });
      
      const { user, student_profile } = response.data;
      
      // Store user details for other pages to use (e.g. StudentPortal)
      localStorage.setItem('user', JSON.stringify(user));
      if (student_profile) {
        localStorage.setItem('student_profile', JSON.stringify(student_profile));
      }

      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Lecturer') navigate('/lecturer');
      else if (user.role === 'Student') navigate('/student');
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', minHeight: '100vh', position: 'relative',
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'fixed', top: '10%', left: '5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '420px', padding: '48px 40px',
        textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          display: 'inline-flex', padding: '18px', borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(99,102,241,0.3)', marginBottom: '24px',
        }}>
          <GraduationCap size={44} color="var(--accent-primary)" />
        </div>

        <h1 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
          Rising Legacy
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
          BIU · Computer Science
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '0.875rem' }}>
          Electronic Grading &amp; Transcript Management System
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '10px 16px', marginBottom: '20px',
            color: '#f87171', fontSize: '0.85rem', textAlign: 'left',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="admin / lecturer / student"
                style={{ paddingLeft: '40px' }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '13px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        {/* Demo hint */}
        <details style={{ marginTop: '28px', textAlign: 'left' }}>
          <summary style={{
            color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none',
            userSelect: 'none',
          }}>
            <ChevronDown size={14} /> Demo credentials
          </summary>
          <div style={{
            marginTop: '10px', background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px', padding: '12px 14px',
            fontSize: '0.8rem', lineHeight: '1.9',
            color: 'var(--text-secondary)', fontFamily: 'monospace',
          }}>
            <div><span style={{ color: '#a5b4fc' }}>admin</span>    / admin123</div>
            <div><span style={{ color: '#6ee7b7' }}>lecturer</span> / lecturer123</div>
            <div><span style={{ color: '#fcd34d' }}>student</span>  / student123</div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default Login;
