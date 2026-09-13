import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/users
export async function listUsers(req, res) {
  try {
    const { role, accountStatus, search } = req.query
    const where = {}
    if (role) where.role = role
    if (accountStatus) where.accountStatus = accountStatus
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, accountStatus: true, complainCount: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users.' })
  }
}

// PATCH /api/admin/users/:id/role
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params
    const { role } = req.body
    if (!['USER', 'MERCHANT', 'MODERATOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role.' })
    }
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, accountStatus: true },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user role.' })
  }
}

// PATCH /api/admin/users/:id/ban
export async function toggleBanUser(req, res) {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Cannot ban an Admin account.' })
    }
    const newStatus = user.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    const updated = await prisma.user.update({
      where: { id },
      data: { accountStatus: newStatus },
      select: { id: true, name: true, email: true, role: true, accountStatus: true },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user status.' })
  }
}
