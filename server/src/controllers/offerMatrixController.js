import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'oms-001', sector: 'FOOD',     providerName: 'Foodie',        discountPercentage: 15.0, validityDays: 7,  isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-002', sector: 'FOOD',     providerName: 'Pathao',        discountPercentage: 12.5, validityDays: 3,  isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-003', sector: 'FOOD',     providerName: 'Foodpanda',     discountPercentage: 20.0, validityDays: 14, isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-004', sector: 'RIDE',     providerName: 'Uber',          discountPercentage: 10.0, validityDays: 5,  isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-005', sector: 'RIDE',     providerName: 'Obhai',         discountPercentage: 18.0, validityDays: 7,  isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-006', sector: 'RIDE',     providerName: 'InDriver',      discountPercentage: 22.0, validityDays: 3,  isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-007', sector: 'SKINCARE', providerName: 'Choice Legacy', discountPercentage: 25.0, validityDays: 30, isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-008', sector: 'SKINCARE', providerName: 'Kirei',         discountPercentage: 30.0, validityDays: 14, isActive: true,  updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
  { id: 'oms-009', sector: 'SKINCARE', providerName: 'Makeup Chari',  discountPercentage: 20.0, validityDays: 21, isActive: false, updatedBy: { name: 'Super Admin' }, updatedAt: '2026-09-01T00:00:00Z' },
]

// ── GET /api/admin/offer-matrix ───────────────────────────
export async function listSettings(req, res) {
  try {
    const settings = load('offerMatrix', DEFAULTS)
    const grouped = { FOOD: [], RIDE: [], SKINCARE: [] }
    for (const s of settings) {
      if (grouped[s.sector]) grouped[s.sector].push(s)
    }
    res.json({ success: true, data: { settings, grouped } })
  } catch (err) {
    console.error('[OFFER-MATRIX] list error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch offer matrix settings.' })
  }
}

// ── PUT /api/admin/offer-matrix/:id ──────────────────────
export async function updateSetting(req, res) {
  try {
    const { id } = req.params
    const { discountPercentage, validityDays } = req.body
    if (discountPercentage === undefined || validityDays === undefined) {
      return res.status(400).json({ success: false, error: 'discountPercentage and validityDays are required.' })
    }
    const discount = parseFloat(discountPercentage)
    const days = parseInt(validityDays)
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ success: false, error: 'discountPercentage must be between 0 and 100.' })
    }
    if (isNaN(days) || days < 1) {
      return res.status(400).json({ success: false, error: 'validityDays must be at least 1.' })
    }
    const settings = load('offerMatrix', DEFAULTS)
    const setting = settings.find(s => s.id === id)
    if (!setting) return res.status(404).json({ success: false, error: 'Setting not found.' })
    setting.discountPercentage = discount
    setting.validityDays = days
    setting.updatedAt = new Date().toISOString()
    if (req.user) setting.updatedBy = { name: req.user.name || 'Super Admin' }
    save('offerMatrix', settings)
    res.json({
      success: true,
      data: { ...setting },
      message: `${setting.providerName} discount updated to ${discount}% for ${days} days. Synchronized across all platforms.`,
    })
  } catch (err) {
    console.error('[OFFER-MATRIX] update error:', err)
    res.status(500).json({ success: false, error: 'Failed to update setting.' })
  }
}

// ── PATCH /api/admin/offer-matrix/:id/toggle ─────────────
export async function toggleSetting(req, res) {
  try {
    const { id } = req.params
    const settings = load('offerMatrix', DEFAULTS)
    const setting = settings.find(s => s.id === id)
    if (!setting) return res.status(404).json({ success: false, error: 'Setting not found.' })
    setting.isActive = !setting.isActive
    setting.updatedAt = new Date().toISOString()
    save('offerMatrix', settings)
    res.json({
      success: true,
      data: { ...setting },
      message: `${setting.providerName} has been ${setting.isActive ? 'activated' : 'deactivated'}.`,
    })
  } catch (err) {
    console.error('[OFFER-MATRIX] toggle error:', err)
    res.status(500).json({ success: false, error: 'Failed to toggle setting.' })
  }
}
