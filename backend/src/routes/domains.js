const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

// GET /api/domains/:invitationId — get custom domain for invitation
router.get('/:invitationId', auth, async (req, res) => {
  try {
    const own = await pool.query(
      'SELECT id FROM invitations WHERE id=$1 AND user_id=$2',
      [req.params.invitationId, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    const result = await pool.query(
      'SELECT * FROM custom_domains WHERE invitation_id=$1',
      [req.params.invitationId]
    )
    res.json(result.rows[0] || null)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/domains — add/update custom domain
router.post('/', auth, [
  body('invitation_id').notEmpty(),
  body('domain').trim().notEmpty()
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid domain format'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { invitation_id, domain } = req.body
  const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')

  try {
    const own = await pool.query(
      'SELECT id, slug FROM invitations WHERE id=$1 AND user_id=$2',
      [invitation_id, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    // Upsert
    const result = await pool.query(
      `INSERT INTO custom_domains (id, invitation_id, domain, verified)
       VALUES ($1,$2,$3,false)
       ON CONFLICT (invitation_id)
       DO UPDATE SET domain=$3, verified=false
       RETURNING *`,
      [uuidv4(), invitation_id, cleanDomain]
    )

    // Generate DNS instructions
    const serverIp = process.env.SERVER_IP || ''
    res.json({
      domain: result.rows[0],
      dns_instructions: {
        type:  'A',
        name:  '@',
        value: serverIp,
        note:  `Point ${cleanDomain} → ${serverIp} with an A record. TTL: 300.`,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/domains/verify/:id — check DNS + mark verified
router.post('/verify/:id', auth, async (req, res) => {
  const dns = require('dns').promises

  try {
    const result = await pool.query(
      `SELECT cd.*, i.user_id FROM custom_domains cd
       JOIN invitations i ON i.id = cd.invitation_id
       WHERE cd.id=$1`,
      [req.params.id]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    if (result.rows[0].user_id !== req.user.userId) return res.status(403).json({ error: 'Forbidden' })

    const { domain } = result.rows[0]
    const serverIp   = process.env.SERVER_IP || ''

    let verified = false
    try {
      const addresses = await dns.resolve4(domain)
      verified = addresses.includes(serverIp)
    } catch {
      verified = false
    }

    if (verified) {
      await pool.query('UPDATE custom_domains SET verified=true WHERE id=$1', [req.params.id])
    }

    res.json({ verified, domain, expected_ip: serverIp })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/domains/:invitationId — remove custom domain
router.delete('/:invitationId', auth, async (req, res) => {
  try {
    const own = await pool.query(
      'SELECT id FROM invitations WHERE id=$1 AND user_id=$2',
      [req.params.invitationId, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    await pool.query('DELETE FROM custom_domains WHERE invitation_id=$1', [req.params.invitationId])
    res.json({ message: 'Domain removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
