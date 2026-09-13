import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SUSPEND_THRESHOLD = 5 // complaints before auto-suspension warning

// GET /api/admin/complaints
export async function listComplaints(req, res) {
  try {
    const { sector, status, page = 1, limit = 20 } = req.query
    const where = {}
    if (sector) where.sector = sector
    if (status) where.status = status

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, complainCount: true, accountStatus: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.complaint.count({ where }),
    ])

    res.json({ success: true, data: { complaints, total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (err) {
    console.error('[COMPLAINTS] list error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch complaints.' })
  }
}

// GET /api/admin/complaints/stats
export async function getStats(req, res) {
  try {
    const [
      totalComplaints,
      openComplaints,
      underReview,
      resolved,
      dismissed,
      foodCount,
      rideCount,
      skincareCount,
      flaggedUsers,
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'OPEN' } }),
      prisma.complaint.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { status: 'DISMISSED' } }),
      prisma.complaint.count({ where: { sector: 'FOOD' } }),
      prisma.complaint.count({ where: { sector: 'RIDE' } }),
      prisma.complaint.count({ where: { sector: 'SKINCARE' } }),
      prisma.user.count({ where: { complainCount: { gte: SUSPEND_THRESHOLD } } }),
    ])

    res.json({
      success: true,
      data: {
        total: totalComplaints,
        byStatus: { open: openComplaints, underReview, resolved, dismissed },
        bySector: { food: foodCount, ride: rideCount, skincare: skincareCount },
        flaggedAccounts: flaggedUsers,
        suspendThreshold: SUSPEND_THRESHOLD,
      },
    })
  } catch (err) {
    console.error('[COMPLAINTS] stats error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch complaint stats.' })
  }
}

// PATCH /api/admin/complaints/:id/resolve
export async function resolveComplaint(req, res) {
  try {
    const { id } = req.params
    const { adminResponse } = req.body

    if (!adminResponse || adminResponse.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Admin response must be at least 10 characters.' })
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } })
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' })

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        adminResponse: adminResponse.trim(),
        resolvedAt: new Date(),
      },
      include: { user: { select: { name: true, email: true } } },
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('[COMPLAINTS] resolve error:', err)
    res.status(500).json({ success: false, error: 'Failed to resolve complaint.' })
  }
}

// POST /api/admin/complaints/users/:userId/suspend
export async function toggleSuspendUser(req, res) {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })

    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Cannot suspend an Admin account.' })
    }

    const newStatus = user.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: newStatus },
      select: { id: true, name: true, email: true, accountStatus: true, complainCount: true },
    })

    res.json({
      success: true,
      data: updated,
      message: `User ${updated.name} has been ${newStatus === 'SUSPENDED' ? 'suspended' : 'reactivated'}.`,
    })
  } catch (err) {
    console.error('[COMPLAINTS] suspend error:', err)
    res.status(500).json({ success: false, error: 'Failed to update user status.' })
  }
}
