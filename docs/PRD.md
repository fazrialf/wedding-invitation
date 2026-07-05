# Product Requirements Document
## Digital Wedding Invitation SaaS Platform
**Version:** 1.0  
**Date:** July 2026  
**Author:** Fazrial  
**Status:** Draft

---

## 1. Executive Summary

A web-based SaaS platform for creating, customizing, and sharing beautiful digital wedding invitations. Targeting the Indonesian market primarily, with potential Southeast Asian expansion. The platform differentiates through deep cultural template coverage (adat/traditional styles), premium animations, WhatsApp-native sharing, and an affordable tiered pricing model.

**Market opportunity:** Global online invitation market valued at $1.2B (2023), projected $2.1B by 2030 (CAGR 8.3%). Indonesian digital invitation market estimated at Rp 500 billion potential (2025), driven by smartphone penetration and eco-conscious couples.

---

## 2. Problem Statement

Indonesian couples want beautiful, shareable digital wedding invitations but face:
- Generic global platforms (Canva, Paperless Post) with no Indonesian/adat templates
- Local competitors (Undangan.online, Loveweb.id) with limited template quality and no self-serve customization
- High cost for custom-built invitations (Rp 500K–2M via freelancers)
- Poor mobile experience on existing platforms
- No WhatsApp-native sharing workflow (primary comms channel in Indonesia)

---

## 3. Goals & Success Metrics

### Business Goals
- Reach 1,000 paying invitations within 6 months of launch
- Achieve Rp 50M Monthly Recurring Revenue within 12 months
- 70%+ mobile traffic (Indonesian audience is mobile-first)

### Product Goals
- Time to first published invitation: < 10 minutes
- RSVP open rate: > 60% (vs. email industry average ~25%)
- Net Promoter Score: > 50

### Technical Goals
- 99.9% uptime during wedding invitation active periods
- Page load < 2s on 4G mobile connection
- Zero critical security vulnerabilities at launch

---

## 4. Competitor Analysis

### 🌏 Global Players

**Paperless Post**
- Pricing: Free + coin system ($8–$75 packs) or $150/year unlimited
- Templates: 500+, general events
- Strengths: polish, tracking, paper add-on
- Gap: No Indonesian/Islamic templates, no WhatsApp integration, USD pricing

**Zola**
- Pricing: Free digital (bundled with wedding website)
- Templates: 1,000+ designs
- Strengths: all-in-one wedding suite (registry + website + invitations)
- Gap: US-centric, no adat templates, registry not relevant for Indonesia

**Canva**
- Pricing: Free / Pro $15/month
- Strengths: full design freedom, huge template library
- Gap: Not wedding-specific, no RSVP/guest management, no WhatsApp share, steep learning curve

**Greenvelope**
- Pricing: $20–$159/event, $99/year
- Strengths: luxury positioning, envelope-opening animation, celebrity use
- Gap: USD pricing, no Indonesia localization, no adat/Islamic templates

**Evite**
- Pricing: Free (ads) / $19.99–$29.99/event
- Strengths: large user base, streaming support
- Gap: US-focused, no local payment, no Indonesian wedding culture support

### 🇮🇩 Local Indonesian Players

**Undangan.online**
- Pricing: Rp 99K–249K (one-time per event)
- Templates: 50+
- Strengths: affordable, WhatsApp support, Indonesian language
- Gap: Manual order process (not self-serve), limited template quality, no live preview

**Undangan.id**
- Pricing: Rp 150K–350K (one-time)
- Templates: 100+
- Strengths: admin panel, 50K+ couples served, multi-language
- Gap: Dated UI, no self-serve customization wizard, Vue.js/Laravel stack (less modern)

**Loveweb.id**
- Pricing: Rp 175K–450K (one-time)
- Templates: 50+ with Lottie animations
- Strengths: Lottie animations, Next.js/Tailwind (modern stack), personalized guest URLs, Waze integration
- Gap: No live preview in editor, no plan/subscription model, expensive exclusive tier

**Kirim.email**
- Pricing: Free / Rp 99K–299K/month
- Focus: Email-centric, not mobile-web invitation
- Gap: Email-first approach doesn't match WhatsApp-dominant Indonesia

### 📊 Competitive Gap Summary

| Feature | Us | Undangan.id | Loveweb.id | Paperless Post |
|---|---|---|---|---|
| Self-serve wizard | ✅ | ❌ | ❌ | ✅ |
| Live phone preview | ✅ | ❌ | ❌ | ✅ |
| Adat/Islamic templates | ✅ | ✅ | ✅ | ❌ |
| WhatsApp share | 🔶 | ✅ | ✅ | ❌ |
| Lottie animations | ❌ | ❌ | ✅ | ❌ |
| Custom domain | ✅ | ✅ | ✅ | ❌ |
| Analytics dashboard | ✅ | ❌ | ❌ | ✅ |
| Guest management | ✅ | ✅ | ✅ | ✅ |
| Subscription model | ❌ | ❌ | ❌ | ✅ |
| IDR pricing | ❌ | ✅ | ✅ | ❌ |

