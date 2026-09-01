import React, { useState } from 'react';
import { UserCheck, Stethoscope, Users, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { GRAMINCARE_LOGO_BASE64 } from '../data/logoBase64';

export function LoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('asha');
  const [username, setUsername] = useState('asha.sita.more@gramincare.gov.in');
  const [password, setPassword] = useState('asha1234');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'asha') {
      setUsername('asha.sita.more@gramincare.gov.in');
      setPassword('asha1234');
    } else if (role === 'doctor') {
      setUsername('dr.aniket.deshmukh@gramincare.gov.in');
      setPassword('doctor2026');
    } else {
      setUsername('+91 98230 11204');
      setPassword('patient123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const users = {
      asha: { condition: password === 'asha1234', obj: { role: 'asha', id: 'ASHA-402', name: 'Sita More', email: username, village: 'Bhamburda (Khed)', facility: 'Sub-Center Bhamburda' } },
      doctor: { condition: password === 'doctor2026', obj: { role: 'doctor', id: 'DOC-108', name: 'Dr. Aniket Deshmukh', email: username, qualification: 'MBBS, MD', facility: 'PHC Khed' } },
      patient: { condition: password === 'patient123', obj: { role: 'patient', id: 'PAT-2026-101', name: 'Sunita Shinde', phone: username, abhaId: '91-4829-1029-3841', village: 'Bhamburda (Khed)' } }
    };

    const entry = users[selectedRole];
    if (entry?.condition) {
      onLoginSuccess(entry.obj);
    } else {
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Brand Logo inside login box */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <img src={GRAMINCARE_LOGO_BASE64} alt="GraminCare" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
            GRAMIN<span style={{ color: 'var(--green-primary)' }}>CARE</span>
          </span>
        </div>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Sign In</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select your access role to continue.</p>
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: '9999px',
          padding: '4px',
          gap: '4px',
          marginBottom: '2rem'
        }}>
          {[
            { role: 'asha', icon: UserCheck, label: 'ASHA' },
            { role: 'doctor', icon: Stethoscope, label: 'Doctor' },
            { role: 'patient', icon: Users, label: 'Patient' }
          ].map(({ role, icon: Icon, label }) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.55rem',
                borderRadius: '9999px',
                border: 'none',
                background: selectedRole === role ? 'var(--green-primary)' : 'transparent',
                color: selectedRole === role ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedRole === role ? '0 2px 8px var(--green-glow)' : 'none'
              }}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.6rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              {selectedRole === 'patient' ? 'Mobile Number / ABHA ID' : 'Govt Email Address'}
            </label>
            <input
              type="text"
              className="dark-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              className="dark-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.85rem 1rem' }}
            />
          </div>

          <button type="submit" className="btn-green-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            <span>Sign In Securely</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          National Health Mission · Govt of Maharashtra
        </div>
      </div>
    </div>
  );
}
