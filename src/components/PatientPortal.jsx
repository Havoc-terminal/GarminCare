import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Calendar, FileText, Pill, Bot, AlertTriangle, CheckCircle2, 
  Clock, MapPin, Phone, Activity, ShieldCheck, Save, Video, PhoneOff, 
  Send, Edit3, Lock, Building2, UserCheck, Stethoscope, MessageSquare, ChevronRight, QrCode
} from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { INITIAL_BIG_HOSPITALS } from '../data/mockData';
import { QRCodeDisplay } from './QRCodeDisplay';

const S = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-dark)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    color: 'var(--text-main)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-dark)'
  },
  input: {
    width: '100%',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-dark)',
    borderRadius: '8px',
    padding: '0.6rem 0.8rem',
    color: 'var(--text-main)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '0.25rem'
  },
  badge: (type) => {
    let bg = 'rgba(16,185,129,0.12)', color = '#10b981', border = 'rgba(16,185,129,0.3)';
    if (type === 'red' || type === 'RED') {
      bg = 'rgba(239,68,68,0.12)'; color = '#f87171'; border = 'rgba(239,68,68,0.3)';
    } else if (type === 'amber' || type === 'YELLOW') {
      bg = 'rgba(245,158,11,0.12)'; color = '#f59e0b'; border = 'rgba(245,158,11,0.3)';
    }
    return {
      background: bg, color: color, border: `1px solid ${border}`,
      borderRadius: '9999px', padding: '0.2rem 0.65rem', fontSize: '0.7rem',
      fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      textTransform: 'uppercase', letterSpacing: '0.04em'
    };
  }
};

