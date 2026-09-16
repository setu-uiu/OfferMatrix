import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'fr-001', incidentId: 'FR-2026-001', targetIp: '103.42.108.221', partnerName: 'TechShop BD', reason: 'Click injection pattern detected — 25.7% flag rate',        riskScore: 87.4, status: 'OPEN',          dispatchedAt: null,                   createdAt: '2026-09-01T08:00:00Z' },
  { id: 'fr-002', incidentId: 'FR-2026-002', targetIp: '45.76.123.88',   partnerName: 'FashionHub',  reason: 'Cookie stuffing events detected across 2,100 sessions',       riskScore: 71.2, status: 'INVESTIGATING', dispatchedAt: '2026-09-10T10:00:00Z', createdAt: '2026-09-05T10:00:00Z' },
  { id: 'fr-003', incidentId: 'FR-2026-003', targetIp: '192.168.44.12',  partnerName: 'GadgetZone',  reason: 'Fake conversion signals — 7.5% abnormal rate',                riskScore: 42.8, status: 'RESOLVED',      dispatchedAt: '2026-09-08T14:00:00Z', createdAt: '2026-09-07T14:00:00Z' },
]

// ── GET /api/admin/fraud ──────────────────────────────────
export async function listFraud(req, res) {
  try {
    const { status } = req.query
    const reports = load('fraud', DEFAULTS)
    const filtered = status ? reports.filter(r => r.status === status) : [...reports]
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ success: true, data: filtered })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch fraud reports.' })
  }
}

// ── PATCH /api/admin/fraud/:id/resolve ───────────────────
export async function resolveFraud(req, res) {
  try {
    const { id } = req.params
    const reports = load('fraud', DEFAULTS)
    const report = reports.find(r => r.id === id)
    if (!report) return res.status(404).json({ success: false, error: 'Report not found.' })
    report.status = 'RESOLVED'
    report.dispatchedAt = new Date().toISOString()
    save('fraud', reports)
    res.json({ success: true, data: { ...report } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to resolve report.' })
  }
}

// ── POST /api/admin/fraud/:id/dispatch ───────────────────
export async function dispatchFraud(req, res) {
  try {
    const { id } = req.params
    const reports = load('fraud', DEFAULTS)
    const report = reports.find(r => r.id === id)
    if (!report) return res.status(404).json({ success: false, error: 'Report not found.' })
    report.status = 'INVESTIGATING'
    report.dispatchedAt = new Date().toISOString()
    save('fraud', reports)
    res.json({ success: true, data: { ...report }, message: `Fraud report ${report.incidentId} dispatched for investigation.` })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to dispatch report.' })
  }
}
