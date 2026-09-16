import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'usr-001', name: 'Farhan Hossain',  email: 'farhan@gmail.com',  role: 'USER',     accountStatus: 'ACTIVE',    complainCount: 2,  createdAt: '2026-01-15T08:00:00Z' },
  { id: 'usr-002', name: 'Tasnim Akter',    email: 'tasnim@gmail.com',  role: 'USER',     accountStatus: 'WARNING',   complainCount: 5,  createdAt: '2026-02-10T10:30:00Z' },
  { id: 'usr-003', name: 'Rifat Islam',     email: 'rifat@gmail.com',   role: 'USER',     accountStatus: 'ACTIVE',    complainCount: 1,  createdAt: '2026-03-05T14:00:00Z' },
  { id: 'usr-004', name: 'Nadia Sultana',   email: 'nadia@gmail.com',   role: 'USER',     accountStatus: 'WARNING',   complainCount: 8,  createdAt: '2026-04-20T09:15:00Z' },
  { id: 'usr-005', name: 'Karim Sheikh',    email: 'karim@gmail.com',   role: 'USER',     accountStatus: 'SUSPENDED', complainCount: 12, createdAt: '2026-05-01T11:45:00Z' },
  { id: 'usr-006', name: 'Priya Merchant',  email: 'priya@shop.com',    role: 'MERCHANT', accountStatus: 'ACTIVE',    complainCount: 0,  createdAt: '2026-06-12T07:30:00Z' },
]

// ── GET /api/admin/users ──────────────────────────────────
export async function listUsers(req, res) {
  try {
    const users = load('users', DEFAULTS)
    const { role, accountStatus, search } = req.query
    let filtered = [...users]
    if (role) filtered = filtered.filter(u => u.role === role)
    if (accountStatus) filtered = filtered.filter(u => u.accountStatus === accountStatus)
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
    }
    res.json({ success: true, data: filtered })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users.' })
  }
}

// ── PATCH /api/admin/users/:id/role ──────────────────────
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params
    const { role } = req.body
    if (!['USER', 'MERCHANT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role.' })
    }
    const users = load('users', DEFAULTS)
    const user = users.find(u => u.id === id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    user.role = role
    save('users', users)
    res.json({ success: true, data: { ...user } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user role.' })
  }
}

// ── PATCH /api/admin/users/:id/ban ───────────────────────
export async function toggleBanUser(req, res) {
  try {
    const { id } = req.params
    const users = load('users', DEFAULTS)
    const user = users.find(u => u.id === id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Cannot ban an Admin account.' })
    }
    user.accountStatus = user.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    save('users', users)
    res.json({ success: true, data: { ...user } })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user status.' })
  }
}
