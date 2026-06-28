const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production'

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
