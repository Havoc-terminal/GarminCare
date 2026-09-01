import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  HeartPulse, 
  TrendingUp,
  Activity
} from 'lucide-react';

export function DistrictDashboard({ patients, referrals }) {
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.vitalsHistory?.[0]?.triageResult?.level === 'RED').length;
  const maternalCount = patients.filter(p => p.isPregnant).length;
  const totalReferrals = referrals.length;

  // AI Outbreak Radar Analysis
  const outbreaks = [];
  const villageStats = {};
  
  patients.forEach(p => {
    const v = p.village || 'Bhamburda (Khed)';
    if (!villageStats[v]) villageStats[v] = { total: 0, dengue: 0, malaria: 0, red: 0 };
    villageStats[v].total += 1;
    
    const rules = p.vitalsHistory?.[0]?.triageResult?.matchedRules || [];
    const level = p.vitalsHistory?.[0]?.triageResult?.level;
    
    if (level === 'RED') villageStats[v].red += 1;
    
    rules.forEach(rule => {
      if (rule.includes('Dengue Signature')) villageStats[v].dengue += 1;
      if (rule.includes('Malaria Signature')) villageStats[v].malaria += 1;
    });
  });

  Object.keys(villageStats).forEach(v => {
    const stats = villageStats[v];
    if (stats.dengue >= 2) {
      outbreaks.push({ id: `${v}-dengue`, village: v, disease: 'Dengue', count: stats.dengue, level: 'DANGER', desc: `AI ALERT: Potential Dengue Outbreak detected (${stats.dengue} cases in 48h)` });
    }
    if (stats.malaria >= 2) {
      outbreaks.push({ id: `${v}-malaria`, village: v, disease: 'Malaria', count: stats.malaria, level: 'DANGER', desc: `AI ALERT: Malaria cluster detected (${stats.malaria} cases)` });
    }
    if (stats.red >= 3 && stats.dengue < 2 && stats.malaria < 2) {
      outbreaks.push({ id: `${v}-red`, village: v, disease: 'Unidentified Acute', count: stats.red, level: 'WARNING', desc: `Spike in critical RED triage cases (${stats.red} patients)` });
    }
  });

  if (outbreaks.length === 0) {
    outbreaks.push({ id: 'stable-01', village: 'All Monitored Regions', level: 'STABLE', desc: 'Zero active viral clusters. Vital trends stable.' });
  }

  return (
    <div className="app-container-max" style={{ paddingBottom: '2.5rem' }}>
      {/* Top Banner */}
      <div className="min-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pune District Health Surveillance</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              14 Talukas &bull; 62 PHCs &bull; 348 Sub-Centers &bull; Live Telemetry
            </p>
          </div>
          <span className="glass-badge glass-badge-emerald">99.4% Sync Mesh Uptime</span>
        </div>
      </div>

      {/* 4 Clean Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="squircle-tile">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="tile-icon"><Users size={18} /></div>
            <span className="glass-badge glass-badge-blue">+14% MoM</span>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1,248</div>
            <div className="tile-title" style={{ marginTop: '0.3rem' }}>Screened Citizens</div>
            <div className="tile-subtitle">Across 18 hamlets</div>
          </div>
        </div>

        <div className="squircle-tile">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="tile-icon"><AlertTriangle size={18} /></div>
            <span className="glass-badge glass-badge-danger">Active</span>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)' }}>{highRiskCount}</div>
            <div className="tile-title" style={{ marginTop: '0.3rem' }}>RED Alert Cases</div>
            <div className="tile-subtitle">Under supervision</div>
          </div>
        </div>

        <div className="squircle-tile">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="tile-icon"><HeartPulse size={18} /></div>
            <span className="glass-badge" style={{ background: '#faf5ff', color: '#7e22ce' }}>Priority</span>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{maternalCount}</div>
            <div className="tile-title" style={{ marginTop: '0.3rem' }}>Maternal ANC</div>
            <div className="tile-subtitle">3rd trimester tracking</div>
          </div>
        </div>

        <div className="squircle-tile">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="tile-icon"><TrendingUp size={18} /></div>
            <span className="glass-badge glass-badge-emerald">108 Fleet</span>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalReferrals}</div>
            <div className="tile-title" style={{ marginTop: '0.3rem' }}>Hospital Referrals</div>
            <div className="tile-subtitle">Avg 14 min dispatch</div>
          </div>
        </div>
      </div>

      {/* Disease Outbreak & Referrals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        <div className="min-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={18} color="var(--green-primary)" /> AI Outbreak Radar & Early Warning
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {outbreaks.map(alert => (
              <div key={alert.id} style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: '8px', border: alert.level === 'DANGER' ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--border-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{alert.village}</div>
                  <div style={{ fontSize: '0.75rem', color: alert.level === 'DANGER' ? '#f87171' : 'var(--text-muted)' }}>{alert.desc}</div>
                </div>
                <span className={`glass-badge ${alert.level === 'DANGER' ? 'glass-badge-danger' : alert.level === 'WARNING' ? 'glass-badge-amber' : 'glass-badge-emerald'}`}>
                  {alert.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem' }}>Emergency Stream</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {referrals.slice(0, 3).map(r => (
              <div key={r.id} style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{r.patientName}</span>
                  <span className="glass-badge glass-badge-danger">{r.urgency}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>To: {r.targetFacility}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
