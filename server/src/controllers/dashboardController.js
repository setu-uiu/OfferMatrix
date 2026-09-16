// ── In-memory mock data store ─────────────────────────────
const mockMetrics = {
  users: { total: 6, active: 4, merchants: 1 },
  deals: { pending: 4, approved: 2 },
  complaints: { total: 10, open: 5, byFOOD: 4, byRIDE: 3, bySKINCARE: 3 },
  affiliates: { active: 4 },
  revenue: { totalFormatted: '৳124k', raw: 124000 },
  scrapers: { total: 8, online: 5, offline: 3 },
  offerMatrix: { activeSettings: 9, avgDiscount: 19.2 },
  fraud: { openReports: 1 },
}

export async function getMetrics(req, res) {
  try {
    res.json({ success: true, data: mockMetrics })
  } catch (err) {
    console.error('[DASHBOARD] metrics error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch metrics.' })
  }
}
