require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const productsRouter  = require('./routes/products')
const cartRouter      = require('./routes/cart')
const wishlistRouter  = require('./routes/wishlist')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite default
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products',  productsRouter)
app.use('/api/cart',      cartRouter)
app.use('/api/wishlist',  wishlistRouter)

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', message: 'OfferMatrix API is running', timestamp: new Date().toISOString() })
)

// 404 handler
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
)

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅  OfferMatrix API running on http://localhost:${PORT}`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/products          (query: store, category, q)`)
  console.log(`   GET  /api/products/:id`)
  console.log(`   GET  /api/cart?session=<id>`)
  console.log(`   POST /api/cart`)
  console.log(`   GET  /api/wishlist?session=<id>`)
  console.log(`   POST /api/wishlist`)
})
