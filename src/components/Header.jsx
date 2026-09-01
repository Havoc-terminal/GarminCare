import React from 'react';
import { 
  Stethoscope, 
  UserCheck, 
  Users, 
  BarChart3, 
  Pill, 
  Bot, 
  RefreshCw, 
  AlertTriangle, 
  Globe,
  LogOut,
  ShieldCheck,
  Activity,
  Building2,
  Moon,
  Sun
} from 'lucide-react';
import { GRAMINCARE_LOGO_BASE64 } from '../data/logoBase64';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  lang, 
  setLang, 
  isOnline, 
  toggleOnline, 
  pendingSyncCount,
  onTriggerSOS,
  currentUser,
  onLogout,
  ashaSection = 'ALL',
  setAshaSection,
  doctorSection = 'ALL',
  setDoctorSection,
  patientSection = 'ALL',
  setPatientSection,
  selectedPatient,
  theme,
  toggleTheme
}) {
  const getNavTabs = (role) => {
    if (role === 'doctor') return [
      { id: 'ALL', label: 'All 3 Sections', icon: Activity, isDoctorSec: true },
      { id: 'EMERGENCY', label: '1. Emergency & Big Hospital', icon: AlertTriangle, isDoctorSec: true },
      { id: 'ASHA_RX', label: '2. ASHA Referrals & Mobile Rx', icon: UserCheck, isDoctorSec: true },
      { id: 'BIG_HOSPITAL', label: '3. Refer to Big Hospital', icon: Building2, isDoctorSec: true },
    ];
    if (role === 'asha') return [
      { id: 'ALL', label: 'All 4 Sections', icon: Activity, isAshaSec: true },
      { id: 'PHARMACY', label: '1. Local Pharmacies & SOS', icon: Building2, isAshaSec: true },
      { id: 'PATIENTS', label: '2. Patient Entry & History', icon: UserCheck, isAshaSec: true },
      { id: 'STOCK', label: '3. Medicine Stock', icon: Pill, isAshaSec: true },
      { id: 'REFERRALS', label: '4. Doctor Referrals', icon: Stethoscope, isAshaSec: true },
    ];
    if (role === 'patient') return [
      { id: 'ALL', label: 'All 4 Sections', icon: Activity, isPatientSec: true },
      { id: 'PROFILE', label: '1. Profile & Emergency Contacts', icon: Users, isPatientSec: true },
      { id: 'HISTORY', label: '2. Prescriptions & History', icon: Pill, isPatientSec: true },
      { id: 'CONSULT', label: '3. Video Consult & Doctor Chat', icon: Stethoscope, isPatientSec: true },
      { id: 'AI', label: '4. AI Health Assistant', icon: Bot, isPatientSec: true },
    ];
    return [];
  };

  const navTabs = getNavTabs(currentUser?.role);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: theme === 'dark' ? 'rgba(9, 9, 11, 0.75)' : 'rgba(255, 255, 255, 0.75)',
      borderBottom: '1px solid var(--border-dark)',
      backdropFilter: 'blur(16px)',
      padding: '0 2rem'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0'
      }}>
        {/* Top Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.7rem 0',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={GRAMINCARE_LOGO_BASE64} alt="GraminCare" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              GRAMIN<span style={{ color: 'var(--green-primary)' }}>CARE</span>
            </span>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* User Identity */}
            {currentUser && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-dark)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem'
              }}>
                <ShieldCheck size={13} color="var(--green-primary)" />
                <span style={{ fontWeight: 700 }}>
                  {currentUser.role === 'patient' ? (selectedPatient?.name || currentUser.name) : currentUser.name}
                </span>
                <span style={{ color: 'var(--text-white-muted)' }}>·</span>
                <span style={{ color: 'var(--text-white-muted)' }}>{currentUser.role.toUpperCase()}</span>
                <button onClick={onLogout} title="Logout" style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-white-muted)', display: 'flex', alignItems: 'center',
                  padding: 0, marginLeft: '0.2rem'
                }}>
                  <LogOut size={12} />
                </button>
              </div>
            )}

            {/* Online status */}
            <button onClick={toggleOnline} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)',
              borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.85rem',
              color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              transition: 'var(--transition)'
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: isOnline ? 'var(--green-primary)' : '#f59e0b'
              }} />
              <span>{isOnline ? 'Online' : `Offline (${pendingSyncCount})`}</span>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-dark)',
              borderRadius: '50%', width: '32px', height: '32px',
              color: 'var(--text-main)', cursor: 'pointer', transition: 'var(--transition)'
            }}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* SOS */}
            <button onClick={onTriggerSOS} className="btn-green-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
              <AlertTriangle size={13} />
              <span>SOS 108</span>
            </button>
          </div>
        </div>

        {/* Nav Tabs Row */}
        {navTabs.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderTop: '1px solid var(--border-dark)',
            overflowX: 'auto',
            paddingTop: '0.5rem',
            paddingBottom: '0.2rem'
          }}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.isAshaSec 
                ? (activeTab === 'asha' && ashaSection === tab.id)
                : tab.isDoctorSec
                ? (activeTab === 'doctor' && doctorSection === tab.id)
                : tab.isPatientSec
                ? (activeTab === 'patient' && patientSection === tab.id) 
                : (activeTab === tab.id);

              const handleTabClick = () => {
                if (tab.isAshaSec) {
                  setActiveTab('asha');
                  if (setAshaSection) setAshaSection(tab.id);
                } else if (tab.isDoctorSec) {
                  setActiveTab('doctor');
                  if (setDoctorSection) setDoctorSection(tab.id);
                } else if (tab.isPatientSec) {
                  setActiveTab('patient');
                  if (setPatientSection) setPatientSection(tab.id);
                } else {
                  setActiveTab(tab.id);
                }
              };

              return (
                <button
                  key={tab.id}
                  onClick={handleTabClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.1rem',
                    background: isActive ? 'var(--green-subtle-bg)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isActive ? 'var(--green-primary)' : 'var(--text-white-muted)',
                    cursor: 'pointer',
                    fontSize: '0.83rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'var(--transition)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-main)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-white-muted)';
                  }}
                >
                  {Icon && <Icon size={14} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
