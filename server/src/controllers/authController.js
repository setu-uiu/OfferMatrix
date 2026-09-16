import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ── Hardcoded admin (no DB required) ─────────────────────
const ADMIN_EMAIL = 'admin@offermatrix.bd'
const ADMIN_PASSWORD_HASH = await bcrypt.hash('Admin@2026', 10)

const ADMIN_USER = {
  id: 'admin-001',
  name: 'Super Admin',
  email: ADMIN_EMAIL,
  role: 'ADMIN',
  accountStatus: 'ACTIVE',
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' })
    }

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' })
    }

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { id: ADMIN_USER.id, email: ADMIN_USER.email, role: ADMIN_USER.role, name: ADMIN_USER.name },
      process.env.JWT_SECRET || 'offermatrix_admin_super_secret_2026_xK9mP2nQ',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: ADMIN_USER,
      },
    })
  } catch (err) {
    console.error('[AUTH] Login error:', err)
    res.status(500).json({ success: false, error: 'Internal server error.' })
  }
}
