require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const morgan    = require('morgan')
const rateLimit = require('express-rate-limit')
const pool      = require('./config/db')

const app  = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())

// CORS — whitelist allowed origins via ALLOWED_ORIGINS env var
// e.g. ALLOWED_ORIGINS=https://pelaminan.id,https://www.pelaminan.id
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, same-server SSR)
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', require('express').static(process.env.UPLOAD_DIR || '/app/uploads'))

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
app.use('/api/rsvp', rateLimit({ windowMs: 60 * 1000, max: 10 }))

// Routes
app.use('/api/auth',        require('./routes/auth'))
app.use('/api/invitations', require('./routes/invitations'))
app.use('/api/rsvp',        require('./routes/rsvp'))
app.use('/api/wishes',      require('./routes/wishes'))
app.use('/api/uploads',     require('./routes/uploads'))
app.use('/api/analytics',   require('./routes/analytics'))
app.use('/api/reminders',   require('./routes/reminders'))
app.use('/api/domains',     require('./routes/domains'))

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// DB init — run migrations on startup
async function initDb() {
  const fs   = require('fs')
  const path = require('path')
  const migrationsDir = path.join(__dirname, '..', 'migrations')

  if (!fs.existsSync(migrationsDir)) return

  const files = fs.readdirSync(migrationsDir).sort()
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    try {
      await pool.query(sql)
      console.log(`✓ Migration: ${file}`)
    } catch (err) {
      // Ignore "already exists" errors
      if (!err.message.includes('already exists')) {
        console.error(`✗ Migration ${file}:`, err.message)
      }
    }
  }
}

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`)
  })
})
