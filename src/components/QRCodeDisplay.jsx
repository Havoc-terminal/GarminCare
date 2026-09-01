import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { XCircle, ShieldCheck, Heart, User } from 'lucide-react';

export function QRCodeDisplay({ patient, onClose }) {
  if (!patient) return null;

  // Create a minimal JSON payload for offline scanning
  const qrPayload = JSON.stringify({
    id: patient.id || `PAT-${Date.now()}`,
    n: patient.name,
    a: patient.age,
    g: patient.gender,
    bg: patient.bloodGroup || 'O+',
    ph: patient.phone || '',
    v: patient.village || '',
    abha: patient.abhaId || ''
  });

  return (
    <div className="modal-overlay-dark" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', padding: 0, overflow: 'hidden', background: 'var(--bg-main)', border: '1px solid var(--border-dark)' }}>
        
        {/* Card Header */}
        <div style={{ background: 'var(--green-primary)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, color: '#000', fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} /> GraminCare ID
            </h3>
            <p style={{ margin: 0, color: 'rgba(0,0,0,0.7)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.2rem' }}>
              Universal Health Card
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: 0 }}>
            <XCircle size={22} />
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            background: '#fff', 
            padding: '0.75rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(16,185,129,0.2)',
            marginBottom: '1.25rem'
          }}>
            <QRCodeSVG 
              value={qrPayload} 
              size={180} 
              level="M" 
              includeMargin={false}
              fgColor="#000"
            />
          </div>

          <div style={{ width: '100%', background: 'var(--bg-subtle)', borderRadius: '10px', padding: '0.85rem', border: '1px solid var(--border-dark)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)' }}>
                <User size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>{patient.name}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.age} Yrs &bull; {patient.gender}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.1rem' }}>ABHA ID</span>
                <strong style={{ color: 'var(--green-primary)' }}>{patient.abhaId || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.1rem' }}>Blood Group</span>
                <strong style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Heart size={10} /> {patient.bloodGroup || 'O+'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.1rem' }}>Mobile / Village</span>
                <strong style={{ color: 'var(--text-main)' }}>{patient.phone || 'No Phone'} &bull; {patient.village || 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div style={{ background: '#18181b', padding: '0.75rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-dark)' }}>
          Scan to retrieve medical history offline via GraminCare ASHA App.
        </div>
      </div>
    </div>
  );
}
