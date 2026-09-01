import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  Stethoscope, 
  Users, 
  Pill, 
  Bot, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  Activity,
  HeartPulse,
  Building2,
  MapPin,
  CheckCircle2,
  Lock,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { GRAMINCARE_LOGO_BASE64 } from '../data/logoBase64';

export function LandingPage({ onSelectRole, onTriggerSOS, lang, setLang, theme, toggleTheme }) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const languages = [
    { code: 'en', label: 'English (EN)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' }
  ];

  const portalCards = [
    {
      id: 'pregnancy_helpline',
      tag: 'Maternal & Women Health',
      title: 'Pregnancy Helpline India',
      url: 'https://www.pregnancyhelpline.in',
      desc: 'Pregnancy Helpline offers women in India counselling regarding their (unplanned) pregnancy. We are here to help from 8 a.m. to midnight.',
      stats: '8 AM - Midnight Helpline',
      color: '#10b981'
    },
    {
      id: 'icall_helpline',
      tag: 'Mental Health & Helpline',
      title: 'iCALL | Free Telephone & Email Counseling',
      url: 'https://icallhelpline.org',
      desc: 'iCALL is a psychological helpline that aims to provide high quality telephone counselling and internet based support services to improve mental health.',
      stats: 'Free Telephone & Email',
      color: '#10b981'
    },
    {
      id: 'abha_abdm',
      tag: 'Digital Health Identity',
      title: 'ABHA | ABDM (Ayushman Bharat Digital Mission)',
      url: 'https://abha.abdm.gov.in',
      desc: 'ABHA number is a 14 digit number that uniquely identifies you as a participant in India\'s digital healthcare ecosystem and establishes unified digital health records.',
      stats: 'Govt of India ABDM',
      color: '#10b981'
    },
    {
      id: 'who_child_health',
      tag: 'Pediatric & Child Care',
      title: 'World Health Organization (WHO) - Child Health',
      url: 'https://www.who.int/health-topics/child-health',
      desc: 'WHO global guidelines on leading causes of death among children including respiratory infections, diarrhoeal diseases, measles, malaria, and malnutrition.',
      stats: 'WHO Global Standard',
      color: '#10b981'
    }
  ];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % portalCards.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + portalCards.length) % portalCards.length);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <nav className="nav-bar" style={{ width: '100%', padding: '1rem 0', background: theme === 'dark' ? 'rgba(9, 9, 11, 0.75)' : 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-dark)' }}>
        <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Logo (Left Aligned) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img 
              src={GRAMINCARE_LOGO_BASE64} 
              alt="GraminCare Logo" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
            />
            <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              GRAMIN<span style={{ color: 'var(--green-primary)' }}>CARE</span>
            </div>
          </div>

          {/* Right Navigation Controls (Shifted Right) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', position: 'relative', marginLeft: 'auto' }}>
            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="btn-white-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Globe size={15} color="var(--green-primary)" />
                <span>{languages.find(l => l.code === lang)?.label.split(' ')[0] || 'EN'}</span>
              </button>

              {showLangDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  minWidth: '150px'
                }}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangDropdown(false);
                      }}
                      style={{
                        background: lang === l.code ? 'var(--green-subtle-bg)' : 'transparent',
                        color: lang === l.code ? 'var(--green-primary)' : 'var(--text-main)',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="btn-white-outline"
              style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} color="var(--green-primary)" /> : <Moon size={17} color="var(--green-primary)" />}
            </button>

            {/* About Us Button (Added to the right of English button) */}
            <button 
              onClick={() => setShowAboutModal(true)}
              className="btn-white-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem', fontWeight: 600 }}
            >
              <Info size={15} color="var(--green-primary)" />
              <span>About Us</span>
            </button>

            {/* I Need Help / SOS Button */}
            <button 
              onClick={onTriggerSOS}
              className="btn-green-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', background: '#ef4444', borderColor: '#ef4444' }}
            >
              <AlertTriangle size={15} />
              <span>I Need Help !</span>
            </button>

            {/* Staff / Portal Login (Enlarged & Prominent on the Right) */}
            <button 
              onClick={() => onSelectRole('login')}
              className="btn-green-primary"
              style={{ 
                padding: '0.65rem 1.6rem', 
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
                gap: '0.5rem'
              }}
            >
              <Lock size={16} />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-container">
        {/* Bold 24x7 Ambulance Helpline Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '0.6rem' }}>
          <span className="green-badge" style={{ 
            background: 'rgba(239, 68, 68, 0.12)', 
            color: '#ef4444', 
            border: '1px solid rgba(239, 68, 68, 0.4)',
            fontSize: '0.92rem',
            fontWeight: 800,
            padding: '0.45rem 1.25rem',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.18)'
          }}>
            <Phone size={15} />
            <span>24x7 Emergency Ambulance Helpline: <strong>108</strong> / <strong>102</strong></span>
          </span>
        </div>

        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <span className="green-badge">
            <Activity size={13} />
            Govt of Maharashtra Frontline Telehealth Grid
          </span>
        </div>

        <h1 className="hero-title">
          Smart Rural Healthcare <br />
          <span className="text-green">GRAMINCARE</span>
        </h1>

        <p className="hero-subtitle">
          Bridging Distance, Delivering Care. Connecting Frontline ASHA Workers, PHC Doctors, and Rural Citizens with AI-powered triage and zero-connectivity mesh resilience.
        </p>

        {/* Big Center Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={onTriggerSOS}
              className="btn-green-primary"
              style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
            >
              <AlertTriangle size={18} />
              <span>Add SOS Request</span>
            </button>
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-white-muted)' }}>
            Notify Nearby PHCs &bull; 108 Emergency Ambulance GPS
          </span>
        </div>
      </section>

      {/* Frontline Portals & Partner Facilities Section (Carousel / Grid) */}
      <section style={{ padding: '2rem 1.5rem 5rem 1.5rem', maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            National Health & Medical Support <span className="text-green">Resources</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-white-muted)', marginTop: '0.3rem' }}>
            Click on any resource card to access official government & healthcare helpline portals
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="btn-white-outline"
            style={{
              position: 'absolute',
              left: '-20px',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              padding: 0
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            padding: '0 1.5rem'
          }}>
            {portalCards.map((card) => (
              <a 
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dark-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '250px', textDecoration: 'none' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="green-badge">{card.tag}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-white-muted)' }}>{card.stats}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {card.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-white-muted)', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
                  <span>Visit Official Portal</span>
                  <ArrowRight size={15} />
                </div>
              </a>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="btn-white-outline"
            style={{
              position: 'absolute',
              right: '-20px',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              padding: 0
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-dark)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-white-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1320px', margin: '0 auto', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            GraminCare &bull; National Health Mission &bull; Govt of Maharashtra
          </div>
          <div>
            Strict Palette: Pure Black, Pure White, Emerald Green
          </div>
        </div>
      </footer>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="modal-overlay-dark" onClick={() => setShowAboutModal(false)}>
          <div 
            className="modal-content-dark" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '92%', padding: '2rem', borderRadius: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={22} color="var(--green-primary)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>About GraminCare</h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <p>
                <strong>GraminCare</strong> is a <strong>Smart Rural Healthcare Mesh Platform</strong> engineered to solve healthcare delivery challenges across rural villages and primary health centers in India.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '0.5rem 0' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Stethoscope size={16} /> ASHA Field Worker App
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Empowers frontline ASHA workers with offline-first vitals screening, ANC maternal risk calculation, and Marathi voice symptom intake.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={16} /> PHC Doctor Console
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Connects PHC doctors with patients via live video calls, interactive chat, queue triage, and digital E-Prescriptions.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <UserCheck size={16} /> Citizen Health Passport
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Integrates with ABHA (Ayushman Bharat Digital Mission) for digital health records, video bookings, and AI symptom assistant.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> 108 Emergency Mesh
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    One-click SOS emergency dispatch notifying nearby PHC ambulances and medical officers with real-time GPS coordinates.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                Aligned with National Health Mission (NHM) Standards & Govt of Maharashtra Digital Health Architecture.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="btn-green-primary"
                style={{ padding: '0.5rem 1.4rem', fontSize: '0.85rem' }}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
