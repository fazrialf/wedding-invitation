const router      = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const pool        = require('../config/db')
const auth        = require('../middleware/auth')
const nodemailer  = require('nodemailer')
const { body, validationResult } = require('express-validator')

// Build transporter from env
function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// POST /api/reminders/email — send email reminders
router.post('/email', auth, [
  body('invitation_id').notEmpty(),
  body('recipients').isArray({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { invitation_id, recipients, subject, message } = req.body

  // Verify ownership
  const own = await pool.query(
    'SELECT id, bride_name, groom_name, slug FROM invitations WHERE id=$1 AND user_id=$2',
    [invitation_id, req.user.userId]
  )
  if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

  const inv = own.rows[0]
  const baseUrl = process.env.INVITATION_BASE_URL || 'http://localhost:8081'

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(503).json({ error: 'SMTP not configured. Set SMTP_USER and SMTP_PASS in .env' })
  }

  const transporter = getTransporter()
  const results = []

  for (const r of recipients) {
    const { name, email } = r
    if (!email) continue

    const link = `${baseUrl}/${inv.slug}?to=${encodeURIComponent(name)}`
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #292524;">
        <h1 style="font-family: 'Palatino', serif; font-size: 2.5rem; text-align: center; color: #292524; margin-bottom: 4px;">
          ${inv.bride_name} &amp; ${inv.groom_name}
        </h1>
        <p style="text-align: center; font-size: 0.75rem; letter-spacing: 0.3em; color: #a8a29e; margin-bottom: 32px;">
          WEDDING INVITATION
        </p>
        <p style="font-size: 1rem; line-height: 1.8; color: #57534e;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 1rem; line-height: 1.8; color: #57534e;">
          ${message || `We joyfully invite you to celebrate the wedding of ${inv.bride_name} and ${inv.groom_name}.`}
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${link}"
            style="display: inline-block; padding: 14px 40px; background: #292524; color: white; text-decoration: none;
                   font-family: 'Palatino', serif; font-size: 0.75rem; letter-spacing: 0.3em;">
            OPEN YOUR INVITATION
          </a>
        </div>
        <p style="text-align: center; font-size: 0.75rem; color: #a8a29e;">
          Or copy this link: ${link}
        </p>
      </div>
    `
    try {
      await transporter.sendMail({
        from:    `"${inv.bride_name} & ${inv.groom_name}" <${process.env.SMTP_USER}>`,
        to:      email,
        subject: subject || `Wedding Invitation — ${inv.bride_name} & ${inv.groom_name}`,
        html,
      })

      // Log to DB
      await pool.query(
        `INSERT INTO reminders (id, invitation_id, reminder_type, recipient_name, recipient, message, sent, sent_at)
         VALUES ($1,$2,'email',$3,$4,$5,true,NOW())`,
        [uuidv4(), invitation_id, name, email, message || '']
      )
      results.push({ name, email, status: 'sent' })
    } catch (err) {
      results.push({ name, email, status: 'failed', error: err.message })
    }
  }

  res.json({ results })
})

// GET /api/reminders/:invitationId — list sent reminders (auth)
router.get('/:invitationId', auth, async (req, res) => {
  try {
    const own = await pool.query(
      'SELECT id FROM invitations WHERE id=$1 AND user_id=$2',
      [req.params.invitationId, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    const result = await pool.query(
      'SELECT * FROM reminders WHERE invitation_id=$1 ORDER BY created_at DESC',
      [req.params.invitationId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
