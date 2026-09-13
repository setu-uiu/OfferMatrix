import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/fraud
export async function listFraud(req, res) {
  try {
    const { status } = req.query
    const where = {}
    if (status) where.status = status
    const reports = await prisma.fraudReport.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: reports })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch fraud reports.' })
  }
}

// PATCH /api/admin/fraud/:id/resolve
export async function resolveFraud(req, res) {
  try {
    const { id } = req.params
    const report = await prisma.fraudReport.findUnique({ where: { id } })
    if (!report) return res.status(404).json({ success: false, error: 'Report not found.' })
    const updated = await prisma.fraudReport.update({
      where: { id },
      data: { status: 'RESOLVED', dispatchedAt: new Date() },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to resolve report.' })
  }
}

// POST /api/admin/fraud/:id/dispatch
export async function dispatchFraud(req, res) {
  try {
    const { id } = req.params
    const report = await prisma.fraudReport.findUnique({ where: { id } })
    if (!report) return res.status(404).json({ success: false, error: 'Report not found.' })
    const updated = await prisma.fraudReport.update({
      where: { id },
      data: { status: 'INVESTIGATING', dispatchedAt: new Date() },
    })
    res.json({ success: true, data: updated, message: `Fraud report ${report.incidentId} dispatched for investigation.` })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to dispatch report.' })
  }
}
