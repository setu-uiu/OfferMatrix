import jwt from 'jsonwebtoken'

/**
 * Validates Authorization: Bearer <token>
 * Attaches decoded { id, email, role } to req.user
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please log in again.' })
    }
    return res.status(401).json({ success: false, error: 'Invalid token.' })
  }
}

/**
 * Requires req.user.role === 'ADMIN'
 * Must be used after authenticateToken
 */
export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' })
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Access forbidden. Admin role required.' })
  }
  next()
}
