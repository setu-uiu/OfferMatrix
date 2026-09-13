import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import { useOfferMatrix, useUpdateOfferMatrix, useToggleOfferMatrix } from '../hooks/useApi.js'
import './OfferMatrix.css'

const SECTOR_META = {
  FOOD:     { label: 'Food Delivery',  color: '#f59e0b', dim: 'rgba(245,158,11,.08)', providers: ['Foodie','Pathao','Foodpanda'] },
  RIDE:     { label: 'Ride Sharing',   color: '#38bdf8', dim: 'rgba(56,189,248,.08)', providers: ['Uber','Obhai','InDriver'] },
  SKINCARE: { label: 'Skincare & Beauty', color: '#ec4899', dim: 'rgba(236,72,153,.08)', providers: ['Choice Legacy','Kirei','Makeup Chari'] },
}

const PROVIDER_ICONS = {
  Foodie: 'FD', Pathao: 'PT', Foodpanda: 'FP',
  Uber: 'UB', Obhai: 'OB', InDriver: 'IN',
  'Choice Legacy': 'CL', Kirei: 'KR', 'Makeup Chari': 'MC',
}

// Fallback mock data (when API is unreachable)
const MOCK_SETTINGS = [
  { id:'m1', sector:'FOOD',     providerName:'Foodie',         discountPercentage:15, validityDays:7,  isActive:true },
  { id:'m2', sector:'FOOD',     providerName:'Pathao',         discountPercentage:12, validityDays:3,  isActive:true },
  { id:'m3', sector:'FOOD',     providerName:'Foodpanda',      discountPercentage:20, validityDays:14, isActive:true },
  { id:'m4', sector:'RIDE',     providerName:'Uber',           discountPercentage:10, validityDays:5,  isActive:true },
  { id:'m5', sector:'RIDE',     providerName:'Obhai',          discountPercentage:18, validityDays:7,  isActive:true },
  { id:'m6', sector:'RIDE',     providerName:'InDriver',       discountPercentage:22, validityDays:3,  isActive:false },
  { id:'m7', sector:'SKINCARE', providerName:'Choice Legacy',  discountPercentage:25, validityDays:30, isActive:true },
  { id:'m8', sector:'SKINCARE', providerName:'Kirei',          discountPercentage:30, validityDays:14, isActive:true },
  { id:'m9', sector:'SKINCARE', providerName:'Makeup Chari',   discountPercentage:20, validityDays:21, isActive:true },
]

