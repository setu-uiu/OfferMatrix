import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/deals/pending
export async function getPendingDeals(req, res) {
  try {
    const deals = await prisma.deal.findMany({
      where: { status: 'PENDING' },
      include: { submittedBy: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: deals })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch pending deals.' })
  }
}

// GET /api/admin/deals
export async function listDeals(req, res) {
  try {
    const { status } = req.query
    const where = {}
    if (status) where.status = status

    const deals = await prisma.deal.findMany({
      where,
      include: { submittedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: deals })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch deals.' })
  }
}

// PATCH /api/admin/deals/:id/status
export async function updateDealStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be APPROVED or REJECTED.' })
    }

    const deal = await prisma.deal.findUnique({ where: { id } })
    if (!deal) return res.status(404).json({ success: false, error: 'Deal not found.' })

    const updated = await prisma.deal.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    })

    // If approved, increment user trust (simulated — in production wire to user points)
    if (status === 'APPROVED' && deal.submittedById) {
      await prisma.user.update({
        where: { id: deal.submittedById },
        data: { updatedAt: new Date() }, // placeholder — extend with trustPoints field
      }).catch(() => {})
    }

    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update deal status.' })
  }
}
