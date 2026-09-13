import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMetrics(req, res) {
  try {
    const [
      totalUsers,
      activeUsers,
      totalMerchants,
      pendingDeals,
      approvedDeals,
      openComplaints,
      totalComplaints,
      activeAffiliates,
      offerMatrixSettings,
      scraperLogs,
      fraudReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'MERCHANT' } }),
      prisma.deal.count({ where: { status: 'PENDING' } }),
      prisma.deal.count({ where: { status: 'APPROVED' } }),
      prisma.complaint.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      prisma.complaint.count(),
      prisma.affiliateLink.count({ where: { status: true } }),
      prisma.offerMatrixSetting.findMany({ where: { isActive: true } }),
      prisma.scraperLog.findMany({ orderBy: { lastRunAt: 'desc' }, distinct: ['botName'] }),
      prisma.fraudReport.count({ where: { status: 'OPEN' } }),
    ])

    // Aggregate commission (simulated revenue) from affiliates
    const affiliates = await prisma.affiliateLink.findMany({ where: { status: true } })
    const totalRevenue = affiliates.reduce((sum, a) => sum + (a.clicksCount * a.commissionRate * 10), 0)

    // Sector-wise complaint breakdown
    const complaintsByFOOD = await prisma.complaint.count({ where: { sector: 'FOOD' } })
    const complaintsByRIDE = await prisma.complaint.count({ where: { sector: 'RIDE' } })
    const complaintsBySKINCARE = await prisma.complaint.count({ where: { sector: 'SKINCARE' } })

    // Scraper online/offline
    const onlineScrapers = scraperLogs.filter(s => s.status === 'ONLINE').length
    const offlineScrapers = scraperLogs.filter(s => s.status === 'OFFLINE' || s.status === 'FAILING').length

    // Average offer discount
    const avgDiscount = offerMatrixSettings.length
      ? (offerMatrixSettings.reduce((s, o) => s + o.discountPercentage, 0) / offerMatrixSettings.length).toFixed(1)
      : 0

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, merchants: totalMerchants },
        deals: { pending: pendingDeals, approved: approvedDeals },
        complaints: {
          total: totalComplaints,
          open: openComplaints,
          byFOOD: complaintsByFOOD,
          byRIDE: complaintsByRIDE,
          bySKINCARE: complaintsBySKINCARE,
        },
        affiliates: { active: activeAffiliates },
        revenue: { totalFormatted: `৳${(totalRevenue / 1000).toFixed(0)}k`, raw: totalRevenue },
        scrapers: { total: scraperLogs.length, online: onlineScrapers, offline: offlineScrapers },
        offerMatrix: { activeSettings: offerMatrixSettings.length, avgDiscount: parseFloat(avgDiscount) },
        fraud: { openReports: fraudReports },
      },
    })
  } catch (err) {
    console.error('[DASHBOARD] metrics error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch metrics.' })
  }
}