---

## 5. Business Model Options

### Option A: One-Time Per-Event Payment (Market Standard)
**Model:** Customer pays once per wedding event. Access valid for 6–24 months.

Tiers:
- **Starter – Rp 99.000:** 10 templates, RSVP, wishes, galeri, maps, musik, 6 bulan aktif
- **Standard – Rp 179.000:** 30 templates, semua fitur Starter + countdown, analitik dasar, custom slug, 1 tahun aktif
- **Premium – Rp 299.000:** Semua template, semua fitur + custom domain, WhatsApp blast, analitik lengkap, live streaming, 2 tahun aktif

Pros: Easy to understand, matches local competitor pricing, low friction
Cons: No recurring revenue, hard to forecast, churn after event

**Verdict:** Best for initial market entry. What competitors do. Lowest friction to first purchase.

---

### Option B: Subscription SaaS
**Model:** Monthly/annual subscription for unlimited invitations (e.g., for wedding organizers or event planners).

Tiers:
- **Personal – Rp 49.000/bulan:** 1 active invitation, basic templates
- **Pro – Rp 149.000/bulan:** 5 active invitations, all templates, analytics
- **Business – Rp 499.000/bulan:** Unlimited invitations, white-label, API access, priority support

Pros: Predictable MRR, high LTV for WO/EO segment
Cons: Hard sell to individual couples (one-time need), long sales cycle for WOs

**Verdict:** Add as B2B tier for wedding organizers (WO) only. Not the primary model.

---

### Option C: Freemium + Upgrade
**Model:** Free plan (limited), upsell to paid per-event.

Free tier:
- 3 templates (basic only), no custom domain, with platform branding watermark
- RSVP limited to 50 guests
- Active for 3 months

Paid: Same as Option A tiers, starting Rp 99K

Pros: Viral loop (free users share invitations → exposure), lowers barrier to try
Cons: Infrastructure cost for free users, may dilute premium perception

**Verdict:** Include free tier as lead generation. Watermark = organic marketing.

---

### Option C: Add-On / À La Carte
**Model:** Base price + optional add-ons.

Base: Rp 99.000 (Standard invitation)
Add-ons:
- Custom domain: +Rp 50.000
- WhatsApp blast (up to 500 contacts): +Rp 75.000
- Live streaming embed: +Rp 50.000
- Premium animation pack: +Rp 49.000
- Extended active period (add 1 year): +Rp 49.000
- QR code undangan cetak: +Rp 25.000

Pros: Lower entry price, customers pay only for what they need, higher ARPU potential
Cons: Pricing complexity, harder to communicate value

**Verdict:** Layer this on top of Option A as upsells after purchase.

---

### 🎯 Recommended Business Model
**Primary:** One-time per-event (Option A) with 3 tiers at Rp 99K / 179K / 299K
**Secondary:** Freemium free tier for virality + watermark marketing
**Upsell:** À la carte add-ons for power users
**B2B:** Monthly subscription tier for Wedding Organizers (future Phase 3)

---

## 6. Recommended Roadmap

### Phase 1 — Production Hardening (2–3 weeks)
*"Make it safe to go live"*

**Security fixes (critical):**
- Lock `GET /api/rsvp/:invitationId` behind auth middleware
- Lock CORS to `NEXT_PUBLIC_FRONTEND_URL` (remove `origin: '*'`)
- Move hardcoded EC2 IP in domains route to environment variable
- Add input sanitization on wishes/RSVP message fields (XSS prevention)
- Implement password reset / forgot-password flow

**Infrastructure:**
- Add proper environment variable management (`.env.production`)
- Set up database backups (pg_dump cron, daily, to S3 or local)
- Add health check monitoring (uptime alert via Telegram bot)
- Implement proper error logging (replace console.log with structured logger)
- Add Redis session management (currently not used despite running)

**Plan enforcement:**
- Implement feature gating logic tied to `users.plan` column
- Define limits per plan: max invitations, templates accessible, analytics depth

---

### Phase 2 — Core Feature Completion (3–4 weeks)
*"Fill the gaps that competitors have"*

**WhatsApp Integration:**
- Generate personalized WA share links with guest name pre-filled
- Implement WhatsApp blast via WA Business API or Fonnte/Wablas (Indonesian providers)
- Complete `reminder_type = 'whatsapp'` in reminders route

**Guest Management:**
- Complete `guest_list.opened_at` tracking (fire on `?to=` token open)
- Add guest import via CSV upload
- Bulk WA blast from guest list with personalized `?to=` links

