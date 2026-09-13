import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/offer-matrix
export async function listSettings(req, res) {
  try {
    const settings = await prisma.offerMatrixSetting.findMany({
      include: { updatedBy: { select: { name: true } } },
      orderBy: [{ sector: 'asc' }, { providerName: 'asc' }],
    })

    // Group by sector
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

// PUT /api/admin/offer-matrix/:id
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

    const existing = await prisma.offerMatrixSetting.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, error: 'Setting not found.' })

    const updated = await prisma.offerMatrixSetting.update({
      where: { id },
      data: {
        discountPercentage: discount,
        validityDays: days,
        updatedById: req.user.id,
        updatedAt: new Date(),
      },
    })

    res.json({
      success: true,
      data: updated,
      message: `${updated.providerName} discount updated to ${discount}% for ${days} days. Synchronized across all platforms.`,
    })
  } catch (err) {
    console.error('[OFFER-MATRIX] update error:', err)
    res.status(500).json({ success: false, error: 'Failed to update setting.' })
  }
}

// PATCH /api/admin/offer-matrix/:id/toggle
export async function toggleSetting(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.offerMatrixSetting.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, error: 'Setting not found.' })

    const updated = await prisma.offerMatrixSetting.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
        updatedById: req.user.id,
        updatedAt: new Date(),
      },
    })

    res.json({
      success: true,
      data: updated,
      message: `${updated.providerName} has been ${updated.isActive ? 'activated' : 'deactivated'}.`,
    })
  } catch (err) {
    console.error('[OFFER-MATRIX] toggle error:', err)
    res.status(500).json({ success: false, error: 'Failed to toggle setting.' })
  }
}
