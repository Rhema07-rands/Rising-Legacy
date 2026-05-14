import React, { useState } from 'react';
import { X, UserPlus, Hash, User } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

export default function EnrollStudentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    password: 'password123',
    level: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/admin/enroll-student`, formData);
      setFormData({ username: '', full_name: '', password: 'password123', level: 100 });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '420px', padding: '40px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        
        <h2 className="text-gradient" style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.5rem' }}>Enroll New Student</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Add a new student to the Computer Science department.</p>
        
        {error && (
          <div style={{ 
            padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserPlus size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                required
                className="input-field"
                placeholder="John Doe"
                style={{ paddingLeft: '40px' }}
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Matric No (Username)</label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                required
                className="input-field"
                placeholder="e.g. SCN/CSC/220880"
                style={{ paddingLeft: '40px' }}
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Initial Level</label>
            <div style={{ position: 'relative' }}>
              <Hash size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
              <select 
                value={formData.level}
                className="input-field"
                style={{ paddingLeft: '40px', appearance: 'none' }}
                onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}
              >
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: '5px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              The student will be able to log in immediately using their Matric No and the default password: <strong>password123</strong>
            </p>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '14px', marginTop: '10px' }}>
            {loading ? 'Enrolling...' : 'Enroll Student →'}
          </button>
        </form>
      </div>
    </div>
  );
}