**Scheduled Reminders:**
- Implement job queue (Bull/BullMQ + existing Redis) for `scheduled_at` reminders
- H-7, H-3, H-1, Hari-H reminder presets

**Invitation UX:**
- Invitation duplicate/copy feature
- Multi-language toggle (ID/EN) on public invitation page
- Waze + Google Maps dual navigation button
- QR code generator for printed invitation cards

**Payment Integration:**
- Integrate Midtrans or Xendit (Indonesian payment gateway)
- Implement plan upgrade flow after payment confirmation
- Add invoice/receipt email on purchase

---

### Phase 3 — Premium Experience (4–6 weeks)
*"Differentiate with quality"*

**Visual & Animation:**
- Lottie animations for section transitions (match Loveweb.id quality)
- SVG ornament system per template category (16+ ornaments/section)
- Clip-mask section transitions (currently listed as backlog gap)
- Love story carousel with timeline component
- Video background support (currently schema-ready but not implemented)

**Gift Registry:**
- Add bank account gift (dana/transfer) section — already has gift_accounts JSONB
- Build dedicated gift registry UI with copy-to-clipboard
- Optional GoPay/OVO QR code upload for digital gifts

**AI Features:**
- AI-powered vow/caption generator based on couple names + story input
- AI template recommendation based on couple style quiz
- Auto-generate invitation caption for WA/Instagram sharing

**Template Expansion:**
- Complete Rumah Gadang template (authentic gonjong rooflines)
- Add 10 new templates: Betawi, Batak, Javanese Keraton, Sundanese, modern minimalist 2.0
- Seasonal/trend templates (boho 2026, celestial, sage green, etc.)

---

### Phase 4 — Growth & Scale (Ongoing)
*"Acquire and retain"*

**SEO & Discovery:**
- Static pre-render for public invitation pages (Next.js SSG/ISR)
- OG image generation per invitation for social sharing previews
- Landing page SEO optimization (target: "undangan digital pernikahan", "undangan online gratis")
- Blog/content: tips pernikahan, inspirasi dekorasi

**Analytics & Retention:**
- Enhanced dashboard: device breakdown, time-on-page, bounce rate
- Couple post-event survey (NPS collection)
- Admin super-dashboard for platform-level metrics

**B2B / Wedding Organizer:**
- WO account type: manage multiple client invitations
- White-label option (remove platform branding, custom logo)
- Reseller/affiliate program

**Mobile App (Future):**
- React Native companion app for couple to monitor RSVPs in real-time
- Push notifications on new RSVP / wishes

---

## 7. Technical Debt to Address

Priority order:

1. **CORS wildcard** — immediate security fix before any public launch
2. **RSVP endpoint auth** — guest data exposure
3. **Hardcoded IP** — blocks multi-server or domain migration
4. **No plan enforcement** — paying users can't be differentiated from free
5. **No payment flow** — platform can't generate revenue
6. **No backup strategy** — single point of failure on Postgres data
7. **JWT stored in-memory only** — lost on page refresh (add httpOnly cookie or localStorage fallback)
8. **No rate limiting on wishes endpoint** — spam vector

---

## 8. Non-Functional Requirements

**Performance:**
- Lighthouse score > 85 on mobile
- First Contentful Paint < 1.5s
- Time to Interactive < 3s on 4G

**Security:**
- OWASP Top 10 compliance before launch
- All file uploads virus-scanned or MIME-validated strictly
- JWT expiry reduced to 24h for production (currently 7d)

**Scalability:**
- Stateless backend (no local session state) for horizontal scaling
- Uploads migrated to S3/Cloudflare R2 before >1,000 users (disk fills up fast)
- CDN for static assets and ornament images

**Availability:**
- 99.9% uptime SLA target
- Graceful degradation: public invitation pages should load even if backend is down (SSG)

---

## 9. Open Questions

1. **Domain name:** What's the target domain? (e.g., undanganku.id, undangan.ai, lovelink.id)
2. **Payment gateway:** Midtrans or Xendit preference?
3. **WhatsApp API:** Official WA Business API or third-party (Fonnte, Wablas, Maytapi)?
4. **Hosting scale plan:** Stay on single EC2 or move to managed (ECS, Railway, Vercel)?
5. **Launch strategy:** Soft launch (invite-only) or public launch with freemium?
6. **Custom domain approach:** Currently requires manual DNS config — offer subdomain (nama.platform.id) as easier alternative?

---

## 10. Out of Scope (v1)

- Physical/printed invitation ordering
- Video invitation (recorded + animated)
- Wedding website builder (beyond invitation page)
- Vendor marketplace (photographer, catering, venue)
- Multi-event per invitation (beyond akad + resepsi)

---

*Document maintained at `/home/ssm-user/wedding-invitation/docs/PRD.md`*
