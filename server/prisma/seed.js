import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Admin User ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@2026', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@offermatrix.bd' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@offermatrix.bd',
      passwordHash,
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  })
  console.log('Admin user created:', admin.email)

  // ── Sample Users (for complaints) ─────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'farhan@gmail.com' }, update: { complainCount: 2 }, create: { name: 'Farhan Hossain', email: 'farhan@gmail.com', passwordHash: await bcrypt.hash('user1234', 10), complainCount: 2 } }),
    prisma.user.upsert({ where: { email: 'tasnim@gmail.com' }, update: { complainCount: 5 }, create: { name: 'Tasnim Akter', email: 'tasnim@gmail.com', passwordHash: await bcrypt.hash('user1234', 10), complainCount: 5 } }),
    prisma.user.upsert({ where: { email: 'rifat@gmail.com' }, update: { complainCount: 1 }, create: { name: 'Rifat Islam', email: 'rifat@gmail.com', passwordHash: await bcrypt.hash('user1234', 10), complainCount: 1 } }),
    prisma.user.upsert({ where: { email: 'nadia@gmail.com' }, update: { complainCount: 8 }, create: { name: 'Nadia Sultana', email: 'nadia@gmail.com', passwordHash: await bcrypt.hash('user1234', 10), complainCount: 8, accountStatus: 'WARNING' } }),
    prisma.user.upsert({ where: { email: 'karim@gmail.com' }, update: { complainCount: 12 }, create: { name: 'Karim Sheikh', email: 'karim@gmail.com', passwordHash: await bcrypt.hash('user1234', 10), complainCount: 12, accountStatus: 'SUSPENDED' } }),
  ])
  console.log('Sample users created')

  // ── Offer Matrix Settings ─────────────────────────────────
  const offerMatrixData = [
    // FOOD
    { sector: 'FOOD', providerName: 'Foodie', discountPercentage: 15.0, validityDays: 7 },
    { sector: 'FOOD', providerName: 'Pathao', discountPercentage: 12.5, validityDays: 3 },
    { sector: 'FOOD', providerName: 'Foodpanda', discountPercentage: 20.0, validityDays: 14 },
    // RIDE
    { sector: 'RIDE', providerName: 'Uber', discountPercentage: 10.0, validityDays: 5 },
    { sector: 'RIDE', providerName: 'Obhai', discountPercentage: 18.0, validityDays: 7 },
    { sector: 'RIDE', providerName: 'InDriver', discountPercentage: 22.0, validityDays: 3 },
    // SKINCARE
    { sector: 'SKINCARE', providerName: 'Choice Legacy', discountPercentage: 25.0, validityDays: 30 },
    { sector: 'SKINCARE', providerName: 'Kirei', discountPercentage: 30.0, validityDays: 14 },
    { sector: 'SKINCARE', providerName: 'Makeup Chari', discountPercentage: 20.0, validityDays: 21 },
  ]

  for (const data of offerMatrixData) {
    const existing = await prisma.offerMatrixSetting.findFirst({ where: { sector: data.sector, providerName: data.providerName } })
    if (!existing) {
      await prisma.offerMatrixSetting.create({ data: { ...data, updatedById: admin.id } })
    }
  }
  console.log('Offer matrix settings seeded')

  // ── Complaints ────────────────────────────────────────────
  const complaintsData = [
    { userId: users[0].id, sector: 'FOOD', serviceProvider: 'Foodpanda', orderOrRideId: 'FP-2026-8821', subject: 'Wrong order delivered', description: 'I ordered a chicken burger but received a fish sandwich. The delivery was also 45 minutes late.', status: 'OPEN' },
    { userId: users[1].id, sector: 'FOOD', serviceProvider: 'Pathao Food', orderOrRideId: 'PF-2026-3341', subject: 'Food was cold on arrival', description: 'The biryani was completely cold when delivered. The packaging was also damaged.', status: 'UNDER_REVIEW' },
    { userId: users[2].id, sector: 'RIDE', serviceProvider: 'Uber', orderOrRideId: 'UB-2026-9912', subject: 'Driver took wrong route', description: 'Driver deliberately took a longer route to increase fare. Trip was 3x longer than usual.', status: 'OPEN' },
    { userId: users[3].id, sector: 'RIDE', serviceProvider: 'Obhai', orderOrRideId: 'OB-2026-5521', subject: 'Driver was rude and unprofessional', description: 'The driver was verbally abusive throughout the trip and refused to turn on AC despite extreme heat.', status: 'OPEN' },
    { userId: users[4].id, sector: 'SKINCARE', serviceProvider: 'Kirei', orderOrRideId: 'KR-2026-1142', subject: 'Counterfeit product delivered', description: 'The Kirei serum I received appears to be a fake. The packaging is slightly different from genuine product and has a strange smell.', status: 'UNDER_REVIEW' },
    { userId: users[1].id, sector: 'SKINCARE', serviceProvider: 'Choice Legacy', orderOrRideId: 'CL-2026-7743', subject: 'Product caused allergic reaction', description: 'The moisturizer caused severe redness and itching on my skin. I had to visit a dermatologist.', status: 'OPEN' },
    { userId: users[0].id, sector: 'FOOD', serviceProvider: 'Foodie', orderOrRideId: 'FD-2026-2210', subject: 'Coupon not applied at checkout', description: 'Used promo code FOODIE20 but it was not deducted from my bill despite being valid.', status: 'RESOLVED', adminResponse: 'We have verified the coupon issue and issued a full refund to your account. The technical team has been notified.', resolvedAt: new Date() },
    { userId: users[3].id, sector: 'RIDE', serviceProvider: 'InDriver', orderOrRideId: 'ID-2026-8834', subject: 'Driver cancelled after accepting', description: 'Driver accepted my ride and then cancelled after 10 minutes of waiting. I was late for an important meeting.', status: 'OPEN' },
    { userId: users[2].id, sector: 'SKINCARE', serviceProvider: 'Makeup Chari', orderOrRideId: 'MC-2026-4421', subject: 'Wrong shade delivered', description: 'Ordered Foundation Shade 3 but received Shade 7. No response from seller for 3 days.', status: 'DISMISSED' },
    { userId: users[4].id, sector: 'FOOD', serviceProvider: 'Foodpanda', orderOrRideId: 'FP-2026-9983', subject: 'Restaurant cancelled without notice', description: 'Order was auto-cancelled by the restaurant 30 minutes after placing. No notification was sent. Money was debited.', status: 'UNDER_REVIEW' },
  ]

  for (const c of complaintsData) {
    await prisma.complaint.create({ data: c })
  }
  console.log('Complaints seeded')

  // ── Deals ─────────────────────────────────────────────────
  const dealsData = [
    { title: 'Daraz Flash Sale — Samsung A55 ৳8k Off', merchant: 'Daraz', sector: 'SKINCARE', originalPrice: 46000, discountedPrice: 38000, discountPercent: 17.4, affiliateUrl: 'https://daraz.com.bd', status: 'PENDING', submittedById: users[0].id },
    { title: 'Pizza Place BOGO on Large Pizzas', merchant: 'Pizza Place Dhanmondi', sector: 'FOOD', originalPrice: 800, discountedPrice: 400, discountPercent: 50, status: 'PENDING', submittedById: users[1].id },
    { title: 'Shajgoj 30% Off Korean Skincare — SHAJGOJ30', merchant: 'Shajgoj', sector: 'SKINCARE', originalPrice: 2000, discountedPrice: 1400, discountPercent: 30, couponCode: 'SHAJGOJ30', affiliateUrl: 'https://shajgoj.com', status: 'PENDING', submittedById: users[2].id },
    { title: 'StarTech Anker 737 In-Store ৳900 Off', merchant: 'StarTech', sector: 'RIDE', originalPrice: 6100, discountedPrice: 5200, discountPercent: 14.8, status: 'PENDING', submittedById: users[2].id },
    { title: 'Pathao Food ৳100 Off — PATHAONEW', merchant: 'Pathao', sector: 'FOOD', originalPrice: 500, discountedPrice: 400, discountPercent: 20, couponCode: 'PATHAONEW', status: 'APPROVED', submittedById: users[0].id },
    { title: 'Chaldal Free Delivery Over ৳499', merchant: 'Chaldal', sector: 'FOOD', originalPrice: 499, discountedPrice: 449, discountPercent: 10, status: 'APPROVED', submittedById: users[3].id },
  ]

  for (const d of dealsData) {
    await prisma.deal.create({ data: d })
  }
  console.log('Deals seeded')

  // ── Scraper Logs ──────────────────────────────────────────
  const scraperData = [
    { botName: 'Daraz', targetUrl: 'https://daraz.com.bd', status: 'ONLINE', responseLatencyMs: 320, itemsScrapedCount: 12840, lastRunAt: new Date() },
    { botName: 'Shajgoj', targetUrl: 'https://shajgoj.com', status: 'THROTTLED', responseLatencyMs: 1240, itemsScrapedCount: 3640, lastError: 'HTTP 429: Rate limited', lastRunAt: new Date(Date.now() - 15*60*1000) },
    { botName: 'Chaldal', targetUrl: 'https://chaldal.com', status: 'OFFLINE', responseLatencyMs: 0, itemsScrapedCount: 0, lastError: 'HTTP 503: Service Unavailable. Retry 3/3 failed.', lastRunAt: new Date(Date.now() - 2*60*60*1000) },
    { botName: 'StarTech', targetUrl: 'https://startech.com.bd', status: 'ONLINE', responseLatencyMs: 210, itemsScrapedCount: 8920, lastRunAt: new Date(Date.now() - 5*60*1000) },
    { botName: 'Pathao', targetUrl: 'https://api.pathao.com', status: 'ONLINE', responseLatencyMs: 85, itemsScrapedCount: 2200, lastRunAt: new Date(Date.now() - 1*60*1000) },
    { botName: 'Ogerio', targetUrl: 'https://ogerio.com', status: 'FAILING', responseLatencyMs: 890, itemsScrapedCount: 2100, lastError: '3 product pages returned 404', lastRunAt: new Date(Date.now() - 8*60*1000) },
    { botName: 'Pickaboo', targetUrl: 'https://pickaboo.com', status: 'ONLINE', responseLatencyMs: 175, itemsScrapedCount: 5640, lastRunAt: new Date(Date.now() - 3*60*1000) },
    { botName: 'Rokomari', targetUrl: 'https://rokomari.com', status: 'ONLINE', responseLatencyMs: 290, itemsScrapedCount: 3820, lastRunAt: new Date(Date.now() - 4*60*1000) },
  ]

  for (const s of scraperData) {
    await prisma.scraperLog.create({ data: s })
  }
  console.log('Scraper logs seeded')

  // ── Affiliate Links ───────────────────────────────────────
  const affiliateData = [
    { partnerName: 'Daraz', originalDomain: 'daraz.com.bd', commissionRate: 5.5, trackingUrl: 'https://s.click.aliexpress.com/om_daraz', clicksCount: 18420, conversionsCount: 1842, status: true },
    { partnerName: 'Shajgoj', originalDomain: 'shajgoj.com', commissionRate: 8.0, trackingUrl: 'https://track.om/shajgoj', clicksCount: 5640, conversionsCount: 451, status: true },
    { partnerName: 'Pickaboo', originalDomain: 'pickaboo.com', commissionRate: 4.0, trackingUrl: 'https://track.om/pickaboo', clicksCount: 9840, conversionsCount: 820, status: true },
    { partnerName: 'Rokomari', originalDomain: 'rokomari.com', commissionRate: 6.0, trackingUrl: 'https://track.om/rokomari', clicksCount: 3180, conversionsCount: 254, status: true },
    { partnerName: 'Chaldal', originalDomain: 'chaldal.com', commissionRate: 4.5, trackingUrl: 'https://track.om/chaldal', clicksCount: 2840, conversionsCount: 198, status: false },
  ]

  for (const a of affiliateData) {
    await prisma.affiliateLink.create({ data: a })
  }
  console.log('Affiliate links seeded')

  // ── Fraud Reports ─────────────────────────────────────────
  await prisma.fraudReport.createMany({
    data: [
      { incidentId: 'FR-2026-001', targetIp: '103.42.108.221', partnerName: 'TechShop BD', reason: 'Click injection pattern detected — 25.7% flag rate', riskScore: 87.4, status: 'OPEN' },
      { incidentId: 'FR-2026-002', targetIp: '45.76.123.88', partnerName: 'FashionHub', reason: 'Cookie stuffing events detected across 2,100 sessions', riskScore: 71.2, status: 'INVESTIGATING' },
      { incidentId: 'FR-2026-003', targetIp: '192.168.44.12', partnerName: 'GadgetZone', reason: 'Fake conversion signals — 7.5% abnormal rate', riskScore: 42.8, status: 'RESOLVED' },
    ],
    skipDuplicates: true,
  })
  console.log('Fraud reports seeded')

  console.log('Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
