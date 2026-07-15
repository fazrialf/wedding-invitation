const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const { checkRsvpLimit } = require('../middleware/planLimits')
const { body, validationResult } = require('express-validator')

// POST /api/rsvp — submit RSVP
router.post('/', checkRsvpLimit, [
  body('invitation_id').notEmpty(),
  body('guest_name').trim().notEmpty().escape(),
  body('attendance').isIn(['hadir', 'tidak']),
  body('guest_count').optional().isInt({ min: 1, max: 20 }),
  body('message').optional().trim().isLength({ max: 500 }).escape(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { invitation_id, guest_name, attendance, guest_count, message } = req.body
  try {
    const id = uuidv4()
    const result = await pool.query(
      `INSERT INTO rsvp_responses (id, invitation_id, guest_name, attendance, guest_count, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, invitation_id, guest_name, attendance, guest_count || 1, message || '']
    )

    // Also insert into wishes table if message is non-empty (for UCAPAN wall)
    if (message && message.trim()) {
      try {
        await pool.query(
          `INSERT INTO wishes (id, invitation_id, guest_name, message, is_approved)
           VALUES ($1,$2,$3,$4, true)`,
          [uuidv4(), invitation_id, guest_name, message.trim()]
        )
      } catch (wishErr) {
        console.error('Failed to insert wish from RSVP:', wishErr)
      }
    }

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/rsvp/:invitationId — get RSVPs (owner auth required)
router.get('/:invitationId', auth, async (req, res) => {
  try {
    // Verify the invitation belongs to the requesting user
    const own = await pool.query(
      'SELECT id FROM invitations WHERE id=$1 AND user_id=$2',
      [req.params.invitationId, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    const result = await pool.query(
      'SELECT * FROM rsvp_responses WHERE invitation_id = $1 ORDER BY created_at DESC',
      [req.params.invitationId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
