import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/affiliates
export async function listAffiliates(req, res) {
  try {
    const affiliates = await prisma.affiliateLink.findMany({ orderBy: { clicksCount: 'desc' } })
    res.json({ success: true, data: affiliates })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch affiliates.' })
  }
}

// POST /api/admin/affiliates
export async function createAffiliate(req, res) {
  try {
    const { partnerName, originalDomain, commissionRate, trackingUrl } = req.body
    if (!partnerName || !originalDomain || commissionRate === undefined || !trackingUrl) {
      return res.status(400).json({ success: false, error: 'partnerName, originalDomain, commissionRate, trackingUrl are required.' })
    }
    const affiliate = await prisma.affiliateLink.create({
      data: { partnerName, originalDomain, commissionRate: parseFloat(commissionRate), trackingUrl },
    })
    res.status(201).json({ success: true, data: affiliate })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create affiliate.' })
  }
}

// PUT /api/admin/affiliates/:id
export async function updateAffiliate(req, res) {
  try {
    const { id } = req.params
    const { commissionRate, trackingUrl, status } = req.body
    const existing = await prisma.affiliateLink.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, error: 'Affiliate not found.' })

    const updated = await prisma.affiliateLink.update({
      where: { id },
      data: {
        ...(commissionRate !== undefined && { commissionRate: parseFloat(commissionRate) }),
        ...(trackingUrl !== undefined && { trackingUrl }),
        ...(status !== undefined && { status: Boolean(status) }),
      },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update affiliate.' })
  }
}

// DELETE /api/admin/affiliates/:id
export async function deleteAffiliate(req, res) {
  try {
    const { id } = req.params
    const existing = await prisma.affiliateLink.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, error: 'Affiliate not found.' })
    await prisma.affiliateLink.delete({ where: { id } })
    res.json({ success: true, message: `Affiliate ${existing.partnerName} removed.` })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete affiliate.' })
  }
}

// PATCH /api/admin/affiliates/:id/toggle
export async function toggleAffiliate(req, res) {
  try {
    const { id } = req.params
    const existing = await prisma.affiliateLink.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ success: false, error: 'Affiliate not found.' })
    const updated = await prisma.affiliateLink.update({
      where: { id },
      data: { status: !existing.status },
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to toggle affiliate.' })
  }
}