export default function OfferMatrix() {
  const { data, isLoading, isError } = useOfferMatrix()
  const updateMutation   = useUpdateOfferMatrix()
  const toggleMutation   = useToggleOfferMatrix()

  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({ discountPercentage: 0, validityDays: 0 })

  // Use live data or fallback to mock
  const settings = data?.settings ?? MOCK_SETTINGS
  const isOffline = isError

  // Group by sector
  const grouped = { FOOD: [], RIDE: [], SKINCARE: [] }
  for (const s of settings) {
    if (grouped[s.sector]) grouped[s.sector].push(s)
  }

  function openEdit(item) {
    setEditItem(item)
    setEditForm({ discountPercentage: item.discountPercentage, validityDays: item.validityDays })
  }

  async function saveEdit() {
    if (!editItem) return
    if (isOffline) {
      showToast('API offline — changes not persisted', 'amber')
      setEditItem(null)
      return
    }
    try {
      const res = await updateMutation.mutateAsync({ id: editItem.id, ...editForm })
      showToast(res.message || `${editItem.providerName} updated and synchronized!`, 'green')
      setEditItem(null)
    } catch {
      showToast('Failed to save changes', 'red')
    }
  }

  async function handleToggle(item) {
    if (isOffline) { showToast('API offline', 'amber'); return }
    try {
      const res = await toggleMutation.mutateAsync(item.id)
      showToast(res.message || `${item.providerName} toggled`, 'green')
    } catch {
      showToast('Failed to toggle', 'red')
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="om-header">
        <div>
          <h1 className="om-title">Offer & Discount Matrix</h1>
          <p className="om-sub">Configure discounts and validity periods across all partner platforms. Changes synchronize instantly.</p>
        </div>
        {isOffline && (
          <span className="status-pill pill-yellow">API Offline — Showing Mock Data</span>
        )}
        {!isOffline && !isLoading && (
          <span className="status-pill pill-green">Live — {settings.filter(s => s.isActive).length} Active Offers</span>
        )}
      </div>

      {/* SECTOR GRIDS */}
      {isLoading ? (
        <div style={{ color: 'var(--text2)', padding: '2rem', textAlign: 'center' }}>Loading offer matrix...</div>
      ) : (
        Object.entries(SECTOR_META).map(([sectorKey, meta]) => (
          <div key={sectorKey} className="om-sector-card card">
            {/* Sector Header */}
            <div className="om-sector-head">
              <div className="om-sector-badge" style={{ background: meta.dim, color: meta.color, border: `1px solid ${meta.color}44` }}>
                {sectorKey}
              </div>
              <div className="om-sector-label">{meta.label}</div>
              <div className="om-sector-stats">
                <span style={{ color: meta.color, fontWeight: 800 }}>
                  {grouped[sectorKey].filter(s => s.isActive).length}/{grouped[sectorKey].length} active
                </span>
                <span style={{ color: 'var(--text3)', fontSize: '.72rem', marginLeft: '.5rem' }}>
                  Avg {grouped[sectorKey].length
                    ? (grouped[sectorKey].reduce((s,x) => s + x.discountPercentage, 0) / grouped[sectorKey].length).toFixed(1)
                    : 0}% discount
                </span>
              </div>
            </div>

            {/* Provider Cards */}
            <div className="om-providers-grid">
              {grouped[sectorKey].map(item => (
                <div key={item.id} className={`om-provider-card ${!item.isActive ? 'om-inactive' : ''}`} style={{ '--sector-color': meta.color }}>
                  {/* Provider Logo */}
                  <div className="om-provider-logo" style={{ background: item.isActive ? meta.color : '#475569', color: '#fff' }}>
                    {PROVIDER_ICONS[item.providerName] || item.providerName.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name & Status */}
                  <div className="om-provider-name">{item.providerName}</div>
                  <div className={`om-provider-status ${item.isActive ? 'active' : 'inactive'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </div>

                  {/* Discount Display */}
                  <div className="om-discount-display" style={{ color: item.isActive ? meta.color : 'var(--text3)' }}>
                    {item.discountPercentage}%
                    <span className="om-discount-label">OFF</span>
                  </div>

                  {/* Validity */}
                  <div className="om-validity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {item.validityDays} {item.validityDays === 1 ? 'day' : 'days'}
                  </div>

                  {/* Actions */}
                  <div className="om-provider-actions">
                    <button
                      className="om-btn-edit"
                      onClick={() => openEdit(item)}
                      style={{ borderColor: meta.color, color: meta.color }}
                    >
                      Edit
                    </button>
                    <button
                      className={`om-btn-toggle ${item.isActive ? '' : 'off'}`}
                      onClick={() => handleToggle(item)}
                      style={{ background: item.isActive ? meta.color : 'var(--card-border)' }}
                      disabled={toggleMutation.isPending}
                    >
                      {item.isActive ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* EDIT MODAL */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit — ${editItem?.providerName}`}>
        {editItem && (
          <>
            <div className="om-edit-current">
              <div className="om-edit-current-item">
                <div className="om-edit-current-val">{editItem.discountPercentage}%</div>
                <div className="om-edit-current-lbl">Current Discount</div>
              </div>
              <div className="om-edit-current-item">
                <div className="om-edit-current-val">{editItem.validityDays}d</div>
                <div className="om-edit-current-lbl">Current Validity</div>
              </div>
              <div className="om-edit-current-item">
                <div className="om-edit-current-val">{editItem.sector}</div>
                <div className="om-edit-current-lbl">Sector</div>
              </div>
            </div>

            <div className="om-edit-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Changes synchronize immediately across User and Merchant platforms.
            </div>

            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="field">
                <label className="field-label">Discount Percentage (%)</label>
                <input
                  className="field-input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={editForm.discountPercentage}
                  onChange={e => setEditForm(f => ({ ...f, discountPercentage: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="field">
                <label className="field-label">Validity Duration (days)</label>
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  value={editForm.validityDays}
                  onChange={e => setEditForm(f => ({ ...f, validityDays: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            {/* Live preview */}
            <div className="om-preview">
              <span style={{ color: 'var(--text2)', fontSize: '.8rem' }}>Preview:</span>
              <span style={{ fontWeight: 900, color: 'var(--pink)', fontSize: '1.1rem' }}>
                {editForm.discountPercentage}% off
              </span>
              <span style={{ color: 'var(--text2)', fontSize: '.8rem' }}>for</span>
              <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{editForm.validityDays} days</span>
            </div>

            <div className="modal-actions">
              <button
                className="btn-modal-save"
                onClick={saveEdit}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save & Sync Now'}
              </button>
              <button className="btn-modal-cancel" onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
