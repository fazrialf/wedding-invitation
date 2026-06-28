const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

// GET /api/wishes/:invitationId — public, approved only
router.get('/:invitationId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, guest_name, message, created_at FROM wishes
       WHERE invitation_id = $1 AND is_approved = true
       ORDER BY created_at DESC LIMIT 50`,
      [req.params.invitationId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/wishes/all/:invitationId — all wishes for owner (auth required)
router.get('/all/:invitationId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wishes
       WHERE invitation_id = $1
       ORDER BY created_at DESC`,
      [req.params.invitationId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/wishes — submit a wish
router.post('/', [
  body('invitation_id').notEmpty(),
  body('guest_name').trim().notEmpty(),
  body('message').trim().notEmpty().isLength({ max: 500 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { invitation_id, guest_name, message } = req.body
  try {
    const id = uuidv4()
    const result = await pool.query(
      `INSERT INTO wishes (id, invitation_id, guest_name, message, is_approved)
       VALUES ($1,$2,$3,$4, true) RETURNING *`,
      [id, invitation_id, guest_name, message]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/wishes/:id — toggle approval (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE wishes SET is_approved = $1 WHERE id = $2 RETURNING *`,
      [req.body.is_approved, req.params.id]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/wishes/:id — delete wish (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM wishes WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
