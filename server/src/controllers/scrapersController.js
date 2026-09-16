import { load, save } from '../store.js'

const DEFAULTS = [
  { id: 'sc-001', botName: 'Daraz',    targetUrl: 'https://daraz.com.bd',    status: 'ONLINE',    responseLatencyMs: 320,  itemsScrapedCount: 12840, lastError: null,                                          lastRunAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-002', botName: 'Shajgoj',  targetUrl: 'https://shajgoj.com',     status: 'THROTTLED', responseLatencyMs: 1240, itemsScrapedCount: 3640,  lastError: 'HTTP 429: Rate limited',                        lastRunAt: new Date(Date.now() - 15*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-003', botName: 'Chaldal',  targetUrl: 'https://chaldal.com',     status: 'OFFLINE',   responseLatencyMs: 0,    itemsScrapedCount: 0,     lastError: 'HTTP 503: Service Unavailable. Retry 3/3 failed.', lastRunAt: new Date(Date.now() - 2*60*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-004', botName: 'StarTech', targetUrl: 'https://startech.com.bd', status: 'ONLINE',    responseLatencyMs: 210,  itemsScrapedCount: 8920,  lastError: null,                                          lastRunAt: new Date(Date.now() - 5*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-005', botName: 'Pathao',   targetUrl: 'https://api.pathao.com',  status: 'ONLINE',    responseLatencyMs: 85,   itemsScrapedCount: 2200,  lastError: null,                                          lastRunAt: new Date(Date.now() - 1*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-006', botName: 'Ogerio',   targetUrl: 'https://ogerio.com',      status: 'FAILING',   responseLatencyMs: 890,  itemsScrapedCount: 2100,  lastError: '3 product pages returned 404',                  lastRunAt: new Date(Date.now() - 8*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-007', botName: 'Pickaboo', targetUrl: 'https://pickaboo.com',    status: 'ONLINE',    responseLatencyMs: 175,  itemsScrapedCount: 5640,  lastError: null,                                          lastRunAt: new Date(Date.now() - 3*60*1000).toISOString(), createdAt: new Date().toISOString() },
  { id: 'sc-008', botName: 'Rokomari', targetUrl: 'https://rokomari.com',    status: 'ONLINE',    responseLatencyMs: 290,  itemsScrapedCount: 3820,  lastError: null,                                          lastRunAt: new Date(Date.now() - 4*60*1000).toISOString(), createdAt: new Date().toISOString() },
]

// ── GET /api/admin/scrapers ───────────────────────────────
export async function listScrapers(req, res) {
  try {
    const scrapers = load('scrapers', DEFAULTS)
    res.json({ success: true, data: scrapers })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch scraper health.' })
  }
}

// ── POST /api/admin/scrapers/trigger/:botName ─────────────
export async function triggerScraper(req, res) {
  try {
    const { botName } = req.params
    const latency = Math.floor(Math.random() * 400) + 80
    const items = Math.floor(Math.random() * 500) + 100
    const success = Math.random() > 0.15

    const scrapers = load('scrapers', DEFAULTS)
    const scraper = scrapers.find(s => s.botName.toLowerCase() === botName.toLowerCase())
    if (scraper) {
      scraper.status = success ? 'ONLINE' : 'FAILING'
      scraper.responseLatencyMs = latency
      scraper.itemsScrapedCount = success ? items : 0
      scraper.lastError = success ? null : 'Simulated: Connection timeout after 30s'
      scraper.lastRunAt = new Date().toISOString()
      save('scrapers', scrapers)
    }

    res.json({
      success: true,
      data: scraper || { botName, status: success ? 'ONLINE' : 'FAILING' },
      message: success
        ? `${botName} scraper ran successfully. ${items} items indexed in ${latency}ms.`
        : `${botName} scraper failed. Connection timeout.`,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to trigger scraper.' })
  }
}
