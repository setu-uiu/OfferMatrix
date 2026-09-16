import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'aff-001', partnerName: 'Daraz',    originalDomain: 'daraz.com.bd',  commissionRate: 5.5, trackingUrl: 'https://s.click.aliexpress.com/om_daraz', clicksCount: 18420, conversionsCount: 1842, status: true,  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'aff-002', partnerName: 'Shajgoj',  originalDomain: 'shajgoj.com',   commissionRate: 8.0, trackingUrl: 'https://track.om/shajgoj',                clicksCount: 5640,  conversionsCount: 451,  status: true,  createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'aff-003', partnerName: 'Pickaboo', originalDomain: 'pickaboo.com',  commissionRate: 4.0, trackingUrl: 'https://track.om/pickaboo',               clicksCount: 9840,  conversionsCount: 820,  status: true,  createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'aff-004', partnerName: 'Rokomari', originalDomain: 'rokomari.com',  commissionRate: 6.0, trackingUrl: 'https://track.om/rokomari',               clicksCount: 3180,  conversionsCount: 254,  status: true,  createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'aff-005', partnerName: 'Chaldal',  originalDomain: 'chaldal.com',   commissionRate: 4.5, trackingUrl: 'https://track.om/chaldal',                clicksCount: 2840,  conversionsCount: 198,  status: false, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' },
]

// ── GET /api/admin/affiliates ─────────────────────────────
export async function listAffiliates(req, res) {
  try {
    const affiliates = load('affiliates', DEFAULTS)
    res.json({ success: true, data: [...affiliates].sort((a, b) => b.clicksCount - a.clicksCount) })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch affiliates.' })
  }
}

// ── POST /api/admin/affiliates ────────────────────────────
export async function createAffiliate(req, res) {
  try {
    const { partnerName, originalDomain, commissionRate, trackingUrl } = req.body
    if (!partnerName || !originalDomain || commissionRate === undefined || !trackingUrl) {
      return res.status(400).json({ success: false, error: 'partnerName, originalDomain, commissionRate, trackingUrl are required.' })
    }
    const affiliates = load('affiliates', DEFAULTS)
    const newAffiliate = {
      id: `aff-${Date.now()}`,
      partnerName, originalDomain,
      commissionRate: parseFloat(commissionRate),
      trackingUrl,
      clicksCount: 0, conversionsCount: 0, status: true,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    affiliates.push(newAffiliate)
    save('affiliates', affiliates)
    res.status(201).json({ success: true, data: newAffiliate })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create affiliate.' })
  }
}

// ── PUT /api/admin/affiliates/:id ─────────────────────────
export async function updateAffiliate(req, res) {
  try {
    const { id } = req.params
    const { commissionRate, trackingUrl, status } = req.body
    const affiliates = load('affiliates', DEFAULTS)
    const existing = affiliates.find(a => a.id === id)
    if (!existing) return res.status(404).json({ success: false, error: 'Affiliate not found.' })
    if (commissionRate !== undefined) existing.commissionRate = parseFloat(commissionRate)
    if (trackingUrl !== undefined) existing.trackingUrl = trackingUrl
    if (status !== undefined) existing.status = Boolean(status)
    existing.updatedAt = new Date().toISOString()
    save('affiliates', affiliates)
    res.json({ success: true, data: { ...existing } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update affiliate.' })
  }
}

// ── DELETE /api/admin/affiliates/:id ─────────────────────
export async function deleteAffiliate(req, res) {
  try {
    const { id } = req.params
    const affiliates = load('affiliates', DEFAULTS)
    const idx = affiliates.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'Affiliate not found.' })
    const [removed] = affiliates.splice(idx, 1)
    save('affiliates', affiliates)
    res.json({ success: true, message: `Affiliate ${removed.partnerName} removed.` })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete affiliate.' })
  }
}

// ── PATCH /api/admin/affiliates/:id/toggle ────────────────
export async function toggleAffiliate(req, res) {
  try {
    const { id } = req.params
    const affiliates = load('affiliates', DEFAULTS)
    const existing = affiliates.find(a => a.id === id)
    if (!existing) return res.status(404).json({ success: false, error: 'Affiliate not found.' })
    existing.status = !existing.status
    existing.updatedAt = new Date().toISOString()
    save('affiliates', affiliates)
    res.json({ success: true, data: { ...existing } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to toggle affiliate.' })
  }
}
