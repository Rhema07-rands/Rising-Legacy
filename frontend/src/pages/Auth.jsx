import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? 'Enter your credentials to continue' : 'Sign up for the CGPA Calculator'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="full_name" className="form-input" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <select name="level" className="form-select" value={formData.level} onChange={handleChange}>
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{isLogin ? 'Username / Matric No' : 'Matric No (Username)'}</label>
            <input type="text" name="username" className="form-input" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