export function PatientPortal({ 
  patients = [], 
  onTriggerSOS, 
  onNavigateTab,
  lang,
  prescriptions = [],
  currentUser,
  patientSection = 'ALL',
  setPatientSection,
  onUpdatePatient,
  activeTeleconsult,
  onStartTeleconsult,
  onAcceptTeleconsult,
  onEndTeleconsult,
  teleconsultChat = [],
  onSendChatMessage,
  selectedPatient,
  setSelectedPatient
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(selectedPatient?.id || patients[0]?.id || 'PAT-2026-001');
  const activeSection = patientSection || 'ALL';
  const setActiveSection = (sec) => {
    if (setPatientSection) setPatientSection(sec);
  };

  const patient = patients.find(p => p.id === selectedPatientId) || selectedPatient || patients[0];
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (patient && setSelectedPatient && selectedPatient?.id !== patient.id) {
      setSelectedPatient(patient);
    }
  }, [patient, setSelectedPatient, selectedPatient]);

  // --- Section 1: Editable Profile & Credentials State ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    gender: patient?.gender || 'Male',
    abhaId: patient?.abhaId || '91-4829-1029-4821',
    phone: patient?.phone || '9816637806',
    password: patient?.password || 'password123',
    village: patient?.village || 'Khasmasal'
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Keep editForm synced when patient selection changes
  useEffect(() => {
    if (patient) {
      setEditForm({
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        abhaId: patient.abhaId || '91-4829-1029-4821',
        phone: patient.phone || '9816637806',
        password: patient.password || 'password123',
        village: patient.village || 'Khasmasal'
      });
    }
  }, [patient]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...patient,
      name: editForm.name,
      age: parseInt(editForm.age) || patient.age,
      gender: editForm.gender,
      abhaId: editForm.abhaId,
      phone: editForm.phone,
      password: editForm.password,
      village: editForm.village
    };
    if (onUpdatePatient) onUpdatePatient(updated);
    setIsEditingProfile(false);
    setProfileSuccessMsg('✓ Profile & login credentials updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 5000);
  };

  // --- Section 2: Prescriptions & History State ---
  // Filter prescriptions by patient's mobile number
  const myPrescriptions = prescriptions.filter(rx => {
    if (!rx.phone) return true;
    const patPhone = (patient?.phone || '').replace(/\D/g, '');
    const rxPhone = (rx.phone || '').replace(/\D/g, '');
    return !patPhone || !rxPhone || patPhone.endsWith(rxPhone.slice(-10)) || rxPhone.endsWith(patPhone.slice(-10));
  });

  // Combine Prescriptions and ASHA Vitals History sorted date-wise
  const sortedHistory = [
    ...myPrescriptions.map(rx => ({
      type: 'PRESCRIPTION',
      date: rx.date || '2026-08-26',
      timestamp: rx.date ? `${rx.date}T10:00:00.000Z` : new Date().toISOString(),
      title: `E-Prescription by ${rx.doctorName || 'Dr. Aniket Deshmukh'}`,
      facility: rx.facility || 'PHC Khed',
      diagnosis: rx.diagnosis,
      medicines: rx.medicines,
      advice: rx.advice,
      phone: rx.phone
    })),
    ...(patient?.vitalsHistory || []).map(vh => ({
      type: 'ASHA_VISIT',
      date: vh.timestamp ? vh.timestamp.split('T')[0] : '2026-08-26',
      timestamp: vh.timestamp || new Date().toISOString(),
      title: 'ASHA Field Checkup & Vitals Log',
      facility: 'ASHA Home Visit (Sita More)',
      vitals: vh,
      symptoms: vh.symptoms || [vh.voiceNote || 'Routine Health Checkup']
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // --- Section 3: Doctor Video Call & Chat State ---
  const [activeCall, setActiveCall] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  const isCallingMe = activeTeleconsult && (activeTeleconsult.patientId === patient?.id || !activeTeleconsult.patientId);

  useEffect(() => {
    if (isCallingMe && activeTeleconsult.status === 'CONNECTED' && !activeCall) {
      startVideoCall();
    }
  }, [activeTeleconsult, isCallingMe]);

  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  // Explicit user-triggered camera permission request
  const requestCameraAccess = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        setHasCameraAccess(true);
        return stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Camera permission notice: Please click "Allow" in your browser top bar to enable live video feed.');
    }
  };

  // Video Stream Initializer (runs after DOM renders video element)
  useEffect(() => {
    if (!activeCall) {
      setHasCameraAccess(false);
      return;
    }

    let animId = null;

    const startStream = async () => {
      // Try camera access
      const camStream = await requestCameraAccess();
      if (camStream) return;

      // Canvas animation fallback if camera unavailable
      if (!localVideoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 480;
      const ctx = canvas.getContext('2d');
      let phase = 0;
      const draw = () => {
        phase += 0.05;
        ctx.fillStyle = 'var(--bg-main)'; ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#10b981'; ctx.font = 'bold 18px Inter,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('LIVE VIDEO TELECONSULTATION', 320, 210);
        ctx.fillStyle = '#a1a1aa'; ctx.font = '14px Inter,sans-serif';
        ctx.fillText(`Connected to Dr. Aniket Deshmukh (MD)...`, 320, 238);
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let x = 0; x < 640; x += 5) {
          const y = 380 + Math.sin((x + phase * 30) * 0.05) * 12 * (x % 50 === 0 ? 3 : 1);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        animId = requestAnimationFrame(draw);
      };
      draw();
      localStreamRef.current = canvas.captureStream(30);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play().catch(() => {});
      }
    };

    startStream();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (localStreamRef.current) {
        try { localStreamRef.current.getTracks().forEach(t => t.stop()); } catch(e) {}
      }
    };
  }, [activeCall]);

  const startVideoCall = () => {
    setActiveCall(true);
    if (onAcceptTeleconsult) onAcceptTeleconsult();
  };

  const endVideoCall = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    setActiveCall(false);
    if (onEndTeleconsult) onEndTeleconsult();
  };

  const handleSendDoctorChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (onSendChatMessage) onSendChatMessage(chatInput, 'patient', patient.id);
    setChatInput('');
  };

  if (!patient) return null;

  return (
    <div className="app-container-max" style={{ padding: '1rem 0 3.5rem 0' }}>
      
      {/* TOP BANNER: PATIENT HEADER & SECTION SWITCHER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(24,24,27,0.95) 100%)',
        border: '1px solid var(--green-primary)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(16,185,129,0.2)', border: '2px solid var(--green-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)'
          }}>
            <User size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {patient.name}
              </h1>
              <span style={S.badge('green')}>ABHA Verified</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>
              ABHA: <strong style={{ color: 'var(--text-main)' }}>{patient.abhaId}</strong> &bull; {patient.age}y / {patient.gender} &bull; Mobile: <strong>{patient.phone}</strong> &bull; Village: {patient.village}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <select
            style={{ ...S.input, width: 'auto', background: 'var(--bg-main)', fontWeight: 700, cursor: 'pointer' }}
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.village})</option>
            ))}
          </select>

          <button onClick={onTriggerSOS} className="btn-green-primary" style={{ background: '#ef4444', borderColor: '#ef4444', padding: '0.45rem 1rem' }}>
            <AlertTriangle size={15} /> SOS 108
          </button>
        </div>
      </div>

      {/* INCOMING TELECONSULTATION CALL ALERT BANNER */}
      {isCallingMe && (
        <div style={{
          background: 'rgba(16,185,129,0.18)',
          border: '2px solid var(--green-primary)',
          borderRadius: '14px',
          padding: '1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 32px rgba(16,185,129,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--green-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--green-primary)', margin: 0, textTransform: 'uppercase' }}>
                📞 INCOMING DOCTOR TELECONSULTATION CALL
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                Dr. Aniket Deshmukh (MD) is calling you for slot: <strong>{activeTeleconsult.scheduledTime || 'Immediate Call'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={startVideoCall} className="btn-green-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
              <Video size={16} /> Accept & Join Video Call
            </button>
            <button onClick={endVideoCall} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '8px', padding: '0.65rem 1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
              Decline
            </button>
          </div>
        </div>
      )}

      {/* SECTION FILTER TABS BUTTONS */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { id: 'ALL', label: 'All 4 Sections' },
          { id: 'PROFILE', label: '1. Editable Profile & Emergency Contacts' },
          { id: 'HISTORY', label: '2. Prescriptions & History' },
          { id: 'CONSULT', label: '3. Video Consult & Doctor Chat' },
          { id: 'AI', label: '4. AI Health Assistant' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '9999px',
            border: activeSection === tab.id ? '1px solid var(--green-primary)' : '1px solid var(--border-dark)',
            background: activeSection === tab.id ? 'var(--green-primary)' : 'var(--bg-subtle)',
            color: activeSection === tab.id ? 'var(--bg-main)' : 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 DEDICATED SECTIONS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeSection === 'ALL' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>

        {/* =========================================================
            SECTION 1: EDITABLE PATIENT ID & EMERGENCY CONTACTS
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'PROFILE') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  1. Profile Credentials & Emergency Contacts
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setShowQRModal(true)} 
                  className="btn-green-primary" 
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <QrCode size={13} /> View QR Card
                </button>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)} 
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '8px', color: 'var(--green-primary)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit3 size={13} /> {isEditingProfile ? 'Cancel Edit' : 'Edit Credentials'}
                </button>
              </div>
            </div>

            {profileSuccessMsg && (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={15} /> {profileSuccessMsg}
              </div>
            )}

            {/* Editable Profile Form vs View Card */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--green-primary)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--green-primary)', margin: 0 }}>
                  ✏️ Edit Patient ID Credentials
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={S.label}>Patient Name *</label>
                    <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Age (Yrs) *</label>
                    <input type="number" required value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} style={S.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={S.label}>ABHA Number *</label>
                    <input type="text" required value={editForm.abhaId} onChange={e => setEditForm({...editForm, abhaId: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Mobile Number *</label>
                    <input type="text" required value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={S.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={S.label}>Account Password *</label>
                    <input type="text" required value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Village / Locality</label>
                    <input type="text" value={editForm.village} onChange={e => setEditForm({...editForm, village: e.target.value})} style={S.input} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                  <button type="button" onClick={() => setIsEditingProfile(false)} style={{ flex: 1, background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: '8px', color: 'var(--text-main)', padding: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-green-primary" style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Save size={15} /> Save Credentials
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Full Name</span><div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{patient.name}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Age / Gender</span><div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{patient.age} Yrs / {patient.gender}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ABHA Number</span><div style={{ fontWeight: 800, color: 'var(--green-primary)' }}>{patient.abhaId}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Mobile Number</span><div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{patient.phone}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Village</span><div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{patient.village}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Password</span><div style={{ fontWeight: 800, color: 'var(--text-main)' }}>•••••••• ({patient.password || 'password123'})</div></div>
              </div>
            )}

            {/* NEAREST ASHA WORKER DETAILS */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <UserCheck size={18} color="var(--green-primary)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Nearest ASHA Field Worker
                </h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>Sita More (ASHA Worker)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to: {patient.village} · Distance: 0.5 km</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--green-primary)', fontWeight: 700, marginTop: '0.2rem' }}>📞 Phone: +91 98220 44102</div>
                </div>
                <a href="tel:+919822044102" className="btn-green-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                  <Phone size={13} /> Call ASHA
                </a>
              </div>
            </div>

            {/* NEAREST HOSPITAL DETAILS */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Building2 size={18} color="var(--green-primary)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Nearest Primary & Big Hospitals
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Local PHC */}
                <div style={{ background: 'var(--bg-main)', padding: '0.65rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--green-primary)' }}>PHC Khed Primary Health Center</div>
                  <div style={{ color: 'var(--text-muted)' }}>Distance: 1.2 km · Doctor: Dr. Aniket Deshmukh (MD)</div>
                  <div style={{ color: 'var(--text-main)', marginTop: '0.2rem' }}>🚨 Ambulance Contact: <strong>+91 98220 11928</strong></div>
                </div>

                {/* Apex Hospital */}
                <div style={{ background: 'var(--bg-main)', padding: '0.65rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 800, color: '#f59e0b' }}>District Hospital Pune (Aundh Apex Hospital)</div>
                  <div style={{ color: 'var(--text-muted)' }}>Distance: 14 km · ICU Beds Available: 12 Beds</div>
                  <div style={{ color: '#f87171', fontWeight: 700, marginTop: '0.2rem' }}>🚨 Emergency Hotline: 108 / +91 20 2728 9999</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            SECTION 2: PAST PRESCRIPTIONS & HISTORY (SORTED DATE-WISE)
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'HISTORY') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  2. Prescriptions & Medical History (Sorted Date-wise)
                </h2>
              </div>
              <span style={S.badge('green')}>{sortedHistory.length} Records Logged</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '550px', overflowY: 'auto' }}>
              {sortedHistory.length === 0 ? (
                <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No past medical history or prescriptions recorded yet.
                </div>
              ) : (
                sortedHistory.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: item.type === 'PRESCRIPTION' ? 'var(--green-primary)' : '#3b82f6' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {item.facility}</div>
                      </div>
                      <span style={S.badge(item.type === 'PRESCRIPTION' ? 'green' : 'amber')}>
                        📅 {item.date}
                      </span>
                    </div>

                    {item.type === 'PRESCRIPTION' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {item.diagnosis && (
                          <div style={{ background: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 6, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                            <strong>Clinical Diagnosis:</strong> {item.diagnosis}
                          </div>
                        )}

                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.2rem' }}>Prescribed Medicines:</div>
                        {Array.isArray(item.medicines) ? (
                          item.medicines.map((m, mIdx) => (
                            <div key={mIdx} style={{ background: 'var(--bg-main)', padding: '0.45rem 0.65rem', borderRadius: 6, fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span>💊 <strong>{m.name || m}</strong></span>
                              <span style={{ color: 'var(--green-primary)', fontWeight: 700 }}>{m.dosage} ({m.duration || '5 days'})</span>
                            </div>
                          ))
                        ) : (
                          <pre style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: 6, fontSize: '0.8rem', margin: 0, fontFamily: 'inherit' }}>{item.medicines}</pre>
                        )}

                        {item.advice && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                            💡 Doctor Advice: "{item.advice}"
                          </div>
                        )}
                      </div>
                    )}

                    {item.type === 'ASHA_VISIT' && (
                      <div style={{ marginTop: '0.4rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem', textAlign: 'center', background: 'var(--bg-main)', padding: '0.4rem', borderRadius: 6, margin: '0.3rem 0', fontSize: '0.75rem' }}>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>BP</span><div style={{ fontWeight: 700 }}>{item.vitals?.bpSystolic}/{item.vitals?.bpDiastolic}</div></div>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>SpO2</span><div style={{ fontWeight: 700 }}>{item.vitals?.spo2}%</div></div>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Sugar</span><div style={{ fontWeight: 700 }}>{item.vitals?.sugarLevel || 95}</div></div>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Fever</span><div style={{ fontWeight: 700 }}>{item.vitals?.temperature || 98.6}°F</div></div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Symptom Note: "{item.symptoms?.[0] || 'Routine checkup'}"
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 3: SCHEDULED DOCTOR VIDEO CALL & LIVE DOCTOR CHAT
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'CONSULT') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  3. Video Consult & Doctor Chat
                </h2>
              </div>
              <span style={S.badge(activeCall || isCallingMe ? 'green' : 'amber')}>
                {activeCall || isCallingMe ? '🔴 Live Call Active' : 'Dr. Aniket Deshmukh (Online)'}
              </span>
            </div>

            {/* Scheduled Appointments Card */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={15} /> Doctor Appointment & Video Call Interface
              </h3>

              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--green-primary)', borderRadius: '8px', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>Dr. Aniket Deshmukh (MD)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled Slot: <strong>{activeTeleconsult?.scheduledTime || 'Today at 6:30 PM (Immediate Available)'}</strong></div>
                  <div style={{ fontSize: '0.72rem', color: activeCall ? 'var(--green-primary)' : '#f59e0b', fontWeight: 700, marginTop: '0.15rem' }}>
                    Status: {activeCall ? '🟢 Live Video Call Connected' : 'Ready for Video Consultation'}
                  </div>
                </div>

                {activeCall ? (
                  <button onClick={endVideoCall} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <PhoneOff size={14} /> End Video Call
                  </button>
                ) : (
                  <button onClick={() => { startVideoCall(); if (onStartTeleconsult) onStartTeleconsult(patient, 'Immediate Call'); }} className="btn-green-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}>
                    <Video size={15} /> Join Video Call
                  </button>
                )}
              </div>
            </div>

            {/* LIVE SYNCHRONIZED VIDEO CALL + INTERACTIVE DOCTOR CHAT PANEL */}
            {activeCall ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', background: 'var(--bg-main)', border: '1px solid var(--green-primary)', borderRadius: '12px', padding: '1rem' }}>
                {/* Left: Video Stream */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--green-primary)', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Video size={14} /> 🟢 LIVE VIDEO TELECONSULTATION
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dr. Aniket Deshmukh (MD)</span>
                  </div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', background: '#000', border: '1px solid var(--border-dark)', position: 'relative' }}>
                    <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                    {!hasCameraAccess && (
                      <button 
                        type="button"
                        onClick={requestCameraAccess}
                        style={{
                          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                          background: 'var(--green-primary)', color: '#000000', border: 'none', borderRadius: '10px',
                          padding: '0.6rem 1.1rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                          boxShadow: '0 4px 20px rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 10
                        }}
                      >
                        <Video size={15} /> Enable Camera & Mic Access
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Live Chat Box */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: 10, padding: '0.85rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MessageSquare size={15} color="var(--green-primary)" /> Live Doctor Chat
                  </div>

                  <div style={{ flex: 1, minHeight: 180, maxHeight: 200, overflowY: 'auto', background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: 8, padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.5rem' }}>
                    {teleconsultChat.map(msg => {
                      const isPat = msg.sender === 'patient';
                      return (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: isPat ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '82%',
                            background: isPat ? 'var(--green-primary)' : 'var(--bg-subtle)',
                            color: isPat ? '#000000' : 'var(--text-main)',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: isPat ? 'none' : '1px solid var(--border-dark)'
                          }}>
                            <div style={{ fontSize: '0.62rem', color: isPat ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', marginBottom: '0.1rem' }}>
                              {isPat ? 'You' : 'Dr. Aniket Deshmukh'} &bull; {msg.timestamp}
                            </div>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendDoctorChat} style={{ display: 'flex', gap: '0.4rem' }}>
                    <input 
                      type="text" 
                      placeholder="Type message to doctor..." 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      style={{ ...S.input, background: 'var(--bg-main)' }} 
                    />
                    <button type="submit" className="btn-green-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
                      <Send size={14} /> Send
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MessageSquare size={15} color="var(--green-primary)" /> Live Chat with Dr. Aniket Deshmukh
                </h3>

                {/* Chat Message Stream */}
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: '8px', padding: '0.75rem', height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.65rem' }}>
                  {teleconsultChat.map(msg => {
                    const isPat = msg.sender === 'patient';
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isPat ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '80%',
                          background: isPat ? 'var(--green-primary)' : 'var(--bg-subtle)',
                          color: isPat ? '#000000' : 'var(--text-main)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: isPat ? 'none' : '1px solid var(--border-dark)'
                        }}>
                          <div style={{ fontSize: '0.65rem', color: isPat ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', marginBottom: '0.15rem' }}>
                            {isPat ? 'You' : 'Dr. Aniket Deshmukh'} · {msg.timestamp}
                          </div>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendDoctorChat} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input 
                    type="text" 
                    placeholder="Type message to doctor..." 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    style={{ ...S.input, background: 'var(--bg-main)' }} 
                  />
                  <button type="submit" className="btn-green-primary" style={{ padding: '0.5rem 1rem' }}>
                    <Send size={15} /> Send
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            SECTION 4: CONTEXT-AWARE AI HEALTH ASSISTANT
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'AI') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  4. Context-Aware AI Health Assistant
                </h2>
              </div>
              <span style={S.badge('green')}>24/7 AI Clinical Insights</span>
            </div>

            {/* Patient Context Summary Pill for AI */}
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.78rem', color: 'var(--text-main)' }}>
              🧠 <strong>AI Context Loaded:</strong> Analyzing medical record for <strong>{patient.name}</strong> ({patient.age}y, BP {patient.vitalsHistory?.[0]?.bpSystolic || 120}/{patient.vitalsHistory?.[0]?.bpDiastolic || 80}, SpO2 {patient.vitalsHistory?.[0]?.spo2 || 98}%) and {myPrescriptions.length} active prescriptions.
            </div>

            {/* Embedded AI Assistant Component */}
            <AiAssistant lang={lang} onTriggerSOS={onTriggerSOS} onNavigateTab={onNavigateTab} />
          </div>
        )}

      </div>
      
      {showQRModal && (
        <QRCodeDisplay patient={patient} onClose={() => setShowQRModal(false)} />
      )}
    </div>
  );
}
