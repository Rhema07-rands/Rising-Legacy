import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

export default function EnrollStudentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    level: 100,
    department: 'COMPUTER SCIENCE'
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
      setFormData({ student_id: '', full_name: '', level: 100, department: 'COMPUTER SCIENCE' });
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
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem' }}>Enroll New Student</h2>
        
        {error && <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Student ID (Matric No)</label>
            <input 
              type="text" 
              required
              value={formData.student_id}
              onChange={e => setFormData({...formData, student_id: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Full Name</label>
            <input 
              type="text" 
              required
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Level</label>
              <select 
                value={formData.level}
                onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px' }}
              >
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Department</label>
              <input 
                type="text" 
                required
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px' }}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Note: The student's login username will be their Student ID, and the default password is <strong>password123</strong>.</p>
          </div>
          
          <button type="submit" disabled={loading} style={{
            background: 'var(--accent-gradient)', color: '#fff', border: 'none',
            padding: '12px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600', marginTop: '10px'
          }}>
            {loading ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </form>
      </div>
    </div>
  );
}
