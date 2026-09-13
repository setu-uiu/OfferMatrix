import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'

import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import complaintsRoutes from './routes/complaints.js'
import offerMatrixRoutes from './routes/offerMatrix.js'
import dealsRoutes from './routes/deals.js'
import scrapersRoutes from './routes/scrapers.js'
import affiliatesRoutes from './routes/affiliates.js'
import fraudRoutes from './routes/fraud.js'
import usersRoutes from './routes/users.js'

const app = express()

// ── Security ─────────────────────────────────────────────
app.use(helmet())

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Global Rate Limit ─────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
})
app.use(globalLimiter)

// ── Strict rate limit for auth ────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again in 15 minutes.' },
})

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/admin/dashboard', dashboardRoutes)
app.use('/api/admin/complaints', complaintsRoutes)
app.use('/api/admin/offer-matrix', offerMatrixRoutes)
app.use('/api/admin/deals', dealsRoutes)
app.use('/api/admin/scrapers', scrapersRoutes)
app.use('/api/admin/affiliates', affiliatesRoutes)
app.use('/api/admin/fraud', fraudRoutes)
app.use('/api/admin/users', usersRoutes)

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'OfferMatrix API running', timestamp: new Date().toISOString() })
})

// ── 404 ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// ── Global Error Handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' })
})

export default app
