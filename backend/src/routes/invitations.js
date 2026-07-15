const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const { checkPlanActive, checkInvitationLimit } = require('../middleware/planLimits')
const { body, validationResult } = require('express-validator')

// GET /api/invitations/by-id/:id — fetch own invitation by UUID (auth required)
router.get('/by-id/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invitations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Invitation not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/invitations/:slug — public, fetch by slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invitations WHERE slug = $1 AND is_published = true',
      [req.params.slug]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Invitation not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/invitations — list own invitations (auth required)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM invitations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/invitations — create new invitation
router.post('/', auth, checkPlanActive, checkInvitationLimit, [
  body('bride_name').trim().notEmpty(),
  body('groom_name').trim().notEmpty(),
  body('wedding_date').notEmpty(),
  body('slug').trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const {
    slug, bride_name, groom_name, wedding_date,
    akad_date, akad_time, akad_venue,
    reception_date, reception_time, reception_venue,
    venue_lat, venue_lng, theme_slug, palette_slug,
  } = req.body

  try {
    const exists = await pool.query('SELECT id FROM invitations WHERE slug = $1', [slug])
    if (exists.rows.length) return res.status(409).json({ error: 'Slug already taken' })

    const id = uuidv4()
    const result = await pool.query(
      `INSERT INTO invitations
        (id, user_id, slug, bride_name, groom_name, wedding_date,
         akad_date, akad_time, akad_venue,
         reception_date, reception_time, reception_venue,
         venue_lat, venue_lng, theme_slug, palette_slug)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [id, req.user.userId, slug, bride_name, groom_name, wedding_date,
       akad_date || null, akad_time || null, akad_venue || null,
       reception_date || null, reception_time || null, reception_venue || null,
       venue_lat || null, venue_lng || null, theme_slug || 'gold', palette_slug || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/invitations/:id — update invitation
router.put('/:id', auth, async (req, res) => {
  const fields = [
    'bride_name','groom_name','wedding_date',
    'akad_date','akad_time','akad_venue',
    'reception_date','reception_time','reception_venue',
    'venue_lat','venue_lng','cover_photo_url','music_url',
    'theme_slug','palette_slug','is_published',
    'gallery_photos','love_story','gift_accounts',
    'bride_full_name','groom_full_name','bride_bio','groom_bio',
    'bride_father','bride_mother','groom_father','groom_mother',
    'timeline','contact_number',
  ]
  const updates = []
  const values  = []
  let i = 1

  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = $${i++}`)
      values.push(req.body[f])
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' })

  values.push(req.params.id, req.user.userId)
  try {
    const result = await pool.query(
      `UPDATE invitations SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${i} AND user_id = $${i + 1} RETURNING *`,
      values
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/invitations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM invitations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
