/**
 * Plan limits middleware — enforces freemium gates based on users.plan
 *
 * Limits per plan:
 *   free     — 1 invitation, 50 RSVP responses, 3 months active
 *   starter  — 3 invitations, 200 RSVP responses, 6 months active
 *   standard — 10 invitations, unlimited RSVP, 1 year active
 *   premium  — unlimited invitations, unlimited RSVP, 2 years active
 */

const pool = require('../config/db')

const PLAN_LIMITS = {
  free:     { invitations: 1,  rsvp: 50,  months: 3  },
  starter:  { invitations: 3,  rsvp: 200, months: 6  },
  standard: { invitations: 10, rsvp: null, months: 12 },
  premium:  { invitations: null, rsvp: null, months: 24 },
}

/**
 * Checks if the authenticated user's plan is still active (not expired).
 * Attaches req.planLimits for downstream middleware.
 */
async function checkPlanActive(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT plan, plan_expires_at FROM users WHERE id = $1',
      [req.user.userId]
    )
    if (!result.rows.length) return res.status(401).json({ error: 'User not found' })

    const { plan, plan_expires_at } = result.rows[0]
    const userPlan = plan || 'free'

    // Check expiry
    if (plan_expires_at && new Date(plan_expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Plan expired',
        code: 'PLAN_EXPIRED',
        plan: userPlan,
        expired_at: plan_expires_at,
        message: 'Your plan has expired. Please upgrade to continue.',
      })
    }

    req.userPlan   = userPlan
    req.planLimits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free
    next()
  } catch (err) {
    console.error('planLimits.checkPlanActive:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * Enforces invitation count limit for POST /api/invitations.
 * Must run after checkPlanActive.
 */
async function checkInvitationLimit(req, res, next) {
  const limit = req.planLimits?.invitations
  if (limit === null || limit === undefined) return next() // unlimited

  try {
    const count = await pool.query(
      'SELECT COUNT(*) FROM invitations WHERE user_id = $1',
      [req.user.userId]
    )
    const current = parseInt(count.rows[0].count, 10)
    if (current >= limit) {
      return res.status(403).json({
        error: 'Invitation limit reached',
        code: 'INVITATION_LIMIT',
        plan: req.userPlan,
        limit,
        current,
        message: `Your ${req.userPlan} plan allows up to ${limit} invitation(s). Upgrade to create more.`,
      })
    }
    next()
  } catch (err) {
    console.error('planLimits.checkInvitationLimit:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * Enforces RSVP count limit for POST /api/rsvp.
 * Must run after checkPlanActive — looks up the invitation owner's plan.
 */
async function checkRsvpLimit(req, res, next) {
  try {
    // Get the invitation owner's plan
    const inv = await pool.query(
      `SELECT u.plan, u.plan_expires_at,
              (SELECT COUNT(*) FROM rsvp_responses WHERE invitation_id = i.id) AS rsvp_count
       FROM invitations i
       JOIN users u ON u.id = i.user_id
       WHERE i.id = $1`,
      [req.body.invitation_id]
    )
    if (!inv.rows.length) return res.status(404).json({ error: 'Invitation not found' })

    const { plan, plan_expires_at, rsvp_count } = inv.rows[0]
    const userPlan = plan || 'free'
    const limits   = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free

    // Check plan expiry
    if (plan_expires_at && new Date(plan_expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Invitation expired',
        code: 'PLAN_EXPIRED',
        message: 'This invitation is no longer accepting RSVPs.',
      })
    }

    // Check RSVP cap
    if (limits.rsvp !== null && parseInt(rsvp_count, 10) >= limits.rsvp) {
      return res.status(403).json({
        error: 'RSVP limit reached',
        code: 'RSVP_LIMIT',
        plan: userPlan,
        limit: limits.rsvp,
        current: parseInt(rsvp_count, 10),
        message: `This invitation has reached its RSVP limit of ${limits.rsvp}.`,
      })
    }

    next()
  } catch (err) {
    console.error('planLimits.checkRsvpLimit:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { checkPlanActive, checkInvitationLimit, checkRsvpLimit, PLAN_LIMITS }
