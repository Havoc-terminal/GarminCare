import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Navigation, Phone, AlertTriangle, UserPlus, 
  Search, Activity, Pill, UserCheck, Calendar, Heart, Thermometer, 
  Droplet, Zap, PlusCircle, Edit3, ArrowRight, CheckCircle2, ShieldAlert,
  Clock, Stethoscope, ChevronRight, RefreshCw, FileText, QrCode, Mic, MicOff
} from 'lucide-react';
import { QRScanner } from './QRScanner';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  INITIAL_PHARMACIES, 
  INITIAL_DOCTORS, 
  INITIAL_SOS_REQUESTS 
} from '../data/mockData';
import { evaluateTriage } from '../services/triageEngine';

const S = {
  card: { 
    background: 'var(--bg-card)', 
    border: '1px solid var(--border-dark)', 
    borderRadius: '16px', 
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 4px 20px rgba(var(--bg-main),0.2)'
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
    if (type === 'red' || type === 'HIGH' || type === 'OUT_OF_STOCK') {
      bg = 'rgba(239,68,68,0.12)'; color = '#f87171'; border = 'rgba(239,68,68,0.3)';
    } else if (type === 'amber' || type === 'MEDIUM' || type === 'LOW_STOCK') {
      bg = 'rgba(245,158,11,0.12)'; color = '#f59e0b'; border = 'rgba(245,158,11,0.3)';
    }
    return {
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      borderRadius: '9999px',
      padding: '0.2rem 0.65rem',
      fontSize: '0.7rem',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    };
  }
};

