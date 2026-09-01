import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Server, 
  Cloud 
} from 'lucide-react';
import { getSyncQueue, processSyncQueue } from '../services/storage';

export function SyncArchitecture({ isOnline, onForceSync }) {
  const [syncQueue, setSyncQueue] = useState(getSyncQueue());

  const handleManualSync = () => {
    const updated = processSyncQueue();
    setSyncQueue(updated);
    onForceSync();
  };

  const pendingCount = syncQueue.filter(i => i.status === 'PENDING').length;

  return (
    <div className="app-container-max" style={{ paddingBottom: '2.5rem' }}>
      {/* Top Banner */}
      <div className="min-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mesh Offline Sync Engine</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Local-first IndexedDB storage &bull; CRDT replication &bull; ABDM Interoperability
            </p>
          </div>

          <button onClick={handleManualSync} className="btn-min-primary">
            <RefreshCw size={14} />
            <span>Flush Queue</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.25rem' }}>
        {/* Left: Queue */}
        <div className="min-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Storage Sync Queue</h3>
            {pendingCount > 0 ? (
              <span className="glass-badge glass-badge-amber">{pendingCount} Pending</span>
            ) : (
              <span className="glass-badge glass-badge-emerald">Synced</span>
            )}
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            <div>Mode: <strong>{isOnline ? 'Online (4G/Wi-Fi)' : 'Offline Local'}</strong></div>
            <div>Status: <strong>{isOnline ? 'Active Sync' : 'Buffering'}</strong></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '380px', overflowY: 'auto' }}>
            {syncQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sync queue is clear.</p>
                <span style={{ fontSize: '0.75rem' }}>All local records saved to PHC Server.</span>
              </div>
            ) : (
              syncQueue.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: item.status === 'PENDING' ? 'var(--accent-amber-bg)' : 'var(--accent-emerald-bg)',
                    border: `1px solid ${item.status === 'PENDING' ? 'var(--accent-amber-border)' : 'var(--accent-emerald-border)'}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Record ID: {item.id || `REC-${idx + 1}`}</span>
                    <span>{item.status}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Type: {item.type || 'PATIENT_SCREENING'} &bull; {new Date(item.timestamp || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Topology */}
        <div className="min-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Network Nodes</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cpu size={20} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>ASHA Mobile Edge Node</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offline speech triage & vitals buffer</div>
              </div>
              <span className="glass-badge glass-badge-emerald">Local</span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Server size={20} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Sub-Center Microserver</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Wi-Fi Mesh Relay</div>
              </div>
              <span className="glass-badge glass-badge-blue">Relay</span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cloud size={20} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>PHC Central Cloud & ABDM</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FHIR R4 Gateway</div>
              </div>
              <span className="glass-badge glass-badge-emerald">Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
