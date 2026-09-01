import React, { useState, useRef, useEffect } from 'react';
import { 
  Stethoscope, ShieldCheck, AlertTriangle, Phone, Video, PhoneOff, 
  Building2, UserCheck, Calendar, FileText, Send, ArrowUpRight, 
  Clock, CheckCircle2, MapPin, Eye, PlusCircle, Activity, Heart, 
  Pill, FileCheck, ChevronRight, MessageSquare
} from 'lucide-react';
import { INITIAL_BIG_HOSPITALS } from '../data/mockData';
import { exportPatientToFHIR } from '../services/fhirExporter';

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
    if (type === 'red' || type === 'RED' || type === 'HIGH' || type === 'CRITICAL') {
      bg = 'rgba(239,68,68,0.12)'; color = '#f87171'; border = 'rgba(239,68,68,0.3)';
    } else if (type === 'amber' || type === 'YELLOW' || type === 'MEDIUM') {
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

export function DoctorConsole({ 
  patients = [], 
  referrals = [], 
  onSaveReferral, 
  selectedPatient, 
  setSelectedPatient, 
  sosAlert,
  prescriptions = [],
  onSavePrescription,
  doctorSection = 'ALL',
  setDoctorSection,
  activeTeleconsult,
  onStartTeleconsult,
  onAcceptTeleconsult,
  onEndTeleconsult,
  teleconsultChat = [],
  onSendChatMessage
}) {
  const activeSection = doctorSection || 'ALL';
  const setActiveSection = (sec) => {
    if (setDoctorSection) setDoctorSection(sec);
  };

  // --- Section 1: Emergency & Hospital Info State ---
  const [bigHospitals] = useState(INITIAL_BIG_HOSPITALS);
  const [activeCallPatient, setActiveCallPatient] = useState(null);

  // --- Section 2: ASHA Referrals, History Modal & Mobile E-Prescription State ---
  const [patientHistoryModal, setPatientHistoryModal] = useState(null);
  const [appointmentModalPatient, setAppointmentModalPatient] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState('In 1 Minute (Immediate)');
  const [rxSuccessMsg, setRxSuccessMsg] = useState('');
  const [selectedRxPatientId, setSelectedRxPatientId] = useState(patients[0]?.id || '');
  const [docChatInput, setDocChatInput] = useState('');
  
  // E-Prescription Form State
  const [rxForm, setRxForm] = useState({
    diagnosis: '',
    medicines: 'Paracetamol 500mg (1-0-1) - 5 days\nAmoxicillin 250mg (1-0-1) - 5 days\nORS Sachet (Ad libitum)',
    advice: 'Drink warm water, take rest, revisit if fever stays above 101°F.'
  });

  // --- Section 3: Big Hospital Referral State ---
  const [referralPatientId, setReferralPatientId] = useState(patients[0]?.id || '');
  const [targetHospitalId, setTargetHospitalId] = useState(INITIAL_BIG_HOSPITALS[0]?.id || '');
  const [referralUrgency, setReferralUrgency] = useState('HIGH');
  const [referralReason, setReferralReason] = useState('Severe hypertensive crisis requiring ICU monitoring and specialist evaluation.');
  const [referralSuccessMsg, setReferralSuccessMsg] = useState('');
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirData, setFhirData] = useState('');

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!selectedPatient && patients.length > 0) setSelectedPatient(patients[0]);
  }, [patients, selectedPatient, setSelectedPatient]);

  // Sync activeCallPatient with activeTeleconsult from global state
  useEffect(() => {
    if (activeTeleconsult && activeTeleconsult.patientId) {
      const p = patients.find(pat => pat.id === activeTeleconsult.patientId);
      if (p) setActiveCallPatient(p);
    }
  }, [activeTeleconsult, patients]);

  // Red alert emergency patients
  const redAlertPatients = patients.filter(p => p.vitalsHistory?.[0]?.triageResult?.level === 'RED');

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

  // Video Stream Initializer (runs when call is active)
  useEffect(() => {
    if (!activeCallPatient) {
      setHasCameraAccess(false);
      return;
    }

    let animId = null;

    const startStream = async () => {
      // Try initializing camera
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
        ctx.fillText('LIVE DOCTOR TELECONSULTATION', 320, 210);
        ctx.fillStyle = '#a1a1aa'; ctx.font = '14px Inter,sans-serif';
        ctx.fillText(`Patient: ${activeCallPatient.name} (${activeCallPatient.village || 'Local'})`, 320, 238);
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
  }, [activeCallPatient]);

  // Start call handler
  const startTeleconsult = (patient, schedTime = 'Right Now') => {
    setActiveCallPatient(patient);
    setSelectedPatient(patient);
    if (onStartTeleconsult) onStartTeleconsult(patient, schedTime);
  };

  const endTeleconsult = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    setActiveCallPatient(null);
    if (onEndTeleconsult) onEndTeleconsult();
  };

  const handleSendDoctorChat = (e) => {
    e?.preventDefault();
    if (!docChatInput.trim()) return;
    const patId = activeCallPatient?.id || selectedPatient?.id || patients[0]?.id;
    if (onSendChatMessage) onSendChatMessage(docChatInput, 'doctor', patId);
    setDocChatInput('');
  };

  // Quick Doctor Prescribing Chips
  const sendQuickChip = (text) => {
    const patId = activeCallPatient?.id || selectedPatient?.id || patients[0]?.id;
    if (onSendChatMessage) onSendChatMessage(`💊 Doctor Note: ${text}`, 'doctor', patId);
  };

  // Dispatch E-Prescription linked to mobile number
  const handleDispatchRx = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedRxPatientId) || selectedPatient || patients[0];
    if (!pat) return;

    const newRx = {
      id: `RX-${Math.floor(9000 + Math.random() * 900)}`,
      patientName: pat.name,
      phone: pat.phone || '+91 98230 11204',
      doctorName: 'Dr. Aniket Deshmukh (MD)',
      facility: 'PHC Khed',
      date: new Date().toISOString().split('T')[0],
      diagnosis: rxForm.diagnosis || 'Routine clinical assessment & consultation',
      medicines: rxForm.medicines.split('\n').map(m => ({ name: m, dosage: '1-0-1', duration: '5 days', instruction: 'After food' })),
      appointmentTime: appointmentTime || 'Tomorrow at 10:30 AM',
      advice: rxForm.advice
    };

    if (onSavePrescription) onSavePrescription(newRx);
    setRxSuccessMsg(`✓ E-Prescription dispatched to mobile profile (${pat.phone || 'Linked Phone'})!`);
    setTimeout(() => setRxSuccessMsg(''), 6000);
  };

  // Schedule Appointment & Call
  const handleSaveAppointment = (e) => {
    e.preventDefault();
    if (!appointmentModalPatient) return;
    startTeleconsult(appointmentModalPatient, appointmentTime);
    setRxSuccessMsg(`✓ Tele-appointment scheduled & live call link created for ${appointmentModalPatient.name} (${appointmentTime})`);
    setAppointmentModalPatient(null);
    setTimeout(() => setRxSuccessMsg(''), 6000);
  };

  // Big Hospital Referral
  const handleBigHospitalReferral = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === referralPatientId) || patients[0];
    const hosp = bigHospitals.find(h => h.id === targetHospitalId) || bigHospitals[0];
    if (!pat || !hosp) return;

    const newRef = {
      id: `REF-TERTIARY-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: pat.id,
      patientName: pat.name,
      phone: pat.phone,
      fromFacility: 'PHC Khed (Dr. Aniket Deshmukh)',
      toFacility: `${hosp.name} (${hosp.city})`,
      urgency: referralUrgency,
      reason: referralReason,
      status: 'EN_ROUTE',
      createdAt: new Date().toISOString(),
      expectedArrival: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString()
    };

    onSaveReferral(newRef);
    setReferralSuccessMsg(`✓ Referral dispatched to ${hosp.name} (108 ALS Ambulance Notified)!`);
    setTimeout(() => setReferralSuccessMsg(''), 6000);
  };

  const handleOpenFhir = (pat) => {
    const target = pat || selectedPatient || patients[0];
    if (!target) return;
    setFhirData(JSON.stringify(exportPatientToFHIR(target), null, 2));
    setShowFhirModal(true);
  };

  const currentCallPat = activeCallPatient || (activeTeleconsult ? patients.find(p => p.id === activeTeleconsult.patientId) : null);

  return (
    <div className="app-container-max" style={{ padding: '1rem 0 3rem 0' }}>
      
      {/* TOP HEADER: DOCTOR PROFILE & QUALIFICATION CARD */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(24,24,27,0.9) 100%)',
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
            width: 54, height: 54, borderRadius: '50%',
            background: 'rgba(16,185,129,0.2)', border: '2px solid var(--green-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)'
          }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Dr. Aniket Deshmukh
              </h1>
              <span style={S.badge('green')}>MBBS, MD (General Medicine)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
              Senior Medical Officer · PHC Khed, Pune · Reg. No: <strong>MMC-2018/04/1892</strong>
            </p>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All 3 Sections' },
            { id: 'EMERGENCY', label: '1. Emergency & Big Hospital' },
            { id: 'ASHA_RX', label: '2. ASHA Referrals & Mobile Rx' },
            { id: 'BIG_HOSPITAL', label: '3. Refer to Big Hospital' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              border: activeSection === tab.id ? '1px solid var(--green-primary)' : '1px solid var(--border-dark)',
              background: activeSection === tab.id ? 'var(--green-primary)' : 'var(--bg-subtle)',
              color: activeSection === tab.id ? 'var(--bg-main)' : 'var(--text-main)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOS Alert Banner */}
      {sosAlert && (
        <div style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '1.1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f87171', margin: 0, textTransform: 'uppercase' }}>
              Active Emergency 108 SOS Alert
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
              📍 Live GPS: Lat {sosAlert.lat}°, Long {sosAlert.lng}° ({sosAlert.locationName || 'Khed Area'}) · Dispatched at {sosAlert.time}
            </span>
          </div>
        </div>
      )}

      {/* LIVE SYNCHRONIZED VIDEO CALL + INTERACTIVE DOCTOR CHAT PANEL */}
      {currentCallPat && (
        <div style={{ ...S.card, padding: '1.25rem', marginBottom: '1.5rem', borderColor: 'var(--green-primary)', background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(24,24,27,0.95) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ color: 'var(--green-primary)', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Video size={16} /> LIVE TELECONSULTATION CALL ACTIVE
              </span>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
                Patient: {currentCallPat.name} ({currentCallPat.village || 'Local'}) &bull; Mobile: {currentCallPat.phone}
              </h3>
            </div>

            <button onClick={endTeleconsult} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <PhoneOff size={14} /> End Teleconsultation
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'stretch' }}>
            {/* Left: Video Canvas */}
            <div style={{ borderRadius: 10, overflow: 'hidden', background: '#000', border: '1px solid var(--border-dark)', position: 'relative' }}>
              <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: 320, objectFit: 'cover' }} />
              {!hasCameraAccess && (
                <button 
                  type="button"
                  onClick={requestCameraAccess}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'var(--green-primary)', color: '#000000', border: 'none', borderRadius: '10px',
                    padding: '0.65rem 1.1rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 10
                  }}
                >
                  <Video size={16} /> Allow Camera & Mic Access
                </button>
              )}
              <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 700 }}>
                {hasCameraAccess ? '🟢 Real Live Camera Feed Active' : '🟡 Click button to enable camera'}
              </div>
            </div>

            {/* Right: Integrated Doctor Live Chat */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MessageSquare size={16} color="var(--green-primary)" /> Live Doctor Chat Box
              </div>

              {/* Chat Messages Log */}
              <div style={{ flex: 1, minHeight: 180, maxHeight: 200, overflowY: 'auto', background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: 8, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {teleconsultChat.map(msg => {
                  const isDoc = msg.sender === 'doctor';
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isDoc ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '82%',
                        background: isDoc ? 'var(--green-primary)' : 'var(--bg-subtle)',
                        color: isDoc ? '#000000' : 'var(--text-main)',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: isDoc ? 'none' : '1px solid var(--border-dark)'
                      }}>
                        <div style={{ fontSize: '0.62rem', color: isDoc ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', marginBottom: '0.1rem' }}>
                          {isDoc ? 'Dr. Aniket Deshmukh' : currentCallPat.name} &bull; {msg.timestamp}
                        </div>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Doctor Response Chips */}
              <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', marginBottom: '0.5rem' }}>
                {['Take Paracetamol 500mg', 'Measure BP in 10 mins', 'Show throat to camera', 'Drink ORS hydration'].map((chip, idx) => (
                  <button key={idx} onClick={() => sendQuickChip(chip)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '9999px', color: 'var(--text-muted)', padding: '0.2rem 0.55rem', fontSize: '0.68rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Doctor Chat Input Form */}
              <form onSubmit={handleSendDoctorChat} style={{ display: 'flex', gap: '0.4rem' }}>
                <input 
                  type="text" 
                  placeholder="Type message to patient..." 
                  value={docChatInput} 
                  onChange={e => setDocChatInput(e.target.value)} 
                  style={{ ...S.input, background: 'var(--bg-main)' }} 
                />
                <button type="submit" className="btn-green-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3 DEDICATED SECTIONS PANELS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeSection === 'ALL' 
          ? 'repeat(auto-fit, minmax(340px, 1fr))' 
          : '1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>

        {/* =========================================================
            SECTION 1: EMERGENCY RED ALERTS & CLOSEST BIG HOSPITAL INFO
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'EMERGENCY') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} color="#f87171" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  1. Emergency Red Alerts & Hospital Info
                </h2>
              </div>
              <span style={S.badge('red')}>{redAlertPatients.length} Red Cases</span>
            </div>

            {/* Red Alert Cases Queue */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem' }}>
                RED ALERT Critical Cases Queue ({redAlertPatients.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
                {redAlertPatients.length === 0 ? (
                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No active Red Alert cases at this time.
                  </div>
                ) : (
                  redAlertPatients.map(p => {
                    const vit = p.vitalsHistory?.[0] || {};
                    return (
                      <div key={p.id} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.age} yrs · {p.gender} · {p.village}</div>
                          </div>
                          <span style={S.badge('red')}>RED CRITICAL</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.3rem', background: 'var(--bg-main)', padding: '0.4rem', borderRadius: '6px', margin: '0.5rem 0', textAlign: 'center', fontSize: '0.72rem' }}>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>BP</span><div style={{ fontWeight: 700, color: '#f87171' }}>{vit.bpSystolic}/{vit.bpDiastolic}</div></div>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>SpO2</span><div style={{ fontWeight: 700, color: '#f87171' }}>{vit.spo2}%</div></div>
                          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Pulse</span><div style={{ fontWeight: 700 }}>{vit.pulse} bpm</div></div>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600, marginBottom: '0.5rem' }}>
                          ⚠️ {vit.triageResult?.reason || 'Critical vitals elevation'}
                        </div>

                        <button onClick={() => startTeleconsult(p, 'Immediate Call')} className="btn-green-primary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444' }}>
                          <Video size={13} /> Emergency Video Call
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CLOSEST BIG HOSPITAL DESCRIPTION */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Building2 size={18} color="var(--green-primary)" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Closest Big Hospital Description
                </h3>
              </div>

              {bigHospitals.slice(0, 1).map(h => (
                <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--green-primary)' }}>{h.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.type} · {h.distance} away</div>
                    </div>
                    <span style={S.badge('green')}>{h.icuBedsAvailable} ICU Beds Available</span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0', lineHeight: 1.4 }}>
                    {h.description}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <strong>Specialties:</strong> {h.specialties.join(', ')}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.75rem' }}>
                    <span>🚨 Emergency Hotline: <strong>{h.emergencyHotline}</strong></span>
                    <a href={`tel:${h.phone}`} style={{ color: 'var(--green-primary)', fontWeight: 700, textDecoration: 'none' }}>Call Hospital</a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================
            SECTION 2: ASHA REFERRALS, HISTORY, TELE-APPOINTMENT & RX
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'ASHA_RX') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  2. ASHA Referrals & Mobile E-Rx
                </h2>
              </div>
              <span style={S.badge('green')}>{patients.length} ASHA Records</span>
            </div>

            {/* ASHA Referred Patients Directory */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                ASHA Referred Patients & Old History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '250px', overflowY: 'auto' }}>
                {patients.map(pt => {
                  const vit = pt.vitalsHistory?.[0] || {};
                  return (
                    <div key={pt.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{pt.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pt.age}y · {pt.gender} · Mobile: <strong>{pt.phone || 'N/A'}</strong></div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button onClick={() => setPatientHistoryModal(pt)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: '6px', color: 'var(--text-main)', padding: '0.25rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Eye size={11} /> Profile & Old History
                          </button>
                          <button onClick={() => setAppointmentModalPatient(pt)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green-primary)', borderRadius: '6px', color: 'var(--green-primary)', padding: '0.25rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Calendar size={11} /> Give Call Appointment
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        <strong>ASHA Symptom Note:</strong> "{vit.symptoms?.[0] || pt.diseaseDetails || 'Routine field checkup'}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* E-PRESCRIPTION FORM (LINKED TO MOBILE NUMBER) */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Pill size={15} /> Write E-Prescription (Linked to Mobile Number)
              </h3>

              <form onSubmit={handleDispatchRx} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <label style={S.label}>Select Patient & Linked Mobile Number *</label>
                  <select value={selectedRxPatientId} onChange={e => setSelectedRxPatientId(e.target.value)} style={S.input}>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - Mobile: {p.phone || 'N/A'} ({p.village || 'Village'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={S.label}>Clinical Diagnosis Notes</label>
                  <input type="text" placeholder="e.g. Stage 2 Hypertension / Acute Fever" value={rxForm.diagnosis} onChange={e => setRxForm({...rxForm, diagnosis: e.target.value})} style={S.input} />
                </div>

                <div>
                  <label style={S.label}>Prescribed Medicines & Dosage (Line-separated)</label>
                  <textarea rows={3} placeholder="Medicine Name (Dosage) - Duration" value={rxForm.medicines} onChange={e => setRxForm({...rxForm, medicines: e.target.value})} style={{ ...S.input, resize: 'none' }} />
                </div>

                <div>
                  <label style={S.label}>Doctor Advice / Precautions</label>
                  <input type="text" value={rxForm.advice} onChange={e => setRxForm({...rxForm, advice: e.target.value})} style={S.input} />
                </div>

                {rxSuccessMsg && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} /> {rxSuccessMsg}
                  </div>
                )}

                <button type="submit" className="btn-green-primary" style={{ padding: '0.65rem', marginTop: '0.2rem', width: '100%', justifyContent: 'center' }}>
                  <Send size={15} /> Dispatch E-Prescription to Mobile Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 3: REFERRAL TO BIG HOSPITALS
           ========================================================= */}
        {(activeSection === 'ALL' || activeSection === 'BIG_HOSPITAL') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  3. Refer Patient to Big Hospital
                </h2>
              </div>
              <span style={S.badge('amber')}>{referrals.length} Total Referrals</span>
            </div>

            {/* BIG HOSPITAL REFERRAL FORM */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowUpRight size={15} /> Dispatch Tertiary Referral
              </h3>

              <form onSubmit={handleBigHospitalReferral} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <label style={S.label}>Select Patient to Refer *</label>
                  <select value={referralPatientId} onChange={e => setReferralPatientId(e.target.value)} style={S.input}>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.village || 'Village'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={S.label}>Select Target Big Hospital *</label>
                  <select value={targetHospitalId} onChange={e => setTargetHospitalId(e.target.value)} style={S.input}>
                    {bigHospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.distance} - {h.icuBedsAvailable} ICU beds)</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={S.label}>Urgency Level</label>
                    <select value={referralUrgency} onChange={e => setReferralUrgency(e.target.value)} style={S.input}>
                      <option value="HIGH">HIGH (108 Ambulance Dispatch)</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">ROUTINE</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Clinical Reason</label>
                    <input type="text" required value={referralReason} onChange={e => setReferralReason(e.target.value)} style={S.input} />
                  </div>
                </div>

                {referralSuccessMsg && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} /> {referralSuccessMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <button type="button" onClick={() => handleOpenFhir()} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: '8px', color: 'var(--text-main)', padding: '0.6rem 0.9rem', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileCheck size={14} /> FHIR R4 Bundle
                  </button>
                  <button type="submit" className="btn-green-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <ArrowUpRight size={15} /> Dispatch Referral to Hospital
                  </button>
                </div>
              </form>
            </div>

            {/* BIG HOSPITALS DIRECTORY & ACTIVE PIPELINE */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Active Big Hospital Referral Pipeline ({referrals.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '250px', overflowY: 'auto' }}>
                {referrals.map(r => (
                  <div key={r.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{r.patientName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>➡️ Target: <strong>{r.toFacility || r.targetFacility}</strong></div>
                      </div>
                      <span style={S.badge(r.urgency)}>{r.status || 'EN_ROUTE'}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Reason: "{r.reason}"
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: FULL PATIENT PROFILE & OLD MEDICAL HISTORY */}
      {patientHistoryModal && (
        <div className="modal-overlay-dark" onClick={() => setPatientHistoryModal(null)}>
          <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-dark)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Patient Profile & Complete Old History
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ABHA ID: {patientHistoryModal.abhaId || '91-4829-1029-4821'}</span>
              </div>
              <button onClick={() => setPatientHistoryModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div><strong>Name:</strong> {patientHistoryModal.name}</div>
                <div><strong>Age / Gender:</strong> {patientHistoryModal.age}y / {patientHistoryModal.gender}</div>
                <div><strong>Mobile:</strong> {patientHistoryModal.phone || 'N/A'}</div>
                <div><strong>Village:</strong> {patientHistoryModal.village}</div>
                <div><strong>Blood Group:</strong> <span style={{ color: 'var(--green-primary)', fontWeight: 800 }}>{patientHistoryModal.bloodGroup || 'O+'}</span></div>
                <div><strong>Sync Status:</strong> {patientHistoryModal.syncStatus || 'Synced'}</div>
              </div>

              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0 0.2rem 0' }}>
                Past Vitals & ASHA Field Records History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '260px', overflowY: 'auto' }}>
                {(patientHistoryModal.vitalsHistory || []).map((v, i) => (
                  <div key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-dark)', borderRadius: 8, padding: '0.75rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                      <span>📅 Recorded Date: {v.timestamp ? v.timestamp.split('T')[0] : '2026-08-26'}</span>
                      <span style={S.badge(v.triageResult?.level || 'GREEN')}>{v.triageResult?.level || 'STABLE'}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem', textAlign: 'center', background: 'var(--bg-subtle)', padding: '0.4rem', borderRadius: 6, margin: '0.3rem 0' }}>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>BP</span><div style={{ fontWeight: 700 }}>{v.bpSystolic}/{v.bpDiastolic}</div></div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>SpO2</span><div style={{ fontWeight: 700 }}>{v.spo2}%</div></div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Sugar</span><div style={{ fontWeight: 700 }}>{v.sugarLevel || 95}</div></div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Fever</span><div style={{ fontWeight: 700 }}>{v.temperature || 98.6}°F</div></div>
                    </div>

                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      "{v.symptoms?.[0] || v.voiceNote || 'Routine checkup'}"
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setPatientHistoryModal(null)} className="btn-green-primary" style={{ padding: '0.5rem 1.25rem' }}>Close History</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GIVE CALL APPOINTMENT */}
      {appointmentModalPatient && (
        <div className="modal-overlay-dark" onClick={() => setAppointmentModalPatient(null)}>
          <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <Calendar size={18} /> Schedule & Start Doctor Call
              </h3>
              <button onClick={() => setAppointmentModalPatient(null)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleSaveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={S.label}>Patient Name</label>
                <input type="text" readOnly value={`${appointmentModalPatient.name} (${appointmentModalPatient.phone || 'No phone'})`} style={{ ...S.input, background: 'var(--bg-main)' }} />
              </div>

              <div>
                <label style={S.label}>Select Appointment Time Slot / Frequency *</label>
                <select value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} style={S.input}>
                  <option value="Right Now (Immediate Call)">Right Now (Immediate Call)</option>
                  <option value="In 1 Minute">In 1 Minute (Scheduled Call)</option>
                  <option value="In 5 Minutes">In 5 Minutes (Scheduled Call)</option>
                  <option value="Today at 02:45 AM">Today at 02:45 AM</option>
                  <option value="Tomorrow at 10:30 AM">Tomorrow at 10:30 AM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { startTeleconsult(appointmentModalPatient, 'Immediate Call'); setAppointmentModalPatient(null); }} style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green-primary)', borderRadius: '8px', color: 'var(--green-primary)', padding: '0.65rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <Video size={14} /> Call Now
                </button>
                <button type="submit" className="btn-green-primary" style={{ flex: 1.2, justifyContent: 'center' }}>
                  Confirm & Notify Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FHIR R4 BUNDLE */}
      {showFhirModal && (
        <div className="modal-overlay-dark" onClick={() => setShowFhirModal(false)}>
          <div className="modal-content-dark" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                FHIR R4 Hospital Bundle Export
              </h3>
              <button onClick={() => setShowFhirModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <pre style={{ background: 'var(--bg-main)', color: '#10b981', padding: '1rem', borderRadius: 8, fontSize: '0.76rem', maxHeight: 360, overflowY: 'auto', fontFamily: 'monospace' }}>{fhirData}</pre>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setShowFhirModal(false)} className="btn-green-primary">Close Bundle</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