export function AshaFieldApp({ 
  patients = [], 
  onSavePatient, 
  isOnline, 
  inventory = [], 
  onUpdateInventory,
  referrals = [],
  onSaveReferral, 
  onTriggerSOS,
  ashaSection = 'ALL',
  setAshaSection
}) {
  const activeTab = ashaSection;
  const setActiveTab = (val) => {
    if (setAshaSection) setAshaSection(val);
  };

  // --- Section 1: Pharmacies & Emergency SOS State ---
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [manualLocation, setManualLocation] = useState('Bhamburda (Khed)');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [sosCases, setSosCases] = useState(INITIAL_SOS_REQUESTS);
  const [pharmacies] = useState(INITIAL_PHARMACIES);
  const [showSosModal, setShowSosModal] = useState(false);
  const [newSosData, setNewSosData] = useState({ patientName: '', problem: '', location: 'Bhamburda, Khed' });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [patientForQRCard, setPatientForQRCard] = useState(null);

  // --- Section 2: Patient Registration & History State ---
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    bloodGroup: 'O+',
    spo2: '98',
    bpSystolic: '120',
    bpDiastolic: '80',
    sugarLevel: '95',
    fever: '98.6',
    problem: ''
  });
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');
  
  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [dictationLang, setDictationLang] = useState('mr-IN');
  const recognitionRef = React.useRef(null);

  // --- Section 3: Medicine Stock & Availability State ---
  const [stockList, setStockList] = useState(inventory);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', category: 'Medicine', stockCount: 100, unit: 'Tablets' });

  // Sync inventory changes back when props update
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setStockList(inventory);
    }
  }, [inventory]);

  // --- Section 4: Doctor Referral State ---
  const [doctors] = useState(INITIAL_DOCTORS);
  const [selectedDoctorId, setSelectedDoctorId] = useState(INITIAL_DOCTORS[0]?.id || '');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [referralReason, setReferralReason] = useState('');
  const [referralUrgency, setReferralUrgency] = useState('HIGH');

  // Fetch Geolocation on load
  useEffect(() => {
    fetchCurrentGps();
  }, []);

  const toggleDictation = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // Force prompt for microphone permission first
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      alert("Microphone access denied! Please allow microphone access in your browser site settings (click the lock icon in the address bar).");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = dictationLang;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsRecording(true);
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setPatientForm(prev => ({
            ...prev,
            problem: (prev.problem ? prev.problem + ' ' : '') + finalTranscript.trim()
          }));
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
          alert("Voice Error: " + event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      alert("Failed to start voice engine. Make sure you are using Chrome.");
    }
  };

  const fetchCurrentGps = () => {
    if (!navigator.geolocation) return;
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setLatitude(lat);
        setLongitude(lng);
        setIsGpsLoading(false);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const area = data.address?.village || data.address?.town || data.address?.city || data.address?.county;
          if (area) setManualLocation(`${area} (${lat}, ${lng})`);
        } catch (e) {
          // ignore lookup error fallback
        }
      },
      (err) => {
        setIsGpsLoading(false);
        setLatitude('18.8521');
        setLongitude('73.9102');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Section 1: Handle Add SOS Request
  const handleAddSosSubmit = (e) => {
    e.preventDefault();
    if (!newSosData.patientName || !newSosData.problem) return;
    const newCase = {
      id: `SOS-${Math.floor(900 + Math.random() * 90)}`,
      patientName: newSosData.patientName,
      problem: newSosData.problem,
      location: newSosData.location || manualLocation || 'Bhamburda, Khed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: '108 Dispatch Beacon Active'
    };
    setSosCases([newCase, ...sosCases]);
    setNewSosData({ patientName: '', problem: '', location: manualLocation || 'Bhamburda, Khed' });
    setShowSosModal(false);
    if (onTriggerSOS) onTriggerSOS();
  };

  // Section 2: Handle Save Patient
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!patientForm.name || !patientForm.age) {
      setFormError('Please enter Patient Name and Age before saving.');
      return;
    }

    try {
      const sys = parseInt(patientForm.bpSystolic) || 120;
      const dia = parseInt(patientForm.bpDiastolic) || 80;
      const spo2 = parseInt(patientForm.spo2) || 98;
      const temp = parseFloat(patientForm.fever) || 98.6;

      const vitalsObj = { bpSystolic: sys, bpDiastolic: dia, spo2: spo2, temperature: temp, pulse: 80 };
      const symptomsArr = patientForm.problem ? [patientForm.problem] : [];
      const triageRes = evaluateTriage(vitalsObj, symptomsArr, { age: patientForm.age });

      const now = new Date();
      const timePart = now.toTimeString().split(' ')[0];
      let registeredIso;
      try {
        registeredIso = patientForm.date 
          ? new Date(`${patientForm.date}T${timePart}`).toISOString() 
          : now.toISOString();
      } catch (err) {
        registeredIso = now.toISOString();
      }

      const newPat = {
        id: `PAT-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: patientForm.name,
        age: parseInt(patientForm.age),
        gender: patientForm.gender,
        phone: patientForm.phone || '+91 98000 00000',
        bloodGroup: patientForm.bloodGroup,
        village: manualLocation.split('(')[0].trim() || 'Bhamburda (Khed)',
        registeredAt: registeredIso,
        dateStr: patientForm.date,
        vitalsHistory: [
          {
            timestamp: now.toISOString(),
            bpSystolic: sys,
            bpDiastolic: dia,
            temperature: temp,
            spo2: spo2,
            sugarLevel: patientForm.sugarLevel || '95',
            symptoms: [patientForm.problem || 'Routine Field Assessment'],
            triageResult: triageRes
          }
        ]
      };

      onSavePatient(newPat);
      setSaveSuccessMsg(`✓ Patient "${patientForm.name}" history recorded & saved to history list!`);
      setTimeout(() => setSaveSuccessMsg(''), 6000);

      // Reset Form
      setPatientForm({
        name: '',
        age: '',
        gender: 'Female',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        bloodGroup: 'O+',
        spo2: '98',
        bpSystolic: '120',
        bpDiastolic: '80',
        sugarLevel: '95',
        fever: '98.6',
        problem: ''
      });
    } catch (err) {
      console.error('Save Patient Error:', err);
      setFormError(`Failed to save patient: ${err.message}`);
    }
  };

  const handleQRScanSuccess = (data) => {
    setShowQRScanner(false);
    if (!data) return;
    
    // Check if patient exists in history to select them (optional), 
    // but primary goal is to auto-fill the form
    setPatientForm(prev => ({
      ...prev,
      name: data.n || prev.name,
      age: data.a || prev.age,
      gender: data.g || prev.gender,
      bloodGroup: data.bg || prev.bloodGroup,
      phone: data.ph || prev.phone,
      abhaId: data.abha || prev.abhaId
    }));
    setSaveSuccessMsg(`✓ Scanned Health Card for ${data.n || 'Patient'} and auto-filled details!`);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Section 3: Handle Medicine Stock Update
  const updateStockCount = (id, delta) => {
    const updated = stockList.map(item => {
      if (item.id === id) {
        const newCount = Math.max(0, item.stockCount + delta);
        let newStatus = 'AVAILABLE';
        if (newCount === 0) newStatus = 'OUT_OF_STOCK';
        else if (newCount < 50) newStatus = 'LOW_STOCK';
        return { ...item, stockCount: newCount, status: newStatus };
      }
      return item;
    });
    setStockList(updated);
    if (onUpdateInventory) onUpdateInventory(updated);
  };

  const handleAddMedicineSubmit = (e) => {
    e.preventDefault();
    if (!newMed.name) return;
    const newItem = {
      id: `INV-${Math.floor(200 + Math.random() * 800)}`,
      facilityId: 'FAC-001',
      facilityName: 'PHC Khed',
      name: newMed.name,
      category: newMed.category,
      stockCount: parseInt(newMed.stockCount) || 100,
      unit: newMed.unit,
      status: parseInt(newMed.stockCount) > 50 ? 'AVAILABLE' : 'LOW_STOCK',
      lastUpdated: new Date().toISOString()
    };
    const updated = [newItem, ...stockList];
    setStockList(updated);
    if (onUpdateInventory) onUpdateInventory(updated);
    setShowAddMedModal(false);
    setNewMed({ name: '', category: 'Medicine', stockCount: 100, unit: 'Tablets' });
  };

  // Section 4: Handle Referral Submit
  const handleCreateReferral = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId) || patients[0];
    const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
    if (!pat || !doc) return;

    const newRef = {
      id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: pat.id,
      patientName: pat.name,
      fromFacility: 'ASHA Sub-Centre Bhamburda',
      toFacility: `${doc.hospital} (${doc.name})`,
      urgency: referralUrgency,
      reason: referralReason || 'Recommended by ASHA worker for specialized evaluation',
      status: 'EN_ROUTE',
      createdAt: new Date().toISOString(),
      expectedArrival: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
    };

    onSaveReferral(newRef);
    setReferralReason('');
  };

  // Filtered Patients list sorted date-wise (newest first)
  const sortedPatients = [...patients].sort((a, b) => {
    const dateA = new Date(a.registeredAt || a.dateStr || 0);
    const dateB = new Date(b.registeredAt || b.dateStr || 0);
    return dateB - dateA;
  }).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
                          (p.phone && p.phone.includes(patientSearch));
    const matchesDate = !selectedDateFilter || (p.registeredAt && p.registeredAt.startsWith(selectedDateFilter));
    return matchesSearch && matchesDate;
  });

  return (
    <div className="app-container-max" style={{ padding: '1rem 0 3rem 0' }}>
      
      {/* Clean top container spacing */}
      <div style={{ marginBottom: '1rem' }} />

      {/* 4 HORIZONTAL SECTIONS GRID / SIDE-BY-SIDE PANELS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeTab === 'ALL' 
          ? 'repeat(auto-fit, minmax(320px, 1fr))' 
          : '1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>

        {/* ==========================================
            SECTION 1: LOCAL PHARMACIES & EMERGENCY CASES
           ========================================== */}
        {(activeTab === 'ALL' || activeTab === 'PHARMACY') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  1. Local Pharmacies & SOS
                </h2>
              </div>
              <button onClick={() => setShowSosModal(true)} style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <AlertTriangle size={13} />
                <span>+ Add SOS</span>
              </button>
            </div>

            {/* GPS & Manual Location Box */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="#10b981" /> Live GPS & Location
                </span>
                <button type="button" onClick={fetchCurrentGps} style={{ background: 'none', border: 'none', color: 'var(--green-primary)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <RefreshCw size={11} className={isGpsLoading ? 'animate-spin' : ''} /> {isGpsLoading ? 'Locating...' : 'Refresh GPS'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="text" placeholder="Latitude" value={latitude} readOnly style={{ ...S.input, background: 'var(--bg-main)', fontSize: '0.75rem' }} />
                <input type="text" placeholder="Longitude" value={longitude} readOnly style={{ ...S.input, background: 'var(--bg-main)', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={S.label}>Manual Location / Village Name</label>
                <input type="text" value={manualLocation} onChange={e => setManualLocation(e.target.value)} placeholder="e.g. Khed, Bhamburda" style={S.input} />
              </div>
            </div>

            {/* Emergency SOS Queue */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={14} /> Active Emergency SOS Requests ({sosCases.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {sosCases.map(s => (
                  <div key={s.id} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.patientName}</span>
                      <span style={S.badge('red')}>{s.status}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>{s.problem}</p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>📍 {s.location} · {s.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Pharmacies List */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Building2 size={14} color="#10b981" /> Nearby Pharmacies in Area
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pharmacies.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.village} ({p.distance} away)</div>
                      </div>
                      <span style={S.badge(p.status === 'Open' ? 'green' : 'red')}>{p.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span><Clock size={11} /> {p.timing}</span>
                      <a href={`tel:${p.phone}`} style={{ color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Phone size={11} /> {p.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SECTION 2: PATIENT HISTORY & REGISTRATION
           ========================================== */}
        {(activeTab === 'ALL' || activeTab === 'PATIENTS') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  2. Patient Entry & History
                </h2>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {sortedPatients.length} Saved Records
              </span>
            </div>

            {/* TOP PATIENT REGISTRATION FORM */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--green-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={15} /> New Patient History Form
                </h3>
                <button 
                  onClick={() => setShowQRScanner(true)}
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--green-primary)', color: 'var(--green-primary)', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <QrCode size={13} /> Scan QR Card
                </button>
              </div>
              
              <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={S.label}>Patient Name *</label>
                    <input type="text" required placeholder="Full Name" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Age *</label>
                    <input type="number" required placeholder="Years" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} style={S.input} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={S.label}>Gender</label>
                    <select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})} style={S.input}>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Phone Number</label>
                    <input type="tel" placeholder="+91..." value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Date</label>
                    <input type="date" value={patientForm.date} onChange={e => setPatientForm({...patientForm, date: e.target.value})} style={S.input} />
                  </div>
                </div>

                {/* Vitals Row */}
                <div>
                  <label style={{ ...S.label, color: 'var(--green-primary)', fontWeight: 700 }}>Point-of-Care Vitals & History</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Blood Grp</span>
                      <select value={patientForm.bloodGroup} onChange={e => setPatientForm({...patientForm, bloodGroup: e.target.value})} style={{ ...S.input, padding: '0.4rem 0.2rem', fontSize: '0.75rem' }}>
                        {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>O2 (%)</span>
                      <input type="number" placeholder="98" value={patientForm.spo2} onChange={e => setPatientForm({...patientForm, spo2: e.target.value})} style={{ ...S.input, padding: '0.4rem 0.4rem', fontSize: '0.75rem' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BP (Sys)</span>
                      <input type="number" placeholder="120" value={patientForm.bpSystolic} onChange={e => setPatientForm({...patientForm, bpSystolic: e.target.value})} style={{ ...S.input, padding: '0.4rem 0.4rem', fontSize: '0.75rem' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sugar</span>
                      <input type="number" placeholder="95" value={patientForm.sugarLevel} onChange={e => setPatientForm({...patientForm, sugarLevel: e.target.value})} style={{ ...S.input, padding: '0.4rem 0.4rem', fontSize: '0.75rem' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Fever (°F)</span>
                      <input type="number" step="0.1" placeholder="98.6" value={patientForm.fever} onChange={e => setPatientForm({...patientForm, fever: e.target.value})} style={{ ...S.input, padding: '0.4rem 0.4rem', fontSize: '0.75rem' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label style={{ ...S.label, marginBottom: 0 }}>Patient Problem Details / Complaints</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select 
                        value={dictationLang} 
                        onChange={e => setDictationLang(e.target.value)} 
                        style={{ ...S.input, padding: '0.1rem 0.3rem', fontSize: '0.65rem', width: 'auto' }}
                      >
                        <option value="mr-IN">Marathi (मराठी)</option>
                        <option value="hi-IN">Hindi (हिंदी)</option>
                        <option value="en-IN">English</option>
                      </select>
                      <button 
                        type="button"
                        onClick={toggleDictation}
                        style={{
                          background: isRecording ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          border: `1px solid ${isRecording ? '#f87171' : 'var(--green-primary)'}`,
                          color: isRecording ? '#f87171' : 'var(--green-primary)',
                          borderRadius: '6px',
                          padding: '0.3rem 0.6rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {isRecording ? <><MicOff size={12} className="animate-pulse" /> Stop</> : <><Mic size={12} /> Dictate Voice</>}
                      </button>
                    </div>
                  </div>
                  <textarea placeholder="Write about symptoms or illness facing the person..." rows={3} value={patientForm.problem} onChange={e => setPatientForm({...patientForm, problem: e.target.value})} style={{ ...S.input, resize: 'none', background: isRecording ? 'rgba(239,68,68,0.05)' : 'var(--bg-subtle)' }} />
                </div>

                {formError && (
                  <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', fontWeight: 600 }}>
                    ⚠️ {formError}
                  </div>
                )}
                {saveSuccessMsg && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', borderRadius: '8px', padding: '0.65rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> {saveSuccessMsg}
                  </div>
                )}

                <button type="submit" className="btn-green-primary" style={{ padding: '0.65rem', marginTop: '0.2rem', width: '100%', justifyContent: 'center', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Save Patient History
                </button>
              </form>
            </div>

            {/* DATE-WISE SORTED PATIENT HISTORY LIST */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Patient History Records (Sorted Date-wise)
                </h3>
                <input type="text" placeholder="Search by name/phone..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} style={{ ...S.input, width: '160px', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '350px', overflowY: 'auto' }}>
                {sortedPatients.map(p => {
                  const vit = p.vitalsHistory?.[0] || {};
                  const triageLevel = vit.triageResult?.level || 'GREEN';
                  const pDate = p.registeredAt ? p.registeredAt.split('T')[0] : p.dateStr || '2026-08-26';
                  return (
                    <div key={p.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {p.age} yrs · {p.gender} · Phone: {p.phone || 'N/A'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                            <button 
                              onClick={() => setPatientForQRCard(p)}
                              style={{ background: 'none', border: '1px solid var(--border-dark)', borderRadius: '4px', color: 'var(--text-main)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                              title="Show QR Card"
                            >
                              <QrCode size={12} />
                            </button>
                            <span style={S.badge(triageLevel === 'RED' ? 'red' : triageLevel === 'YELLOW' ? 'amber' : 'green')}>
                              {p.bloodGroup || 'O+'} Blood Grp
                            </span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            📅 {pDate}
                          </div>
                        </div>
                      </div>

                      {/* Vitals Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '6px', margin: '0.5rem 0', textAlign: 'center', fontSize: '0.72rem' }}>
                        <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>SpO2</span><div style={{ fontWeight: 700 }}>{vit.spo2 || 98}%</div></div>
                        <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>BP</span><div style={{ fontWeight: 700 }}>{vit.bpSystolic || 120}/{vit.bpDiastolic || 80}</div></div>
                        <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Sugar</span><div style={{ fontWeight: 700 }}>{vit.sugarLevel || 95}</div></div>
                        <div><span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>Fever</span><div style={{ fontWeight: 700 }}>{vit.temperature || 98.6}°F</div></div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        "{vit.symptoms?.[0] || p.diseaseDetails || 'No complaints reported.'}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SECTION 3: MEDICINE AVAILABILITY & STOCK EDIT
           ========================================== */}
        {(activeTab === 'ALL' || activeTab === 'STOCK') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  3. Medicine Availability & Stock
                </h2>
              </div>
              <button onClick={() => setShowAddMedModal(true)} className="btn-green-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                + Add Medicine
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ASHA Medicine Kit & Local PHC Stock Status (Real-time Editable)
            </div>

            {/* Medicine Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '480px', overflowY: 'auto' }}>
              {stockList.map(item => (
                <div key={item.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category} · {item.unit}</div>
                    </div>
                    <span style={S.badge(item.status)}>{item.status.replace('_',' ')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--green-primary)' }}>
                      {item.stockCount} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.unit} in stock</span>
                    </span>

                    {/* Stock Edit Controls (+ / -) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button onClick={() => updateStockCount(item.id, -10)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-dark)', background: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 800 }}>-10</button>
                      <button onClick={() => updateStockCount(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-dark)', background: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 800 }}>-1</button>
                      <button onClick={() => updateStockCount(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--green-primary)', background: 'rgba(16,185,129,0.1)', color: 'var(--green-primary)', cursor: 'pointer', fontWeight: 800 }}>+1</button>
                      <button onClick={() => updateStockCount(item.id, 10)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--green-primary)', background: 'rgba(16,185,129,0.1)', color: 'var(--green-primary)', cursor: 'pointer', fontWeight: 800 }}>+10</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            SECTION 4: PATIENT REFERRAL TO DOCTORS
           ========================================== */}
        {(activeTab === 'ALL' || activeTab === 'REFERRALS') && (
          <div style={S.card}>
            <div style={S.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} color="var(--green-primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  4. Patient Doctor Referrals
                </h2>
              </div>
              <span style={S.badge('green')}>{referrals.length} Active Referrals</span>
            </div>

            {/* CREATE REFERRAL FORM */}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowRight size={14} /> Recommend Patient to Doctor
              </h3>

              <form onSubmit={handleCreateReferral} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <label style={S.label}>Select Patient to Refer *</label>
                  <select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} style={S.input}>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.village || 'Village'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={S.label}>Select Doctor & Hospital *</label>
                  <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} style={S.input}>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} - {d.spec} ({d.hospital})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={S.label}>Urgency Level</label>
                    <select value={referralUrgency} onChange={e => setReferralUrgency(e.target.value)} style={S.input}>
                      <option value="HIGH">CRITICAL / HIGH</option>
                      <option value="MEDIUM">MODERATE</option>
                      <option value="LOW">ROUTINE</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Referral Reason</label>
                    <input type="text" placeholder="e.g. High BP / ECG check" value={referralReason} onChange={e => setReferralReason(e.target.value)} style={S.input} />
                  </div>
                </div>

                <button type="submit" className="btn-green-primary" style={{ padding: '0.6rem', marginTop: '0.2rem', width: '100%', justifyContent: 'center' }}>
                  <Stethoscope size={15} /> Confirm & Dispatch Referral
                </button>
              </form>
            </div>

            {/* NEARBY DOCTORS & HOSPITALS LIST */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Stethoscope size={14} color="#10b981" /> Nearby Doctors Directory
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '200px', overflowY: 'auto' }}>
                {doctors.map(d => (
                  <div key={d.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{d.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.spec} · {d.hospital} ({d.distance})</div>
                      </div>
                      <span style={S.badge('green')}>{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT REFERRALS TRACKER */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Referral Pipeline Status ({referrals.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                {referrals.map(r => (
                  <div key={r.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{r.patientName}</span>
                      <span style={S.badge(r.urgency)}>{r.status}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      ➡️ To: {r.toFacility}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD SOS EMERGENCY CASE */}
      {showSosModal && (
        <div className="modal-overlay-dark" onClick={() => setShowSosModal(false)}>
          <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <AlertTriangle size={18} /> Trigger Emergency SOS Alert
              </h3>
              <button onClick={() => setShowSosModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleAddSosSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={S.label}>Patient Name *</label>
                <input type="text" required placeholder="Patient Name" value={newSosData.patientName} onChange={e => setNewSosData({...newSosData, patientName: e.target.value})} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Emergency Problem / Condition *</label>
                <textarea required placeholder="Describe critical issue (e.g. Breathing trouble, Severe Bleeding)" rows={3} value={newSosData.problem} onChange={e => setNewSosData({...newSosData, problem: e.target.value})} style={{ ...S.input, resize: 'none' }} />
              </div>
              <div>
                <label style={S.label}>Emergency Location</label>
                <input type="text" value={newSosData.location} onChange={e => setNewSosData({...newSosData, location: e.target.value})} style={S.input} />
              </div>
              <button type="submit" className="btn-green-primary" style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff', padding: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                🚨 Broadcast 108 Ambulance SOS
              </button>
            </form>
          </div>
        </div>
      )}

      {showQRScanner && (
        <QRScanner 
          onScanSuccess={handleQRScanSuccess} 
          onClose={() => setShowQRScanner(false)} 
        />
      )}

      {patientForQRCard && (
        <QRCodeDisplay 
          patient={patientForQRCard} 
          onClose={() => setPatientForQRCard(null)} 
        />
      )}

      {/* MODAL: ADD NEW MEDICINE */}
      {showAddMedModal && (
        <div className="modal-overlay-dark" onClick={() => setShowAddMedModal(false)}>
          <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <Pill size={18} /> Add Medicine to Inventory
              </h3>
              <button onClick={() => setShowAddMedModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={S.label}>Medicine Name *</label>
                <input type="text" required placeholder="e.g. Paracetamol 500mg" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} style={S.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={S.label}>Category</label>
                  <select value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} style={S.input}>
                    <option value="Medicine">Medicine</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Surgical">Surgical</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Unit</label>
                  <input type="text" placeholder="Tablets / Kits" value={newMed.unit} onChange={e => setNewMed({...newMed, unit: e.target.value})} style={S.input} />
                </div>
              </div>
              <div>
                <label style={S.label}>Initial Stock Quantity *</label>
                <input type="number" required placeholder="100" value={newMed.stockCount} onChange={e => setNewMed({...newMed, stockCount: e.target.value})} style={S.input} />
              </div>
              <button type="submit" className="btn-green-primary" style={{ padding: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                Save Medicine Stock
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
