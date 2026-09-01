import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AshaFieldApp } from './components/AshaFieldApp';
import { DoctorConsole } from './components/DoctorConsole';
import { PatientPortal } from './components/PatientPortal';
import { DistrictDashboard } from './components/DistrictDashboard';
import { PharmacyStock } from './components/PharmacyStock';
import { AiAssistant } from './components/AiAssistant';
import { SyncArchitecture } from './components/SyncArchitecture';
import {
  getStoredPatients, savePatients,
  getStoredReferrals, saveReferrals,
  getStoredInventory, saveInventory,
  getStoredRecalls, getStoredPrescriptions, savePrescriptions,
  getSyncQueue, addToSyncQueue, processSyncQueue,
  getOnlineStatus, setOnlineStatus
} from './services/storage';

import { AlertTriangle, CheckCircle2, Lock, ArrowLeft, MapPin } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'workspace'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('asha');
  const [ashaSection, setAshaSection] = useState('ALL'); // 'ALL' | 'PHARMACY' | 'PATIENTS' | 'STOCK' | 'REFERRALS'
  const [doctorSection, setDoctorSection] = useState('ALL'); // 'ALL' | 'EMERGENCY' | 'ASHA_RX' | 'BIG_HOSPITAL'
  const [patientSection, setPatientSection] = useState('ALL'); // 'ALL' | 'PROFILE' | 'HISTORY' | 'CONSULT' | 'AI'
  const [lang, setLang] = useState('en');
  const [isOnline, setIsOnline] = useState(getOnlineStatus());

  // Main Data Arrays
  const [patients, setPatients] = useState(getStoredPatients());
  const [referrals, setReferrals] = useState(getStoredReferrals());
  const [inventory, setInventory] = useState(getStoredInventory());
  const [recalls, setRecalls] = useState(getStoredRecalls());
  const [prescriptions, setPrescriptions] = useState(getStoredPrescriptions());
  const [syncQueue, setSyncQueue] = useState(getSyncQueue());

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosAlert, setSosAlert] = useState(null);

  // Live Teleconsultation Call & Doctor Chat State
  const [activeTeleconsult, setActiveTeleconsult] = useState(null);
  const [teleconsultChat, setTeleconsultChat] = useState([
    { id: 1, sender: 'doctor', patientId: 'PAT-2026-001', text: 'Hello! I am Dr. Aniket Deshmukh (MD). I have scheduled our teleconsultation call and am reviewing your vitals history.', timestamp: '10:30 AM' }
  ]);

  useEffect(() => {
    let eventSource;
    try {
      eventSource = new EventSource('/api/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.payload?.patients) {
            setPatients(data.payload.patients);
            savePatients(data.payload.patients);
          }
          if (data.payload?.referrals) {
            setReferrals(data.payload.referrals);
            saveReferrals(data.payload.referrals);
          }
          if (data.payload?.inventory) {
            setInventory(data.payload.inventory);
            saveInventory(data.payload.inventory);
          }
        } catch (err) {
          console.warn('SSE Parse error:', err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };
    } catch (e) {
      console.warn('SSE not supported or server offline');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSelectRoleFromLanding = (role) => {
    if (role === 'login') {
      setCurrentView('login');
    } else if (role === 'asha') {
      setCurrentUser({
        role: 'asha',
        id: 'ASHA-402',
        name: 'Sita More',
        email: 'asha.sita.more@gramincare.gov.in',
        village: 'Bhamburda (Khed)',
        facility: 'Sub-Center Bhamburda'
      });
      setActiveTab('asha');
      setCurrentView('workspace');
    } else if (role === 'doctor') {
      setCurrentUser({
        role: 'doctor',
        id: 'DOC-108',
        name: 'Dr. Aniket Deshmukh',
        email: 'dr.aniket.deshmukh@gramincare.gov.in',
        qualification: 'MBBS, MD',
        facility: 'PHC Khed'
      });
      setActiveTab('doctor');
      setCurrentView('workspace');
    } else if (role === 'patient') {
      setCurrentUser({
        role: 'patient',
        id: 'PAT-2026-101',
        name: 'Sunita Shinde',
        phone: '+91 98230 11204',
        abhaId: '91-4829-1029-3841',
        village: 'Bhamburda (Khed)'
      });
      setActiveTab('patient');
      setCurrentView('workspace');
    }
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    if (userObj.role === 'asha') setActiveTab('asha');
    else if (userObj.role === 'doctor') setActiveTab('doctor');
    else if (userObj.role === 'patient') setActiveTab('patient');
    setCurrentView('workspace');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const toggleOnline = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    setOnlineStatus(nextStatus);
    if (nextStatus) {
      const updatedQueue = processSyncQueue();
      setSyncQueue(updatedQueue);
    }
  };

  const handleSavePatient = async (newPatient) => {
    const updated = [newPatient, ...patients];
    setPatients(updated);
    savePatients(updated);

    try {
      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      });
    } catch (e) {
      if (!isOnline) {
        addToSyncQueue({ type: 'PATIENT_REGISTRATION', payload: newPatient });
        setSyncQueue(getSyncQueue());
      }
    }
  };

  const handleUpdatePatient = (updatedPatient) => {
    const updated = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
    setPatients(updated);
    savePatients(updated);
    setSelectedPatient(updatedPatient);
    if (currentUser?.role === 'patient') {
      setCurrentUser(prev => ({ ...prev, name: updatedPatient.name }));
    }
  };

  const handleSaveReferral = async (newReferral) => {
    const updated = [newReferral, ...referrals];
    setReferrals(updated);
    saveReferrals(updated);

    try {
      await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReferral)
      });
    } catch (e) {
      if (!isOnline) {
        addToSyncQueue({ type: 'REFERRAL_CREATED', payload: newReferral });
        setSyncQueue(getSyncQueue());
      }
    }
  };

  const handleSavePrescription = (newRx) => {
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    savePrescriptions(updated);
  };

  const handleStartTeleconsult = (pat, scheduledTime = 'Right Now') => {
    setActiveTeleconsult({
      id: `CALL-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      doctorName: 'Dr. Aniket Deshmukh (MD)',
      status: 'CALLING',
      scheduledTime: scheduledTime,
      createdAt: new Date().toISOString()
    });
  };

  const handleAcceptTeleconsult = () => {
    if (activeTeleconsult) {
      setActiveTeleconsult(prev => ({ ...prev, status: 'CONNECTED' }));
    }
  };

  const handleEndTeleconsult = () => {
    setActiveTeleconsult(null);
  };

  const handleSendChatMessage = (msgText, sender = 'doctor', patientId) => {
    const newMsg = {
      id: Date.now(),
      sender: sender,
      patientId: patientId || activeTeleconsult?.patientId || 'PAT-2026-001',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTeleconsultChat(prev => [...prev, newMsg]);
  };

  const handleUpdateInventory = async (newInventory) => {
    setInventory(newInventory);
    saveInventory(newInventory);

    try {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventory)
      });
    } catch (e) {
      console.warn('Inventory sync error:', e);
    }
  };

  const handleForceSync = () => {
    setSyncQueue(getSyncQueue());
  };

  const handleTriggerSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          let locationName = "Fetching area...";
          
          setSosAlert({ lat, lng, time: new Date().toLocaleTimeString(), locationName });
          setShowSosModal(true);

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Area";
            const state = data.address.state || "";
            setSosAlert(prev => ({ ...prev, locationName: `${city}, ${state}` }));
          } catch (e) {
            setSosAlert(prev => ({ ...prev, locationName: "Location Name Unavailable" }));
          }
        },
        (error) => {
          // Fallback if permission denied or error
          setSosAlert({ lat: '18.8521', lng: '73.9102', time: new Date().toLocaleTimeString(), locationName: "Bhamburda, Khed (Fallback)" });
          setShowSosModal(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setSosAlert({ lat: '18.8521', lng: '73.9102', time: new Date().toLocaleTimeString(), locationName: "Bhamburda, Khed (Fallback)" });
      setShowSosModal(true);
    }
  };

  const pendingSyncCount = syncQueue.filter(i => i.status === 'PENDING').length;

  // 1. Landing Page View (Default)
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onSelectRole={handleSelectRoleFromLanding}
          onTriggerSOS={handleTriggerSOS}
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {showSosModal && (
          <div className="modal-overlay-dark" onClick={() => setShowSosModal(false)}>
            <div className="modal-content-dark" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--green-primary)'
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    EMERGENCY SOS ALERT DISPATCHED
                  </h3>
                  <span className="green-badge" style={{ marginTop: '0.25rem' }}>
                    108 Ambulance GPS Beacon Active
                  </span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-dark-subtle)',
                border: '1px solid var(--border-dark)',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-white-muted)'
              }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  <MapPin size={15} color="var(--green-primary)" /> GPS Location: Lat {sosAlert?.lat || '18.8521'}° N, Long {sosAlert?.lng || '73.9102'}° E ({sosAlert?.locationName || 'Bhamburda, Khed'})
                </p>
                <p>
                  Emergency broadcast sent to PHC Khed Emergency Care & 108 Ambulance Dispatcher via Cellular/SMS & LoRa mesh fallback.
                </p>
              </div>

              <button
                className="btn-green-primary"
                onClick={() => setShowSosModal(false)}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <CheckCircle2 size={16} />
                <span>Acknowledge & Return to Landing Page</span>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. Login View
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Authenticated Role Workspace
  const isAuthorized = (tab) => {
    const role = currentUser?.role;
    if (role === 'doctor') {
      return ['doctor'].includes(tab);
    } else if (role === 'asha') {
      return ['asha'].includes(tab);
    } else if (role === 'patient') {
      return ['patient', 'ai'].includes(tab);
    }
    return false;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
        toggleOnline={toggleOnline}
        pendingSyncCount={pendingSyncCount}
        onTriggerSOS={handleTriggerSOS}
        currentUser={currentUser}
        onLogout={handleLogout}
        ashaSection={ashaSection}
        setAshaSection={setAshaSection}
        doctorSection={doctorSection}
        setDoctorSection={setDoctorSection}
        patientSection={patientSection}
        setPatientSection={setPatientSection}
        selectedPatient={selectedPatient}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main style={{ flex: 1, background: 'var(--bg-main)' }}>
        {!isAuthorized(activeTab) ? (
          <div className="dark-card" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--green-primary)',
              margin: '0 auto 1rem auto'
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Role Unauthorized</h3>
            <p style={{ color: 'var(--text-white-muted)', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem 0' }}>
              Your account ({currentUser.role.toUpperCase()}) cannot view this view.
            </p>
            <button
              className="btn-green-primary"
              onClick={() => setActiveTab(currentUser.role === 'asha' ? 'asha' : currentUser.role === 'doctor' ? 'doctor' : 'patient')}
            >
              <ArrowLeft size={14} />
              <span>Return to Dashboard</span>
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'asha' && (
              <AshaFieldApp
                patients={patients}
                referrals={referrals}
                inventory={inventory}
                recalls={recalls}
                onSavePatient={handleSavePatient}
                onSaveReferral={handleSaveReferral}
                onUpdateInventory={handleUpdateInventory}
                ashaSection={ashaSection}
                setAshaSection={setAshaSection}
                onSelectPatient={(p) => {
                  if (currentUser.role === 'doctor') {
                    setSelectedPatient(p);
                    setActiveTab('doctor');
                  }
                }}
                onTriggerSOS={handleTriggerSOS}
              />
            )}

            {activeTab === 'doctor' && (
              <DoctorConsole 
                patients={patients}
                referrals={referrals}
                onSaveReferral={handleSaveReferral}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
                sosAlert={sosAlert}
                prescriptions={prescriptions}
                onSavePrescription={handleSavePrescription}
                doctorSection={doctorSection}
                setDoctorSection={setDoctorSection}
                activeTeleconsult={activeTeleconsult}
                onStartTeleconsult={handleStartTeleconsult}
                onAcceptTeleconsult={handleAcceptTeleconsult}
                onEndTeleconsult={handleEndTeleconsult}
                teleconsultChat={teleconsultChat}
                onSendChatMessage={handleSendChatMessage}
              />
            )}

            {activeTab === 'patient' && (
              <PatientPortal
                patients={patients}
                referrals={referrals}
                prescriptions={prescriptions}
                currentUser={currentUser}
                onTriggerSOS={handleTriggerSOS}
                onNavigateTab={setActiveTab}
                lang={lang}
                patientSection={patientSection}
                setPatientSection={setPatientSection}
                onUpdatePatient={handleUpdatePatient}
                activeTeleconsult={activeTeleconsult}
                onStartTeleconsult={handleStartTeleconsult}
                onAcceptTeleconsult={handleAcceptTeleconsult}
                onEndTeleconsult={handleEndTeleconsult}
                teleconsultChat={teleconsultChat}
                onSendChatMessage={handleSendChatMessage}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
              />
            )}

            {activeTab === 'dashboard' && (
              <DistrictDashboard
                patients={patients}
                referrals={referrals}
                inventory={inventory}
              />
            )}

            {activeTab === 'pharmacy' && (
              <PharmacyStock
                inventory={inventory}
                onUpdateInventory={handleUpdateInventory}
              />
            )}

            {activeTab === 'ai' && (
              <div className="app-container-max">
                <AiAssistant 
                  lang={lang} 
                  onTriggerSOS={handleTriggerSOS} 
                  onNavigateTab={setActiveTab} 
                />
              </div>
            )}

            {activeTab === 'sync' && (
              <SyncArchitecture
                isOnline={isOnline}
                onForceSync={handleForceSync}
              />
            )}
          </>
        )}
      </main>

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="modal-overlay-dark" onClick={() => setShowSosModal(false)}>
          <div className="modal-content-dark" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green-primary)'
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  EMERGENCY SOS ALERT DISPATCHED
                </h3>
                <span className="green-badge" style={{ marginTop: '0.25rem' }}>
                  108 Ambulance GPS Beacon Active
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-dark-subtle)',
              border: '1px solid var(--border-dark)',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-white-muted)'
            }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                <MapPin size={15} color="var(--green-primary)" /> GPS Location: Lat 18.8521° N, Long 73.9102° E (Bhamburda, Khed)
              </p>
              <p>
                Emergency broadcast sent to PHC Khed Emergency Care & 108 Ambulance Dispatcher via Cellular/SMS & LoRa mesh fallback.
              </p>
            </div>

            <button
              className="btn-green-primary"
              onClick={() => setShowSosModal(false)}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Acknowledge & Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
