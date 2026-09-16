import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'deal-001', title: 'Daraz Flash Sale — Samsung A55 ৳8k Off',        merchant: 'Daraz',              sector: 'SKINCARE', originalPrice: 46000, discountedPrice: 38000, discountPercent: 17.4, couponCode: null,        affiliateUrl: 'https://daraz.com.bd', status: 'PENDING',  submittedBy: { id: 'usr-001', name: 'Farhan Hossain' }, createdAt: '2026-09-10T08:00:00Z', updatedAt: '2026-09-10T08:00:00Z' },
  { id: 'deal-002', title: 'Pizza Place BOGO on Large Pizzas',                merchant: 'Pizza Place Dhanmondi', sector: 'FOOD', originalPrice: 800,   discountedPrice: 400,   discountPercent: 50,   couponCode: null,        affiliateUrl: null,                   status: 'PENDING',  submittedBy: { id: 'usr-002', name: 'Tasnim Akter' },   createdAt: '2026-09-11T10:00:00Z', updatedAt: '2026-09-11T10:00:00Z' },
  { id: 'deal-003', title: 'Shajgoj 30% Off Korean Skincare — SHAJGOJ30',    merchant: 'Shajgoj',            sector: 'SKINCARE', originalPrice: 2000,  discountedPrice: 1400,  discountPercent: 30,   couponCode: 'SHAJGOJ30', affiliateUrl: 'https://shajgoj.com',  status: 'PENDING',  submittedBy: { id: 'usr-003', name: 'Rifat Islam' },    createdAt: '2026-09-12T14:00:00Z', updatedAt: '2026-09-12T14:00:00Z' },
  { id: 'deal-004', title: 'StarTech Anker 737 In-Store ৳900 Off',           merchant: 'StarTech',           sector: 'RIDE',     originalPrice: 6100,  discountedPrice: 5200,  discountPercent: 14.8, couponCode: null,        affiliateUrl: null,                   status: 'PENDING',  submittedBy: { id: 'usr-003', name: 'Rifat Islam' },    createdAt: '2026-09-13T09:00:00Z', updatedAt: '2026-09-13T09:00:00Z' },
  { id: 'deal-005', title: 'Pathao Food ৳100 Off — PATHAONEW',               merchant: 'Pathao',             sector: 'FOOD',     originalPrice: 500,   discountedPrice: 400,   discountPercent: 20,   couponCode: 'PATHAONEW', affiliateUrl: null,                   status: 'APPROVED', submittedBy: { id: 'usr-001', name: 'Farhan Hossain' }, createdAt: '2026-09-08T07:00:00Z', updatedAt: '2026-09-09T10:00:00Z' },
  { id: 'deal-006', title: 'Chaldal Free Delivery Over ৳499',                 merchant: 'Chaldal',            sector: 'FOOD',     originalPrice: 499,   discountedPrice: 449,   discountPercent: 10,   couponCode: null,        affiliateUrl: null,                   status: 'APPROVED', submittedBy: { id: 'usr-004', name: 'Nadia Sultana' },  createdAt: '2026-09-07T11:00:00Z', updatedAt: '2026-09-08T08:00:00Z' },
]

// ── GET /api/admin/deals/pending ─────────────────────────
export async function getPendingDeals(req, res) {
  try {
    const deals = load('deals', DEFAULTS)
    res.json({ success: true, data: deals.filter(d => d.status === 'PENDING') })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch pending deals.' })
  }
}

// ── GET /api/admin/deals ──────────────────────────────────
export async function listDeals(req, res) {
  try {
    const deals = load('deals', DEFAULTS)
    const { status } = req.query
    res.json({ success: true, data: status ? deals.filter(d => d.status === status) : deals })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch deals.' })
  }
}

// ── PATCH /api/admin/deals/:id/status ────────────────────
export async function updateDealStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be APPROVED or REJECTED.' })
    }
    const deals = load('deals', DEFAULTS)
    const deal = deals.find(d => d.id === id)
    if (!deal) return res.status(404).json({ success: false, error: 'Deal not found.' })
    deal.status = status
    deal.updatedAt = new Date().toISOString()
    save('deals', deals)
    res.json({ success: true, data: { ...deal } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update deal status.' })
  }
}
