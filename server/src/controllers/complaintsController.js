import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'cmp-001', sector: 'FOOD',     serviceProvider: 'Foodpanda',     orderOrRideId: 'FP-2026-8821', subject: 'Wrong order delivered',               description: 'I ordered a chicken burger but received a fish sandwich. The delivery was also 45 minutes late.',                                                                     status: 'OPEN',         adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-09-01T08:00:00Z', user: { id: 'usr-001', name: 'Farhan Hossain',  email: 'farhan@gmail.com', complainCount: 2,  accountStatus: 'ACTIVE'    } },
  { id: 'cmp-002', sector: 'FOOD',     serviceProvider: 'Pathao Food',   orderOrRideId: 'PF-2026-3341', subject: 'Food was cold on arrival',             description: 'The biryani was completely cold when delivered. The packaging was also damaged.',                                                                                     status: 'UNDER_REVIEW', adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-02T10:00:00Z', updatedAt: '2026-09-03T09:00:00Z', user: { id: 'usr-002', name: 'Tasnim Akter',    email: 'tasnim@gmail.com', complainCount: 5,  accountStatus: 'WARNING'   } },
  { id: 'cmp-003', sector: 'RIDE',     serviceProvider: 'Uber',          orderOrRideId: 'UB-2026-9912', subject: 'Driver took wrong route',              description: 'Driver deliberately took a longer route to increase fare. Trip was 3x longer than usual.',                                                                          status: 'OPEN',         adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-03T14:00:00Z', updatedAt: '2026-09-03T14:00:00Z', user: { id: 'usr-003', name: 'Rifat Islam',     email: 'rifat@gmail.com',  complainCount: 1,  accountStatus: 'ACTIVE'    } },
  { id: 'cmp-004', sector: 'RIDE',     serviceProvider: 'Obhai',         orderOrRideId: 'OB-2026-5521', subject: 'Driver was rude and unprofessional',   description: 'The driver was verbally abusive throughout the trip and refused to turn on AC despite extreme heat.',                                                              status: 'OPEN',         adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-04T09:00:00Z', updatedAt: '2026-09-04T09:00:00Z', user: { id: 'usr-004', name: 'Nadia Sultana',   email: 'nadia@gmail.com',  complainCount: 8,  accountStatus: 'WARNING'   } },
  { id: 'cmp-005', sector: 'SKINCARE', serviceProvider: 'Kirei',         orderOrRideId: 'KR-2026-1142', subject: 'Counterfeit product delivered',        description: 'The Kirei serum I received appears to be a fake. The packaging is slightly different from genuine product and has a strange smell.',                             status: 'UNDER_REVIEW', adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-05T11:00:00Z', updatedAt: '2026-09-06T08:00:00Z', user: { id: 'usr-005', name: 'Karim Sheikh',    email: 'karim@gmail.com',  complainCount: 12, accountStatus: 'SUSPENDED' } },
  { id: 'cmp-006', sector: 'SKINCARE', serviceProvider: 'Choice Legacy', orderOrRideId: 'CL-2026-7743', subject: 'Product caused allergic reaction',     description: 'The moisturizer caused severe redness and itching on my skin. I had to visit a dermatologist.',                                                              status: 'OPEN',         adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-06T13:00:00Z', updatedAt: '2026-09-06T13:00:00Z', user: { id: 'usr-002', name: 'Tasnim Akter',    email: 'tasnim@gmail.com', complainCount: 5,  accountStatus: 'WARNING'   } },
  { id: 'cmp-007', sector: 'FOOD',     serviceProvider: 'Foodie',        orderOrRideId: 'FD-2026-2210', subject: 'Coupon not applied at checkout',       description: 'Used promo code FOODIE20 but it was not deducted from my bill despite being valid.',                                                                           status: 'RESOLVED',     adminResponse: 'We have verified the coupon issue and issued a full refund to your account. The technical team has been notified.',                resolvedAt: '2026-09-07T10:00:00Z', createdAt: '2026-09-04T07:00:00Z', updatedAt: '2026-09-07T10:00:00Z', user: { id: 'usr-001', name: 'Farhan Hossain',  email: 'farhan@gmail.com', complainCount: 2,  accountStatus: 'ACTIVE'    } },
  { id: 'cmp-008', sector: 'RIDE',     serviceProvider: 'InDriver',      orderOrRideId: 'ID-2026-8834', subject: 'Driver cancelled after accepting',     description: 'Driver accepted my ride and then cancelled after 10 minutes of waiting. I was late for an important meeting.',                                                status: 'OPEN',         adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-08T08:00:00Z', updatedAt: '2026-09-08T08:00:00Z', user: { id: 'usr-004', name: 'Nadia Sultana',   email: 'nadia@gmail.com',  complainCount: 8,  accountStatus: 'WARNING'   } },
  { id: 'cmp-009', sector: 'SKINCARE', serviceProvider: 'Makeup Chari',  orderOrRideId: 'MC-2026-4421', subject: 'Wrong shade delivered',                description: 'Ordered Foundation Shade 3 but received Shade 7. No response from seller for 3 days.',                                                                      status: 'DISMISSED',    adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-09T15:00:00Z', updatedAt: '2026-09-09T16:00:00Z', user: { id: 'usr-003', name: 'Rifat Islam',     email: 'rifat@gmail.com',  complainCount: 1,  accountStatus: 'ACTIVE'    } },
  { id: 'cmp-010', sector: 'FOOD',     serviceProvider: 'Foodpanda',     orderOrRideId: 'FP-2026-9983', subject: 'Restaurant cancelled without notice', description: 'Order was auto-cancelled by the restaurant 30 minutes after placing. No notification was sent. Money was debited.',                                         status: 'UNDER_REVIEW', adminResponse: null,                                                                                                               resolvedAt: null,             createdAt: '2026-09-10T12:00:00Z', updatedAt: '2026-09-11T09:00:00Z', user: { id: 'usr-005', name: 'Karim Sheikh',    email: 'karim@gmail.com',  complainCount: 12, accountStatus: 'SUSPENDED' } },
]

const SUSPEND_THRESHOLD = 5

// ── GET /api/admin/complaints ─────────────────────────────
export async function listComplaints(req, res) {
  try {
    const { sector, status, page = 1, limit = 20 } = req.query
    const complaints = load('complaints', DEFAULTS)
    let filtered = [...complaints]
    if (sector) filtered = filtered.filter(c => c.sector === sector)
    if (status) filtered = filtered.filter(c => c.status === status)
    const total = filtered.length
    const paginated = filtered.slice((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit))
    res.json({ success: true, data: { complaints: paginated, total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (err) {
    console.error('[COMPLAINTS] list error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch complaints.' })
  }
}

// ── GET /api/admin/complaints/stats ──────────────────────
export async function getStats(req, res) {
  try {
    const complaints = load('complaints', DEFAULTS)
    res.json({
      success: true,
      data: {
        total: complaints.length,
        byStatus: {
          open: complaints.filter(c => c.status === 'OPEN').length,
          underReview: complaints.filter(c => c.status === 'UNDER_REVIEW').length,
          resolved: complaints.filter(c => c.status === 'RESOLVED').length,
          dismissed: complaints.filter(c => c.status === 'DISMISSED').length,
        },
        bySector: {
          food: complaints.filter(c => c.sector === 'FOOD').length,
          ride: complaints.filter(c => c.sector === 'RIDE').length,
          skincare: complaints.filter(c => c.sector === 'SKINCARE').length,
        },
        flaggedAccounts: complaints.filter(c => c.user.complainCount >= SUSPEND_THRESHOLD).length,
        suspendThreshold: SUSPEND_THRESHOLD,
      },
    })
  } catch (err) {
    console.error('[COMPLAINTS] stats error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch complaint stats.' })
  }
}

// ── PATCH /api/admin/complaints/:id/resolve ───────────────
export async function resolveComplaint(req, res) {
  try {
    const { id } = req.params
    const { adminResponse } = req.body
    if (!adminResponse || adminResponse.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Admin response must be at least 10 characters.' })
    }
    const complaints = load('complaints', DEFAULTS)
    const complaint = complaints.find(c => c.id === id)
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' })
    complaint.status = 'RESOLVED'
    complaint.adminResponse = adminResponse.trim()
    complaint.resolvedAt = new Date().toISOString()
    complaint.updatedAt = new Date().toISOString()
    save('complaints', complaints)
    res.json({ success: true, data: { ...complaint } })
  } catch (err) {
    console.error('[COMPLAINTS] resolve error:', err)
    res.status(500).json({ success: false, error: 'Failed to resolve complaint.' })
  }
}

// ── POST /api/admin/complaints/users/:userId/suspend ──────
export async function toggleSuspendUser(req, res) {
  try {
    const { userId } = req.params
    const complaints = load('complaints', DEFAULTS)
    const found = complaints.find(c => c.user.id === userId)
    if (!found) return res.status(404).json({ success: false, error: 'User not found.' })
    const user = found.user
    const newStatus = user.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    complaints.forEach(c => { if (c.user.id === userId) c.user.accountStatus = newStatus })
    save('complaints', complaints)
    res.json({
      success: true,
      data: { ...user, accountStatus: newStatus },
      message: `User ${user.name} has been ${newStatus === 'SUSPENDED' ? 'suspended' : 'reactivated'}.`,
    })
  } catch (err) {
    console.error('[COMPLAINTS] suspend error:', err)
    res.status(500).json({ success: false, error: 'Failed to update user status.' })
  }
}
