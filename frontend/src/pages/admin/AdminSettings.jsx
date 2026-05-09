import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Settings, Shield, Database, Bell, Save, CheckCircle } from 'lucide-react';
import '../../components.css';

const Section = ({ title, icon: Icon, children }) => (
  <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
    <h2 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
      <Icon size={18} color="var(--accent-primary)" /> {title}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {children}
    </div>
  </div>
);

const Field = ({ label, desc, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '2px' }}>{label}</p>
      {desc && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</p>}
    </div>
    <div>{children}</div>
  </div>
);

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: '44px', height: '24px', borderRadius: '9999px',
      background: on ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 0.25s ease',
    }}>
      <span style={{
        position: 'absolute', top: '3px',
        left: on ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff', transition: 'left 0.25s ease',
      }} />
    </button>
  );
};

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" userName="Administrator" />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>System Settings</h1>
          <p>Configure Rising Legacy grading system preferences and security options.</p>
        </header>

        {saved && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '10px', padding: '12px 18px', marginBottom: '24px',
            color: '#34d399', fontSize: '0.9rem',
          }}>
            <CheckCircle size={16} /> Settings saved successfully.
          </div>
        )}

        <Section title="Academic Configuration" icon={Settings}>
          <Field label="Institution Name" desc="Displayed on all official transcripts.">
            <input defaultValue="Benson Idahosa University" style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '0.875rem', width: '260px', outline: 'none',
            }} />
          </Field>
          <Field label="Department" desc="The department this system manages.">
            <input defaultValue="Computer Science" style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '0.875rem', width: '260px', outline: 'none',
            }} />
          </Field>
          <Field label="Grading Scale" desc="BIU uses the NUC-standard 5-point scale.">
            <select style={{
              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '0.875rem', outline: 'none', cursor: 'pointer',
            }}>
              <option value="5">5.0 Point Scale (NUC Standard)</option>
              <option value="4">4.0 Point Scale</option>
            </select>
          </Field>
          <Field label="Current Academic Session">
            <input defaultValue="2025/2026" style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '0.875rem', width: '160px', outline: 'none',
            }} />
          </Field>
        </Section>

        <Section title="Security & Access" icon={Shield}>
          <Field label="Allow Lecturer Grade Edits" desc="Permit lecturers to modify submitted grades within the grace period.">
            <Toggle defaultOn={true} />
          </Field>
          <Field label="Two-Factor Authentication" desc="Require 2FA for all administrator accounts.">
            <Toggle defaultOn={false} />
          </Field>
          <Field label="Student Transcript Self-Request" desc="Allow students to directly request their own transcripts.">
            <Toggle defaultOn={true} />
          </Field>
          <Field label="Grade Edit Grace Period (days)" desc="Number of days after submission that a grade can be edited.">
            <input type="number" defaultValue={7} style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '0.875rem', width: '100px', outline: 'none',
            }} />
          </Field>
        </Section>

        <Section title="Database & Storage" icon={Database}>
          <Field label="Database" desc="Current connected database instance.">
            <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: '6px' }}>
              TiDB Cloud · eu-central-1
            </span>
          </Field>
          <Field label="Automatic Backups" desc="Daily backup of all grading data to cloud storage.">
            <Toggle defaultOn={true} />
          </Field>
          <Field label="Audit Logging" desc="Record every grade change with user and timestamp.">
            <Toggle defaultOn={true} />
          </Field>
        </Section>

        <Section title="Notifications" icon={Bell}>
          <Field label="Email Alerts on Grade Upload" desc="Notify admins when a lecturer submits a new batch of grades.">
            <Toggle defaultOn={true} />
          </Field>
          <Field label="Transcript Ready Notification" desc="Email students when their transcript has been approved.">
            <Toggle defaultOn={true} />
          </Field>
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '12px 28px' }}>
            <Save size={15} /> Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
