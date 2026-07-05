#!/usr/bin/env python3
"""
PRD PDF Generator - Digital Wedding Invitation SaaS
Uses fpdf2 + DejaVu Unicode fonts to produce a professional PRD.
"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import datetime

PRIMARY    = (183, 110, 121)
DARK       = (40,  40,  48)
ACCENT     = (240, 228, 220)
LIGHT_GRAY = (245, 245, 245)
MID_GRAY   = (120, 120, 130)
WHITE      = (255, 255, 255)
GREEN      = (76,  153, 100)
ORANGE     = (220, 140,  60)
RED        = (200,  70,  70)
BLUE_DARK  = (60,  80,  140)

OUTPUT   = "/home/ssm-user/wedding-invitation/docs/PRD.pdf"
FONT_DIR = "/usr/share/fonts/truetype/dejavu/"


class PRD(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=22)
        self.set_margins(20, 20, 20)
        self.add_font('DV',   '',   FONT_DIR + 'DejaVuSans.ttf')
        self.add_font('DV',   'B',  FONT_DIR + 'DejaVuSans-Bold.ttf')
        self.add_font('DV',   'I',  FONT_DIR + 'DejaVuSans-Oblique.ttf')
        self.add_font('DV',   'BI', FONT_DIR + 'DejaVuSans-BoldOblique.ttf')

    # ------------------------------------------------------------------ helpers
    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(*PRIMARY)
        self.rect(0, 0, 210, 10, 'F')
        self.set_font('DV', 'B', 8)
        self.set_text_color(*WHITE)
        self.set_y(2)
        self.cell(0, 6, 'Digital Wedding Invitation SaaS  -  Product Requirements Document', align='C')
        self.set_text_color(*DARK)
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font('DV', 'I', 8)
        self.set_text_color(*MID_GRAY)
        self.cell(0, 10, f'Page {self.page_no()}  |  Confidential  -  {datetime.date.today().strftime("%B %Y")}', align='C')

    def section_bar(self, num, title):
        self.ln(4)
        self.set_fill_color(*PRIMARY)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 12)
        self.rect(20, self.get_y(), 170, 8, 'F')
        self.set_x(22)
        self.cell(166, 8, f'{num}.  {title}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)
        self.ln(2)

    def sub(self, text):
        self.set_font('DV', 'B', 10)
        self.set_text_color(*PRIMARY)
        self.cell(0, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)

    def body(self, text, indent=0):
        self.set_font('DV', '', 9)
        self.set_x(20 + indent)
        self.multi_cell(170 - indent, 5.5, text)

    def bullet(self, text, indent=4):
        self.set_font('DV', '', 9)
        self.set_x(20 + indent)
        self.cell(5, 5.5, '-')
        self.set_x(20 + indent + 5)
        self.multi_cell(165 - indent, 5.5, text)

    def kv(self, key, val, col=None):
        self.set_font('DV', 'B', 9)
        self.set_text_color(*PRIMARY)
        self.cell(40, 5.5, key + ':')
        self.set_font('DV', '', 9)
        self.set_text_color(*(col if col else DARK))
        self.multi_cell(130, 5.5, val)
        self.set_text_color(*DARK)

    def callout(self, text, bg=ACCENT, border=PRIMARY):
        self.ln(2)
        y = self.get_y()
        # measure height
        self.set_font('DV', 'I', 9)
        # estimate height: ~60 chars per line at this width/font size
        line_count = max(1, (len(text) // 60) + 1)
        h = line_count * 4.5 + 5
        self.set_fill_color(*border)
        self.rect(20, y, 2, h, 'F')
        self.set_fill_color(*bg)
        self.rect(22, y, 168, h, 'F')
        self.set_xy(25, y + 2.5)
        self.set_text_color(*DARK)
        self.multi_cell(163, 4.5, text)
        self.ln(3)

    def info_row(self, label, val):
        self.set_fill_color(*PRIMARY)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 9)
        self.cell(50, 7, '  ' + label, fill=True)
        self.set_fill_color(*LIGHT_GRAY)
        self.set_text_color(*DARK)
        self.set_font('DV', '', 9)
        self.cell(120, 7, '  ' + val, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(0.8)

    def phase_block(self, num, title, dur, color, items):
        self.ln(2)
        y = self.get_y()
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 10)
        self.rect(20, y, 170, 8, 'F')
        self.set_x(22)
        self.cell(130, 8, f'Phase {num} - {title}')
        self.set_font('DV', 'I', 9)
        self.cell(38, 8, dur, align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)
        for i in items:
            self.bullet(i, indent=6)
        self.ln(2)

    def pricing_card(self, tier, price, feats, color):
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 10)
        self.cell(170, 8, f'  {tier}  -  {price}', fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)
        for f in feats:
            self.bullet(f, indent=6)
        self.ln(2)

    def competitor(self, flag, name, price, strength, gap):
        self.set_font('DV', 'B', 9)
        self.set_text_color(*PRIMARY)
        self.cell(0, 5.5, f'{flag}  {name}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.kv('  Price', price)
        self.kv('  Strength', strength)
        self.kv('  Gap', gap, col=RED)
        self.ln(1.5)

    def severity_row(self, sev, text, color):
        self.set_font('DV', 'B', 8)
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.cell(20, 6, f' {sev}', fill=True)
        self.set_fill_color(*LIGHT_GRAY)
        self.set_text_color(*DARK)
        self.set_font('DV', '', 9)
        self.cell(150, 6, '  ' + text, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(0.5)


# ======================================================================= BUILD
def build():
    pdf = PRD()

    # ---------------------------------------------------------------- COVER
    pdf.add_page()
    pdf.set_fill_color(*PRIMARY)
    pdf.rect(0, 0, 210, 72, 'F')
    # subtle circles
    pdf.set_fill_color(210, 170, 175)
    for x, y, r in [(28, 14, 8), (183, 8, 5), (168, 54, 3), (24, 58, 4)]:
        pdf.ellipse(x, y, r * 2, r * 2, 'F')

    pdf.set_text_color(*WHITE)
    pdf.set_font('DV', 'B', 26)
    pdf.set_xy(20, 18)
    pdf.cell(0, 12, 'Digital Wedding Invitation', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('DV', '', 17)
    pdf.set_x(20)
    pdf.cell(0, 9, 'SaaS Platform', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('DV', 'B', 11)
    pdf.set_x(20)
    pdf.cell(0, 7, 'Product Requirements Document', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_y(80)
    pdf.set_text_color(*DARK)
    for label, val in [
        ('Version',  '1.0'),
        ('Date',     datetime.date.today().strftime('%B %d, %Y')),
        ('Author',   'Fazrial'),
        ('Status',   'Draft - Internal'),
        ('Platform', 'Web SaaS (Indonesia-first)'),
    ]:
        pdf.info_row(label, val)

    pdf.ln(6)
    pdf.callout(
        'This document defines the product vision, competitive landscape, business model options, '
        'and phased roadmap for transforming the existing Digital Wedding Invitation prototype '
        'into a production-ready SaaS platform targeting the Indonesian market.',
        bg=ACCENT, border=PRIMARY
    )

    pdf.ln(3)
    pdf.set_font('DV', 'B', 9)
    pdf.set_text_color(*MID_GRAY)
    pdf.cell(0, 5, 'TABLE OF CONTENTS', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(1)
    toc = [
        ('1', 'Executive Summary'),
        ('2', 'Problem Statement'),
        ('3', 'Goals & Success Metrics'),
        ('4', 'Competitor Analysis'),
        ('5', 'Business Model Options'),
        ('6', 'Recommended Roadmap'),
        ('7', 'Technical Debt'),
        ('8', 'Non-Functional Requirements'),
        ('9', 'Open Questions'),
    ]
    for num, title in toc:
        pdf.set_font('DV', '', 9.5)
        pdf.set_text_color(*DARK)
        pdf.cell(8, 5.5, num + '.')
        pdf.cell(0, 5.5, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # --------------------------------------------------- PAGE 2: summary + goals
    pdf.add_page()

    pdf.section_bar(1, 'Executive Summary')
    pdf.body(
        'A web-based SaaS platform for creating, customizing, and sharing beautiful digital wedding '
        'invitations. Targeting the Indonesian market primarily, with potential Southeast Asian expansion. '
        'Differentiates through deep cultural template coverage (adat/traditional styles), premium '
        'animations, WhatsApp-native sharing, and affordable tiered IDR pricing.'
    )
    pdf.ln(2)
    pdf.sub('Market Opportunity')
    for item in [
        'Global online invitation market: $1.2B (2023) -> $2.1B by 2030 (CAGR 8.3%)',
        'Indonesia estimated market potential: Rp 500 billion (2025)',
        'Smartphone penetration 77% + eco-conscious couples driving digital shift',
        'WhatsApp is the primary sharing channel - no global competitor supports it natively',
    ]:
        pdf.bullet(item)

    pdf.section_bar(2, 'Problem Statement')
    pdf.body('Indonesian couples want beautiful, shareable digital invitations but face:')
    pdf.ln(1)
    for item in [
        'Generic global platforms (Canva, Paperless Post) with no Indonesian/adat templates',
        'Local competitors with limited template quality and no self-serve customization wizard',
        'High cost for custom-built invitations (Rp 500K-2M via freelancers)',
        'Poor mobile experience - but 70%+ of Indonesian users are mobile-first',
        'No WhatsApp-native sharing workflow (primary communications channel in Indonesia)',
    ]:
        pdf.bullet(item)

    pdf.section_bar(3, 'Goals & Success Metrics')
    pdf.sub('Business Goals')
    for item in [
        '1,000 paying invitations within 6 months of launch',
        'Rp 50M Monthly Recurring Revenue within 12 months',
        '70%+ mobile traffic (mobile-first market)',
    ]:
        pdf.bullet(item)

    pdf.sub('Product Goals')
    for item in [
        'Time to first published invitation: < 10 minutes',
        'RSVP open rate: > 60% (vs email industry average ~25%)',
        'Net Promoter Score: > 50',
    ]:
        pdf.bullet(item)

    pdf.sub('Technical Goals')
    for item in [
        '99.9% uptime during active wedding invitation periods',
        'Page load < 2s on 4G mobile connection',
        'Zero critical security vulnerabilities at launch',
    ]:
        pdf.bullet(item)

    # --------------------------------------------------- PAGE 3: competitors
    pdf.add_page()
    pdf.section_bar(4, 'Competitor Analysis')

    pdf.sub('Global Players')
    pdf.competitor('Global', 'Paperless Post',
        '$0 free + $8-$75 coin packs / $150/year unlimited',
        'Polish, tracking, paper add-on, 500+ templates',
        'No Indonesian/Islamic templates, no WhatsApp, USD pricing')
    pdf.competitor('Global', 'Zola',
        'Free (bundled with wedding website)',
        'All-in-one suite: registry + website + invitations, 1,000+ designs',
        'US-centric, no adat templates, registry irrelevant for Indonesia')
    pdf.competitor('Global', 'Canva',
        'Free / Pro $15/month',
        'Full design freedom, massive template library',
        'Not wedding-specific, no RSVP/guest management, no WhatsApp share')
    pdf.competitor('Global', 'Greenvelope',
        '$20-$159/event or $99/year',
        'Luxury positioning, envelope-opening animation',
        'USD pricing, no Indonesia localization, no adat/Islamic templates')

    pdf.sub('Indonesian Local Players')
    pdf.competitor('ID', 'Undangan.online',
        'Rp 99K-249K (one-time per event)',
        'Affordable, WhatsApp support, Indonesian language',
        'Manual order process (not self-serve), limited template quality')
    pdf.competitor('ID', 'Undangan.id',
        'Rp 150K-350K (one-time)',
        'Admin panel, 50K+ couples served, multi-language',
        'Dated UI, no self-serve wizard, no live preview')
    pdf.competitor('ID', 'Loveweb.id',
        'Rp 175K-450K (one-time)',
        'Lottie animations, Next.js/Tailwind, personalized guest URLs',
        'No live preview editor, no subscription model, expensive exclusive tier')

    pdf.sub('Our Competitive Advantages')
    pdf.callout(
        'We are the only platform combining: self-serve wizard with live phone preview + '
        'adat/Islamic templates + analytics dashboard + modern Next.js stack. '
        'No competitor has all four simultaneously.',
        bg=(235, 248, 239), border=GREEN
    )
    for item in [
        'Self-serve wizard with live phone preview (unique in Indonesian market)',
        '30 templates across 5 ornament families including adat/traditional coverage',
        '75 color palettes - most customization options in the segment',
        'Analytics dashboard - only Paperless Post (global) has this feature',
        'Modern stack: Next.js 14 + PostgreSQL + Docker (easy to scale)',
    ]:
        pdf.bullet(item)

    pdf.sub('Gaps to Close')
    for item in [
        'No WhatsApp blast - every local competitor has this (Phase 2 priority)',
        'No Lottie animations - Loveweb.id differentiates here (Phase 3)',
        'No IDR payment gateway - currently cannot monetize (Phase 1 BLOCKER)',
        'No plan enforcement - all users access same features regardless of tier (Phase 1)',
    ]:
        pdf.bullet(item)

    # --------------------------------------------------- PAGE 4: business model
    pdf.add_page()
    pdf.section_bar(5, 'Business Model Options')

    pdf.sub('Option A - One-Time Per-Event Payment (Recommended Primary)')
    pdf.body('Customer pays once per wedding event. Access valid for 6-24 months depending on tier.')
    pdf.ln(2)
    pdf.pricing_card('Starter', 'Rp 99.000',
        ['10 templates, RSVP, wishes, gallery, maps, music', '6 months active'],
        (100, 150, 110))
    pdf.pricing_card('Standard', 'Rp 179.000',
        ['30 templates, all Starter features',
         'Countdown, basic analytics, custom slug', '1 year active'],
        PRIMARY)
    pdf.pricing_card('Premium', 'Rp 299.000',
        ['All templates + all features',
         'Custom domain, WhatsApp blast, full analytics',
         'Live streaming embed, 2 years active'],
        DARK)
    pdf.callout(
        'Best for initial market entry. Matches local competitor pricing. Lowest friction to first purchase.',
        bg=ACCENT, border=GREEN
    )

    pdf.sub('Option B - Subscription SaaS (B2B / Wedding Organizer Tier)')
    for item in [
        'Personal - Rp 49K/bln: 1 active invitation, basic templates',
        'Pro - Rp 149K/bln: 5 active invitations, all templates, analytics',
        'Business - Rp 499K/bln: Unlimited invitations, white-label, API access',
    ]:
        pdf.bullet(item)
    pdf.callout(
        'Add as B2B tier for Wedding Organizers (WOs) only in Phase 3. '
        'Hard sell for individual couples who have a one-time need.',
        bg=(255, 248, 235), border=ORANGE
    )

    pdf.sub('Option C - Freemium + Upgrade')
    for item in [
        'Free tier: 3 basic templates, platform watermark, RSVP max 50 guests, 3 months active',
        'Upsell to paid tiers to remove watermark and unlock features',
        'Watermark on free invitations = organic brand exposure as guests see the platform',
    ]:
        pdf.bullet(item)
    pdf.callout(
        'Include free tier as lead generation layer on top of Option A. '
        'Watermark = organic viral marketing.',
        bg=ACCENT, border=PRIMARY
    )

    pdf.sub('Option D - A La Carte Add-Ons')
    for item in [
        'Custom domain: +Rp 50.000',
        'WhatsApp blast (up to 500 contacts): +Rp 75.000',
        'Live streaming embed: +Rp 50.000',
        'Premium animation pack: +Rp 49.000',
        'Extended active period (+1 year): +Rp 49.000',
        'QR code for printed invitation card: +Rp 25.000',
    ]:
        pdf.bullet(item)
    pdf.callout(
        'Layer as post-purchase upsells to increase ARPU without complicating the main pricing page.',
        bg=ACCENT, border=PRIMARY
    )

    pdf.ln(2)
    pdf.sub('Recommended Model Stack')
    pdf.set_fill_color(*ACCENT)
    y = pdf.get_y()
    pdf.rect(20, y, 170, 26, 'F')
    pdf.set_y(y + 2)
    for item in [
        'Primary: One-time per-event (Option A) - Rp 99K / 179K / 299K',
        'Virality: Freemium free tier with platform watermark',
        'Upsell: A la carte add-ons post-purchase to increase ARPU',
        'B2B (Phase 3): Monthly subscription for Wedding Organizers',
    ]:
        pdf.bullet(item, indent=6)

    # --------------------------------------------------- PAGE 5: roadmap
    pdf.add_page()
    pdf.section_bar(6, 'Recommended Roadmap')

    pdf.phase_block(1, 'Production Hardening', '2-3 weeks', (80, 120, 90), [
        'Fix CORS wildcard - remove origin: "*", lock to NEXT_PUBLIC_FRONTEND_URL',
        'Lock GET /api/rsvp/:id behind auth middleware (guest data currently exposed)',
        'Move hardcoded EC2 IP in domains route to environment variable',
        'Add input sanitization on wishes/RSVP fields (XSS prevention)',
        'Set up daily database backups (pg_dump cron to S3 or local)',
        'Implement plan enforcement: feature gating tied to users.plan column',
        'Integrate Midtrans or Xendit payment gateway (revenue blocker)',
        'Add uptime monitoring with Telegram alert on downtime',
    ])

    pdf.phase_block(2, 'Core Feature Completion', '3-4 weeks', PRIMARY, [
        'WhatsApp blast via Fonnte/Wablas (Indonesian WA API providers)',
        'Personalized WA share links with guest name pre-filled (?to= token)',
        'Guest import via CSV upload',
        'Job queue (Bull + Redis) for scheduled reminders (H-7, H-3, H-1, Hari-H)',
        'Invitation duplicate/copy feature',
        'Waze + Google Maps dual navigation button',
        'QR code generator for printed invitation cards',
        'Multi-language toggle (ID/EN) on public invitation page',
    ])

    pdf.phase_block(3, 'Premium Experience', '4-6 weeks', BLUE_DARK, [
        'Lottie animations for section transitions',
        'SVG ornament system: 16+ ornaments per section per template',
        'Clip-mask section transitions (currently in backlog)',
        'Love story carousel with timeline component',
        'Gift registry UI (bank transfer + GoPay/OVO QR)',
        'AI vow/caption generator based on couple story input',
        'Complete Rumah Gadang template (authentic gonjong rooflines)',
        '10 new templates: Betawi, Batak, Javanese Keraton, Sundanese, modern minimalist',
    ])

    pdf.phase_block(4, 'Growth & Scale', 'Ongoing', DARK, [
        'Static pre-render for public invitation pages (Next.js SSG/ISR)',
        'OG image generation per invitation for social sharing previews',
        'SEO optimization (target: "undangan digital pernikahan", "undangan online gratis")',
        'WO account type: manage multiple client invitations',
        'White-label option (remove platform branding, custom logo)',
        'Affiliate/reseller program',
        'React Native companion app for real-time RSVP monitoring',
    ])

    # --------------------------------------------------- PAGE 6: tech debt + NFR
    pdf.add_page()
    pdf.section_bar(7, 'Technical Debt to Address')
    pdf.body('Priority order before public launch:')
    pdf.ln(1)

    for sev, text, color in [
        ('CRITICAL', 'CORS wildcard - remove origin: "*" immediately', RED),
        ('CRITICAL', 'RSVP endpoint auth - guest data publicly accessible without auth', RED),
        ('HIGH',     'Hardcoded EC2 IP in domains route - blocks domain migration', ORANGE),
        ('HIGH',     'No plan enforcement - all users access same features', ORANGE),
        ('HIGH',     'No payment flow - platform cannot generate revenue', ORANGE),
        ('MEDIUM',   'No database backup strategy - single point of failure', (150, 110, 50)),
        ('MEDIUM',   'JWT stored in-memory only - lost on page refresh', (150, 110, 50)),
        ('LOW',      'No rate limiting on wishes endpoint - spam vector', MID_GRAY),
    ]:
        pdf.severity_row(sev, text, color)

    pdf.section_bar(8, 'Non-Functional Requirements')

    pdf.sub('Performance')
    for item in [
        'Lighthouse mobile score > 85',
        'First Contentful Paint < 1.5s',
        'Time to Interactive < 3s on 4G connection',
    ]:
        pdf.bullet(item)

    pdf.sub('Security')
    for item in [
        'OWASP Top 10 compliance before public launch',
        'All file uploads MIME-type validated strictly',
        'JWT expiry reduced to 24h for production (currently 7 days)',
        'No secrets hardcoded in source code or Docker images',
    ]:
        pdf.bullet(item)

    pdf.sub('Scalability')
    for item in [
        'Stateless backend (no local session state) for horizontal scaling',
        'File uploads migrated to S3/Cloudflare R2 before >1,000 active users',
        'CDN for static assets and ornament images',
    ]:
        pdf.bullet(item)

    pdf.sub('Availability')
    for item in [
        '99.9% uptime SLA target',
        'Public invitation pages load even if backend is down (Next.js SSG)',
        'Graceful degradation on all user-facing error states',
    ]:
        pdf.bullet(item)

    pdf.section_bar(9, 'Open Questions')
    for i, (q, note) in enumerate([
        ('Domain name?',        'e.g. undanganku.id, undangan.ai, lovelink.id'),
        ('Payment gateway?',    'Midtrans vs Xendit - both support IDR, QRIS, Virtual Account'),
        ('WhatsApp API?',       'Official WA Business API vs Fonnte/Wablas/Maytapi'),
        ('Hosting plan?',       'Stay on single EC2 vs ECS / Railway / Vercel'),
        ('Launch strategy?',    'Soft launch (invite-only) vs public with freemium'),
        ('Custom domain UX?',   'Subdomain (name.platform.id) as easier alt to full custom domain'),
    ], 1):
        pdf.set_font('DV', 'B', 9)
        pdf.set_text_color(*PRIMARY)
        pdf.cell(6, 6, f'{i}.')
        pdf.set_text_color(*DARK)
        pdf.cell(70, 6, q)
        pdf.set_font('DV', 'I', 9)
        pdf.set_text_color(*MID_GRAY)
        pdf.multi_cell(94, 6, note)
        pdf.set_text_color(*DARK)

    pdf.ln(4)
    pdf.callout(
        'Out of Scope (v1): Physical/printed invitation ordering, video invitations, '
        'full wedding website builder, vendor marketplace, multi-event per invitation.',
        bg=LIGHT_GRAY, border=MID_GRAY
    )

    pdf.output(OUTPUT)
    print(f'PDF written -> {OUTPUT}')


if __name__ == '__main__':
    build()
