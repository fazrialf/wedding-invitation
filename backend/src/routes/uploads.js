const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')

const uploadDir = process.env.UPLOAD_DIR || '/uploads'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const fileFilter = (_, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3']
  cb(null, allowed.includes(file.mimetype))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

// POST /api/uploads/photo
router.post('/photo', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' })
  const url = `${process.env.BASE_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
})

// POST /api/uploads/music
router.post('/music', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' })
  const url = `${process.env.BASE_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
})

module.exports = router
