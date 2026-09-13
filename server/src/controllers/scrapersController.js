import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/scrapers
export async function listScrapers(req, res) {
  try {
    // Get latest log per botName
    const all = await prisma.scraperLog.findMany({
      orderBy: { lastRunAt: 'desc' },
    })

    // Deduplicate by botName (keep latest)
    const seen = new Set()
    const scrapers = []
    for (const s of all) {
      if (!seen.has(s.botName)) {
        seen.add(s.botName)
        scrapers.push(s)
      }
    }

    res.json({ success: true, data: scrapers })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch scraper health.' })
  }
}

// POST /api/admin/scrapers/trigger/:botName
export async function triggerScraper(req, res) {
  try {
    const { botName } = req.params

    // Simulate a scraper run
    const latency = Math.floor(Math.random() * 400) + 80
    const items = Math.floor(Math.random() * 500) + 100
    const success = Math.random() > 0.15 // 85% success rate

    const log = await prisma.scraperLog.create({
      data: {
        botName,
        targetUrl: `https://${botName.toLowerCase().replace(/\s/g, '')}.com`,
        status: success ? 'ONLINE' : 'FAILING',
        responseLatencyMs: latency,
        itemsScrapedCount: success ? items : 0,
        lastError: success ? null : 'Simulated: Connection timeout after 30s',
        lastRunAt: new Date(),
      },
    })

    res.json({
      success: true,
      data: log,
      message: success
        ? `${botName} scraper ran successfully. ${items} items indexed in ${latency}ms.`
        : `${botName} scraper failed. Connection timeout.`,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to trigger scraper.' })
  }
}
