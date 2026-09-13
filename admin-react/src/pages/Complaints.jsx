import { useState } from 'react'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import {
  useComplaints,
  useComplaintStats,
  useResolveComplaint,
  useSuspendUser,
} from '../hooks/useApi.js'
import './Complaints.css'

const SECTORS  = ['', 'FOOD', 'RIDE', 'SKINCARE']
const STATUSES = ['', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']

const SECTOR_COLORS = { FOOD: 'var(--amber)', RIDE: 'var(--blue)', SKINCARE: 'var(--pink)' }
const STATUS_CLS    = { OPEN: 'pill-red', UNDER_REVIEW: 'pill-yellow', RESOLVED: 'pill-green', DISMISSED: 'pill-blue' }
const STATUS_LABELS = { OPEN: 'Open', UNDER_REVIEW: 'Under Review', RESOLVED: 'Resolved', DISMISSED: 'Dismissed' }

// Mock fallback data
const MOCK_STATS = {
  total: 10, flaggedAccounts: 2, suspendThreshold: 5,
  byStatus: { open: 5, underReview: 2, resolved: 2, dismissed: 1 },
  bySector: { food: 4, ride: 3, skincare: 3 },
}
const MOCK_COMPLAINTS = [
  { id: '1', sector: 'FOOD', serviceProvider: 'Foodpanda', subject: 'Wrong order delivered', status: 'OPEN', createdAt: new Date().toISOString(), user: { id: 'u1', name: 'Farhan Hossain', email: 'farhan@gmail.com', complainCount: 2, accountStatus: 'ACTIVE' }, description: 'I ordered a chicken burger but received a fish sandwich. The delivery was also 45 minutes late.' },
  { id: '2', sector: 'RIDE', serviceProvider: 'Uber', subject: 'Driver took wrong route', status: 'OPEN', createdAt: new Date().toISOString(), user: { id: 'u2', name: 'Tasnim Akter', email: 'tasnim@gmail.com', complainCount: 5, accountStatus: 'WARNING' }, description: 'Driver deliberately took a longer route to increase fare. Trip was 3x longer than usual.' },
  { id: '3', sector: 'SKINCARE', serviceProvider: 'Kirei', subject: 'Counterfeit product delivered', status: 'UNDER_REVIEW', createdAt: new Date().toISOString(), user: { id: 'u3', name: 'Karim Sheikh', email: 'karim@gmail.com', complainCount: 12, accountStatus: 'SUSPENDED' }, description: 'The Kirei serum I received appears to be fake. Packaging is slightly different and has a strange smell.' },
]

export default function Complaints() {
  const [sector, setSector]   = useState('')
  const [status, setStatus]   = useState('')
  const [search, setSearch]   = useState('')
  const [viewItem, setViewItem]     = useState(null)
  const [response, setResponse]     = useState('')
  const [confirmSuspend, setConfirmSuspend] = useState(null)

  const { data: cData, isError: cErr } = useComplaints(sector, status)
  const { data: stats, isError: sErr } = useComplaintStats()
  const resolveMutation  = useResolveComplaint()
  const suspendMutation  = useSuspendUser()

  const isOffline   = cErr
  const rawList     = cData?.complaints ?? (isOffline ? MOCK_COMPLAINTS : [])
  const statsData   = stats ?? (sErr ? MOCK_STATS : MOCK_STATS)

  const complaints  = rawList.filter(c =>
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.serviceProvider.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleResolve() {
    if (!viewItem || response.trim().length < 10) {
      showToast('Response must be at least 10 characters', 'amber')
      return
    }
    if (isOffline) { showToast('API offline — cannot persist', 'amber'); setViewItem(null); return }
    try {
      await resolveMutation.mutateAsync({ id: viewItem.id, adminResponse: response.trim() })
      showToast('Complaint resolved and response sent', 'green')
      setViewItem(null)
      setResponse('')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to resolve', 'red')
    }
  }

  async function handleSuspend(userId, userName) {
    if (isOffline) { showToast('API offline', 'amber'); return }
    try {
      const res = await suspendMutation.mutateAsync(userId)
      showToast(res.message || `${userName} status updated`, 'green')
      setViewItem(null)
      setConfirmSuspend(null)
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update user', 'red')
    }
  }

  const accountStatusCls = { ACTIVE: 'pill-green', WARNING: 'pill-yellow', SUSPENDED: 'pill-red' }

  return (
    <>
      {/* KPI CARDS */}
      <div className="complaints-kpis">
        {[
          { label: 'Total Complaints',    val: statsData.total,              color: 'var(--text)',   sub: `${statsData.byStatus?.open} open` },
          { label: 'Food Issues',          val: statsData.bySector?.food,     color: 'var(--amber)',  sub: 'FOOD sector' },
          { label: 'Ride Issues',          val: statsData.bySector?.ride,     color: 'var(--blue)',   sub: 'RIDE sector' },
          { label: 'Skincare Issues',      val: statsData.bySector?.skincare, color: 'var(--pink)',   sub: 'SKINCARE sector' },
          { label: 'Flagged Accounts',     val: statsData.flaggedAccounts,    color: 'var(--red)',    sub: `>${statsData.suspendThreshold} complaints` },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: k.color, letterSpacing: '-1px' }}>{k.val ?? '—'}</div>
            <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', marginTop: 3 }}>{k.label}</div>
            <div style={{ fontSize: '.62rem', color: 'var(--text3)', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* STATUS PILLS */}
      <div className="complaints-status-row">
        {[
          { label: 'Open',         count: statsData.byStatus?.open,        cls: 'pill-red' },
          { label: 'Under Review', count: statsData.byStatus?.underReview,  cls: 'pill-yellow' },
          { label: 'Resolved',     count: statsData.byStatus?.resolved,     cls: 'pill-green' },
          { label: 'Dismissed',    count: statsData.byStatus?.dismissed,    cls: 'pill-blue' },
        ].map(s => (
          <div key={s.label} className="complaints-status-pill">
            <span className={`status-pill ${s.cls}`}>{s.label}</span>
            <span style={{ fontSize: '.8rem', fontWeight: 700, marginLeft: '.3rem', color: 'var(--text)' }}>{s.count ?? 0}</span>
          </div>
        ))}
        {isOffline && <span className="status-pill pill-yellow" style={{ marginLeft: 'auto' }}>Offline Mode</span>}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="input-sm" value={sector} onChange={e => setSector(e.target.value)}>
          {SECTORS.map(s => <option key={s} value={s}>{s || 'All Sectors'}</option>)}
        </select>
        <select className="input-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s ? STATUS_LABELS[s] : 'All Statuses'}</option>)}
        </select>
        <input
          className="input-sm"
          placeholder="Search complaints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
      </div>

      {/* TABLE */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto', padding: '0 1.4rem 1.4rem' }}>
          <table className="data-table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Complainant</th>
                <th>Sector</th>
                <th>Provider</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Complain Count</th>
                <th>Account</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No complaints found</td></tr>
              ) : complaints.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{c.user?.name}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--text3)' }}>{c.user?.email}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: SECTOR_COLORS[c.sector] || 'var(--text)', fontSize: '.78rem' }}>
                      {c.sector}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: '.82rem' }}>{c.serviceProvider}</td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontWeight: 600, fontSize: '.82rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.subject}
                    </div>
                  </td>
                  <td><span className={`status-pill ${STATUS_CLS[c.status] || 'pill-blue'}`}>{STATUS_LABELS[c.status] || c.status}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: (c.user?.complainCount ?? 0) >= 5 ? 'var(--red)' : 'var(--text)' }}>
                      {c.user?.complainCount ?? 0}
                    </span>
                    {(c.user?.complainCount ?? 0) >= 5 && (
                      <span style={{ marginLeft: 4, fontSize: '.6rem', color: 'var(--red)', fontWeight: 700 }}>HIGH</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill ${accountStatusCls[c.user?.accountStatus] || 'pill-blue'}`}>
                      {c.user?.accountStatus || '—'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text3)', fontSize: '.72rem', whiteSpace: 'nowrap' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-BD', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '.3rem' }}>
                      <button className="act-btn act-view" onClick={() => { setViewItem(c); setResponse('') }}>
                        Respond
                      </button>
                      {c.user?.accountStatus !== 'SUSPENDED' && (c.user?.complainCount ?? 0) >= 5 && (
                        <button
                          className="act-btn act-ban"
                          onClick={() => setConfirmSuspend(c.user)}
                          title="Suspend this account"
                        >
                          Suspend
                        </button>
                      )}
                      {c.user?.accountStatus === 'SUSPENDED' && (
                        <button
                          className="act-btn act-edit"
                          onClick={() => handleSuspend(c.user.id, c.user.name)}
                          title="Reactivate account"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESPOND MODAL */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="View & Respond to Complaint">
        {viewItem && (
          <>
            <div className="complaints-detail-grid">
              <div className="field"><div className="field-label">Complainant</div><div className="complaints-detail-val">{viewItem.user?.name} <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '.78rem' }}>({viewItem.user?.email})</span></div></div>
              <div className="field"><div className="field-label">Sector / Provider</div><div className="complaints-detail-val" style={{ color: SECTOR_COLORS[viewItem.sector] }}>{viewItem.sector} — {viewItem.serviceProvider}</div></div>
              <div className="field"><div className="field-label">Subject</div><div className="complaints-detail-val">{viewItem.subject}</div></div>
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <div className="field-label">Description</div>
                <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '.8rem', fontSize: '.82rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  {viewItem.description}
                </div>
              </div>
              <div className="field">
                <div className="field-label">Complain Count</div>
                <div className="complaints-detail-val" style={{ color: (viewItem.user?.complainCount ?? 0) >= 5 ? 'var(--red)' : 'var(--text)' }}>
                  {viewItem.user?.complainCount ?? 0} complaints {(viewItem.user?.complainCount ?? 0) >= 5 ? '— FLAGGED' : ''}
                </div>
              </div>
              <div className="field">
                <div className="field-label">Account Status</div>
                <span className={`status-pill ${accountStatusCls[viewItem.user?.accountStatus] || 'pill-blue'}`}>
                  {viewItem.user?.accountStatus}
                </span>
              </div>
            </div>

            {viewItem.status !== 'RESOLVED' && (
              <div className="field" style={{ marginTop: '1rem' }}>
                <label className="field-label">Admin Response</label>
                <textarea
                  className="field-input"
                  rows={4}
                  style={{ resize: 'vertical' }}
                  placeholder="Write your official response to this complaint (min. 10 characters)..."
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                />
                <div style={{ fontSize: '.68rem', color: response.length < 10 ? 'var(--red)' : 'var(--green)', marginTop: 4 }}>
                  {response.length} / 10 min characters
                </div>
              </div>
            )}
            {viewItem.status === 'RESOLVED' && viewItem.adminResponse && (
              <div className="field">
                <div className="field-label">Admin Response (sent)</div>
                <div style={{ background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '.8rem', fontSize: '.82rem', color: 'var(--green)', lineHeight: 1.6 }}>
                  {viewItem.adminResponse}
                </div>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '1.2rem' }}>
              {viewItem.status !== 'RESOLVED' && (
                <button
                  className="btn-modal-save"
                  onClick={handleResolve}
                  disabled={resolveMutation.isPending || response.trim().length < 10}
                >
                  {resolveMutation.isPending ? 'Resolving...' : 'Resolve & Send Response'}
                </button>
              )}
              {viewItem.user?.accountStatus !== 'SUSPENDED' && (viewItem.user?.complainCount ?? 0) >= 5 && (
                <button
                  className="btn-modal-save"
                  style={{ background: 'var(--red)' }}
                  onClick={() => { setConfirmSuspend(viewItem.user); setViewItem(null) }}
                >
                  Suspend Account
                </button>
              )}
              <button className="btn-modal-cancel" onClick={() => setViewItem(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>

      {/* CONFIRM SUSPEND MODAL */}
      <Modal open={!!confirmSuspend} onClose={() => setConfirmSuspend(null)} title="Confirm Account Suspension">
        {confirmSuspend && (
          <>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem', marginBottom: '.5rem' }}>
                Suspend {confirmSuspend.name}?
              </div>
              <div style={{ color: 'var(--text2)', fontSize: '.82rem', lineHeight: 1.5 }}>
                This user has <strong style={{ color: 'var(--red)' }}>{confirmSuspend.complainCount} complaints</strong> exceeding the threshold of 5.
                Their account will be suspended and they will lose access to the platform.
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-modal-save"
                style={{ background: 'var(--red)' }}
                onClick={() => handleSuspend(confirmSuspend.id, confirmSuspend.name)}
                disabled={suspendMutation.isPending}
              >
                {suspendMutation.isPending ? 'Suspending...' : 'Yes, Suspend Account'}
              </button>
              <button className="btn-modal-cancel" onClick={() => setConfirmSuspend(null)}>Cancel</button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
