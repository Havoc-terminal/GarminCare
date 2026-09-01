import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';

export function PharmacyStock({ inventory, onUpdateInventory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [restockAmount, setRestockAmount] = useState(50);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === 'LOW') return item.stock <= item.reorderLevel;
    if (selectedCategory === 'CRITICAL') return item.stock <= 15;
    return true;
  });

  const lowStockCount = inventory.filter(item => item.stock <= item.reorderLevel).length;

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!selectedMed) return;

    const updated = inventory.map(item => {
      if (item.id === selectedMed.id) {
        return { ...item, stock: item.stock + Number(restockAmount) };
      }
      return item;
    });

    onUpdateInventory(updated);
    setShowRestockModal(false);
    setSelectedMed(null);
  };

  return (
    <div className="app-container-max" style={{ paddingBottom: '2.5rem' }}>
      {/* Top Banner */}
      <div className="min-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Sub-Center Pharmacy Stock</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Bhamburda (Khed) &bull; Govt Essential Drug List (EDL)
            </p>
          </div>
          {lowStockCount > 0 && (
            <span className="glass-badge glass-badge-amber">{lowStockCount} Below Buffer Level</span>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="min-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="glass-search-pill">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search drug name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="glass-segmented-control" style={{ maxWidth: 'fit-content' }}>
            <button onClick={() => setSelectedCategory('ALL')} className={`glass-segmented-item ${selectedCategory === 'ALL' ? 'active' : ''}`}>
              All ({inventory.length})
            </button>
            <button onClick={() => setSelectedCategory('LOW')} className={`glass-segmented-item ${selectedCategory === 'LOW' ? 'active' : ''}`}>
              Low Stock ({lowStockCount})
            </button>
            <button onClick={() => setSelectedCategory('CRITICAL')} className={`glass-segmented-item ${selectedCategory === 'CRITICAL' ? 'active' : ''}`}>
              Critical
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {filteredInventory.map((item) => {
          const isLow = item.stock <= item.reorderLevel;
          const isCritical = item.stock <= 15;

          return (
            <div
              key={item.id}
              className="min-card min-card-interactive"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isCritical ? 'var(--accent-red-border)' : isLow ? 'var(--accent-amber-border)' : 'var(--border-default)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{item.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category}</span>
                  </div>

                  {isCritical ? (
                    <span className="glass-badge glass-badge-danger">CRITICAL</span>
                  ) : isLow ? (
                    <span className="glass-badge glass-badge-amber">LOW</span>
                  ) : (
                    <span className="glass-badge glass-badge-emerald">OK</span>
                  )}
                </div>

                <div style={{
                  background: 'var(--bg-subtle)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '0.6rem 0'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Stock</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isCritical ? 'var(--accent-red)' : 'inherit' }}>
                      {item.stock} {item.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Reorder At</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.reorderLevel} {item.unit}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMed(item);
                  setShowRestockModal(true);
                }}
                className="btn-min-secondary"
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} />
                <span>Restock</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedMed && (
        <div className="glass-modal-overlay" onClick={() => setShowRestockModal(false)}>
          <div className="glass-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Restock: {selectedMed.name}</h2>
              <button onClick={() => setShowRestockModal(false)} className="btn-min-icon" style={{ width: '28px', height: '28px' }}>✕</button>
            </div>

            <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Quantity ({selectedMed.unit})</label>
                <input type="number" className="glass-input-field" value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} min="1" required />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowRestockModal(false)} className="btn-min-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-min-primary" style={{ flex: 1.5 }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
