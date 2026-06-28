const router  = require('express').Router()
const pool    = require('../config/db')
const auth    = require('../middleware/auth')

// POST /api/analytics/view — track a page view (public)
router.post('/view', async (req, res) => {
  const { invitation_id, guest_name } = req.body
  if (!invitation_id) return res.status(400).json({ error: 'invitation_id required' })

  try {
    const ip        = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || ''
    const userAgent = req.headers['user-agent'] || ''
    const referer   = req.headers['referer'] || ''

    await pool.query(
      `INSERT INTO page_views (invitation_id, guest_name, ip_address, user_agent, referer)
       VALUES ($1,$2,$3,$4,$5)`,
      [invitation_id, guest_name || null, ip.slice(0,64), userAgent.slice(0,256), referer.slice(0,256)]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/analytics/:invitationId — get stats for owner (auth)
router.get('/:invitationId', auth, async (req, res) => {
  const { invitationId } = req.params

  try {
    // Verify ownership
    const own = await pool.query(
      'SELECT id FROM invitations WHERE id=$1 AND user_id=$2',
      [invitationId, req.user.userId]
    )
    if (!own.rows.length) return res.status(403).json({ error: 'Forbidden' })

    const [views, rsvpStats, topGuests, viewsByDay] = await Promise.all([
      // Total views
      pool.query('SELECT COUNT(*) AS total FROM page_views WHERE invitation_id=$1', [invitationId]),

      // RSVP stats
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE attendance='hadir') AS attending,
           COUNT(*) FILTER (WHERE attendance='tidak') AS not_attending,
           COUNT(*) AS total
         FROM rsvp_responses WHERE invitation_id=$1`,
        [invitationId]
      ),

      // Top 5 named guests who opened
      pool.query(
        `SELECT guest_name, COUNT(*) AS opens
         FROM page_views
         WHERE invitation_id=$1 AND guest_name IS NOT NULL
         GROUP BY guest_name ORDER BY opens DESC LIMIT 5`,
        [invitationId]
      ),

      // Views per day (last 14 days)
      pool.query(
        `SELECT
           DATE(viewed_at) AS day,
           COUNT(*) AS views
         FROM page_views
         WHERE invitation_id=$1
           AND viewed_at >= NOW() - INTERVAL '14 days'
         GROUP BY day ORDER BY day`,
        [invitationId]
      ),
    ])

    const totalViews   = parseInt(views.rows[0].total)
    const rsvp         = rsvpStats.rows[0]
    const convRate     = totalViews > 0
      ? ((parseInt(rsvp.total) / totalViews) * 100).toFixed(1)
      : '0.0'

    res.json({
      total_views:      totalViews,
      rsvp_attending:   parseInt(rsvp.attending),
      rsvp_declining:   parseInt(rsvp.not_attending),
      rsvp_total:       parseInt(rsvp.total),
      conversion_rate:  convRate,
      top_guests:       topGuests.rows,
      views_by_day:     viewsByDay.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
