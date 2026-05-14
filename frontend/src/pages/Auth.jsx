import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, GraduationCap, UserPlus, Hash, ChevronDown } from 'lucide-react';
import API_BASE from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    level: 100
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'An error occurred');
      }

      // Store user
      const user = isLogin ? data.user : data;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', minHeight: '100vh', position: 'relative', padding: '1rem'
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
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.875rem' }}>
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

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserPlus size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="full_name"
                    className="input-field"
                    placeholder="Enter your full name"
                    style={{ paddingLeft: '40px' }}
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Level</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
                  <select
                    name="level"
                    className="input-field"
                    style={{ paddingLeft: '40px', appearance: 'none' }}
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">{isLogin ? 'Username / Matric No' : 'Matric No (Username)'}</label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder={isLogin ? 'Enter your username' : 'Enter your matric number'}
                style={{ paddingLeft: '40px' }}
                value={formData.username}
                onChange={handleChange}
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
                name="password"
                className="input-field"
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '13px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In →' : 'Sign Up →')}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }} style={{ fontWeight: '500' }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </a>
        </div>

        {/* Demo hint */}
        {isLogin && (
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
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
