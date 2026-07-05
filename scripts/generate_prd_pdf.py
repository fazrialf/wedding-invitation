#!/usr/bin/env python3
"""PRD PDF Generator - Dark Navy Minimalist theme"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import datetime

# Dark navy minimalist palette
NAVY        = (15,  30,  60)
NAVY_MID    = (25,  50,  100)
NAVY_LIGHT  = (40,  70,  130)
ACCENT_BLUE = (60,  120, 200)
WHITE       = (255, 255, 255)
OFF_WHITE   = (248, 249, 252)
LIGHT_GRAY  = (230, 235, 245)
MID_GRAY    = (140, 150, 170)
DARK_GRAY   = (80,  90,  110)
GREEN       = (40,  180, 110)
ORANGE      = (230, 150,  50)
RED         = (210,  65,  65)

OUTPUT   = "/home/ssm-user/wedding-invitation/docs/PRD.pdf"
FONT_DIR = "/usr/share/fonts/truetype/dejavu/"
W        = 170   # usable width (A4 210mm - 20mm margins x2)


class PRD(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=22)
        self.set_margins(20, 20, 20)
        self.add_font('DV',  '',   FONT_DIR + 'DejaVuSans.ttf')
        self.add_font('DV',  'B',  FONT_DIR + 'DejaVuSans-Bold.ttf')
        self.add_font('DV',  'I',  FONT_DIR + 'DejaVuSans-Oblique.ttf')
        self.add_font('DV',  'BI', FONT_DIR + 'DejaVuSans-BoldOblique.ttf')

    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, 11, 'F')
        self.set_font('DV', '', 7.5)
        self.set_text_color(*MID_GRAY)
        self.set_y(2.5)
        self.cell(0, 6, 'Digital Wedding Invitation SaaS  |  Product Requirements Document', align='C')
        self.set_text_color(*NAVY)
        self.ln(9)

    def footer(self):
        self.set_y(-14)
        self.set_draw_color(*NAVY_LIGHT)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(2)
        self.set_font('DV', '', 7.5)
        self.set_text_color(*MID_GRAY)
        self.cell(85, 5, f'Confidential  |  {datetime.date.today().strftime("%B %Y")}')
        self.cell(0, 5, f'Page {self.page_no()}', align='R')

    # -- section header bar
    def section_bar(self, num, title):
        self.ln(5)
        self.set_fill_color(*NAVY)
        self.rect(20, self.get_y(), W, 9, 'F')
        self.set_font('DV', 'B', 11)
        self.set_text_color(*WHITE)
        self.set_x(23)
        self.cell(W - 3, 9, f'{num}.  {title}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*NAVY)
        self.ln(3)

    # -- sub heading
    def sub(self, text):
        self.ln(2)
        self.set_font('DV', 'B', 9.5)
        self.set_text_color(*ACCENT_BLUE)
        self.cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*NAVY)

    # -- body text
    def body(self, text):
        self.set_font('DV', '', 9)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(W, 5.5, text)
        self.set_text_color(*NAVY)

    # -- bullet
    def bullet(self, text, indent=3):
        self.set_font('DV', '', 9)
        self.set_text_color(*DARK_GRAY)
        self.set_x(20 + indent)
        self.cell(5, 5.5, '-')
        self.set_x(20 + indent + 5)
        self.multi_cell(W - indent - 5, 5.5, text)
        self.set_text_color(*NAVY)

    # -- callout box (full width, left accent bar)
    def callout(self, text, bg=None, border=None):
        if bg is None:
            bg = (20, 40, 80)
        if border is None:
            border = ACCENT_BLUE
        self.ln(2)
        self.set_font('DV', 'I', 9)
        # count lines roughly
        chars_per_line = 85
        line_count = max(1, (len(text) // chars_per_line) + 1)
        h = line_count * 5 + 6
        y = self.get_y()
        self.set_fill_color(*border)
        self.rect(20, y, 2.5, h, 'F')
        self.set_fill_color(*bg)
        self.rect(22.5, y, W - 2.5, h, 'F')
        self.set_xy(25, y + 3)
        self.set_text_color(*WHITE)
        self.multi_cell(W - 7, 5, text)
        self.set_y(y + h + 2)
        self.set_text_color(*NAVY)

    # -- info row for cover page
    def info_row(self, label, val):
        self.set_fill_color(*NAVY)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 8.5)
        self.cell(45, 7, '  ' + label, fill=True)
        self.set_fill_color(*LIGHT_GRAY)
        self.set_text_color(*DARK_GRAY)
        self.set_font('DV', '', 8.5)
        self.cell(W - 45, 7, '  ' + val, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(0.8)

    # -- competitor block (single-column, no overflow)
    def competitor(self, region, name, price, strength, gap):
        self.ln(1)
        # name bar
        self.set_fill_color(*NAVY_LIGHT)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 9)
        self.cell(W, 7, f'  [{region}]  {name}', fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        # price row
        self.set_fill_color(*OFF_WHITE)
        self.set_text_color(*DARK_GRAY)
        self.set_font('DV', 'B', 8)
        self.set_x(20)
        self.cell(22, 5.5, '  Price', fill=True)
        self.set_font('DV', '', 8)
        self.cell(W - 22, 5.5, '  ' + price, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        # strength row
        self.set_fill_color(*WHITE)
        self.set_font('DV', 'B', 8)
        self.set_x(20)
        self.cell(22, 5.5, '  Strength')
        self.set_font('DV', '', 8)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(W - 22, 5.5, '  ' + strength)
        # gap row
        self.set_font('DV', 'B', 8)
        self.set_text_color(*RED)
        self.set_x(20)
        self.cell(22, 5.5, '  Gap')
        self.set_font('DV', '', 8)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(W - 22, 5.5, '  ' + gap)
        self.ln(1)

    # -- pricing card
    def pricing_card(self, tier, price, feats, color):
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 10)
        self.cell(W, 8, f'  {tier}   {price}', fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK_GRAY)
        for f in feats:
            self.bullet(f, indent=5)
        self.ln(2)

    # -- phase block
    def phase_block(self, num, title, dur, color, items):
        self.ln(2)
        y = self.get_y()
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font('DV', 'B', 10)
        self.rect(20, y, W, 8, 'F')
        self.set_x(23)
        self.cell(W - 35, 8, f'Phase {num}  -  {title}')
        self.set_font('DV', 'I', 8.5)
        self.cell(35, 8, dur, align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK_GRAY)
        for i in items:
            self.bullet(i, indent=5)
        self.ln(2)

    # -- severity row for tech debt
    def severity_row(self, sev, text, color):
        self.set_font('DV', 'B', 7.5)
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.cell(22, 6, '  ' + sev, fill=True)
        self.set_fill_color(*OFF_WHITE)
        self.set_text_color(*DARK_GRAY)
        self.set_font('DV', '', 8.5)
        self.multi_cell(W - 22, 6, '  ' + text, fill=True)
        self.ln(0.5)



def build():
    pdf = PRD()

    # ---------------------------------------------------------------- COVER
    pdf.add_page()
    # full navy cover
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 210, 297, 'F')

    # accent line
    pdf.set_fill_color(*ACCENT_BLUE)
    pdf.rect(20, 60, W, 1.5, 'F')

    pdf.set_text_color(*WHITE)
    pdf.set_font('DV', 'B', 30)
    pdf.set_xy(20, 30)
    pdf.cell(0, 14, 'Digital Wedding', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_x(20)
    pdf.cell(0, 14, 'Invitation SaaS', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(20, 65)
    pdf.set_font('DV', '', 13)
    pdf.set_text_color(*MID_GRAY)
    pdf.cell(0, 8, 'Product Requirements Document')

    # meta box
    pdf.set_xy(20, 90)
    for label, val in [
        ('Version',  '1.0'),
        ('Date',     datetime.date.today().strftime('%B %d, %Y')),
        ('Author',   'Fazrial'),
        ('Status',   'Draft - Internal'),
        ('Market',   'Indonesia-first SaaS'),
    ]:
        pdf.set_fill_color(*NAVY_MID)
        pdf.set_text_color(*MID_GRAY)
        pdf.set_font('DV', 'B', 8)
        pdf.cell(40, 7, '  ' + label, fill=True)
        pdf.set_text_color(*WHITE)
        pdf.set_font('DV', '', 8)
        pdf.cell(W - 40, 7, '  ' + val, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(0.5)

    # accent line bottom
    pdf.set_fill_color(*ACCENT_BLUE)
    pdf.rect(20, 145, W, 1, 'F')

    # TOC
    pdf.set_xy(20, 152)
    pdf.set_font('DV', 'B', 8)
    pdf.set_text_color(*MID_GRAY)
    pdf.cell(0, 6, 'CONTENTS')
    pdf.ln(7)
    toc = [
        ('01', 'Executive Summary'),
        ('02', 'Problem Statement'),
        ('03', 'Goals & Success Metrics'),
        ('04', 'Competitor Analysis'),
        ('05', 'Business Model Options'),
        ('06', 'Recommended Roadmap'),
        ('07', 'Technical Debt'),
        ('08', 'Non-Functional Requirements'),
        ('09', 'Open Questions'),
    ]
    for num, title in toc:
        pdf.set_font('DV', 'B', 9)
        pdf.set_text_color(*ACCENT_BLUE)
        pdf.cell(12, 6, num)
        pdf.set_font('DV', '', 9)
        pdf.set_text_color(*WHITE)
        pdf.cell(0, 6, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(0.5)

    # ---------------------------------------------------------------- PAGE 2
    pdf.add_page()

    pdf.section_bar(1, 'Executive Summary')
    pdf.body(
        'A web-based SaaS platform for creating, customizing, and sharing digital wedding invitations. '
        'Targeting Indonesia first, with potential SEA expansion. Key differentiators: deep adat/traditional '
        'template coverage, WhatsApp-native sharing, live preview wizard, and affordable IDR pricing.'
    )
    pdf.ln(2)
    pdf.sub('Market Opportunity')
    for item in [
        'Global online invitation market: $1.2B (2023) -> $2.1B by 2030 (CAGR 8.3%)',
        'Indonesia estimated potential: Rp 500 billion (2025)',
        'Smartphone penetration 77% + eco-conscious couples driving digital shift',
        'WhatsApp dominant in Indonesia - no global competitor supports it natively',
    ]:
        pdf.bullet(item)

    pdf.section_bar(2, 'Problem Statement')
    pdf.body('Indonesian couples want beautiful, shareable digital invitations but face:')
    pdf.ln(1)
    for item in [
        'Global platforms (Canva, Paperless Post) have zero Indonesian/adat templates',
        'Local competitors lack self-serve customization wizard and live preview',
        'Freelance custom invitations cost Rp 500K-2M with slow turnaround',
        '70%+ Indonesian users are mobile-first, but existing platforms have poor mobile UX',
        'No WhatsApp-native sharing workflow on any existing platform',
    ]:
        pdf.bullet(item)

    pdf.section_bar(3, 'Goals & Success Metrics')
    pdf.sub('Business Goals')
    for item in [
        '1,000 paying invitations within 6 months of launch',
        'Rp 50M Monthly Recurring Revenue within 12 months',
        '70%+ mobile traffic share',
    ]:
        pdf.bullet(item)
    pdf.sub('Product Goals')
    for item in [
        'Time to first published invitation: under 10 minutes',
        'RSVP open rate: above 60% (vs email industry average 25%)',
        'Net Promoter Score: above 50',
    ]:
        pdf.bullet(item)
    pdf.sub('Technical Goals')
    for item in [
        '99.9% uptime during active invitation periods',
        'Page load under 2s on 4G mobile',
        'Zero critical security vulnerabilities at launch',
    ]:
        pdf.bullet(item)

    # ---------------------------------------------------------------- PAGE 3: competitors
    pdf.add_page()
    pdf.section_bar(4, 'Competitor Analysis')

    pdf.sub('Global Players')
    pdf.competitor('Global', 'Paperless Post',
        '$0 free + $8-$75 coin packs / $150/year unlimited',
        'Polished UI, tracking, paper add-on, 500+ templates',
        'No Indonesian/Islamic templates, no WhatsApp, USD pricing only')
    pdf.competitor('Global', 'Zola',
        'Free (bundled with wedding website)',
        'All-in-one suite: registry + website + invitations, 1000+ designs',
        'US-centric, no adat templates, gift registry irrelevant for Indonesia')
    pdf.competitor('Global', 'Canva',
        'Free / Pro $15/month',
        'Full design freedom, massive template library, familiar tool',
        'Not wedding-specific, no RSVP or guest management, no WhatsApp share')
    pdf.competitor('Global', 'Greenvelope',
        '$20-$159/event or $99/year',
        'Luxury positioning, envelope-opening animation',
        'USD pricing, no Indonesia localization, no adat/Islamic templates')

    pdf.sub('Indonesian Local Players')
    pdf.competitor('ID', 'Undangan.online',
        'Rp 99K-249K (one-time per event)',
        'Affordable, WhatsApp support, Indonesian language',
        'Manual order process, not self-serve, limited template quality')
    pdf.competitor('ID', 'Undangan.id',
        'Rp 150K-350K (one-time)',
        'Admin panel, 50K+ couples served, multi-language support',
        'Dated UI, no self-serve wizard, no live preview editor')
    pdf.competitor('ID', 'Loveweb.id',
        'Rp 175K-450K (one-time)',
        'Lottie animations, Next.js/Tailwind stack, personalized guest URLs',
        'No live preview editor, no subscription tier, expensive exclusive tier')

    pdf.sub('Our Competitive Advantages')
    pdf.callout(
        'We are the only platform combining: self-serve wizard with live phone preview + '
        'adat/Islamic templates + analytics dashboard + modern Next.js stack. '
        'No Indonesian competitor has all four simultaneously.',
        bg=(15, 45, 30), border=GREEN
    )
    pdf.ln(1)
    for item in [
        'Self-serve wizard with live phone preview (unique in Indonesian market)',
        '30 templates across 5 ornament families including full adat coverage',
        '75 color palettes - most customization options in the segment',
        'Analytics dashboard - only Paperless Post globally has this',
        'Modern stack: Next.js 14 + PostgreSQL + Docker (ready to scale)',
    ]:
        pdf.bullet(item)

    pdf.sub('Gaps to Close')
    for item in [
        'No WhatsApp blast - every local competitor has this (Phase 2 priority)',
        'No Lottie animations - Loveweb.id differentiates on this (Phase 3)',
        'No IDR payment gateway - cannot monetize yet (Phase 1 BLOCKER)',
        'No plan enforcement - all users get same features regardless of tier (Phase 1)',
    ]:
        pdf.bullet(item)

    # ---------------------------------------------------------------- PAGE 4: business model
    pdf.add_page()
    pdf.section_bar(5, 'Business Model Options')

    pdf.sub('Option A  -  One-Time Per-Event Payment (Recommended Primary)')
    pdf.body('Customer pays once per wedding event. Access valid 6-24 months by tier.')
    pdf.ln(2)
    pdf.pricing_card('Starter', 'Rp 99.000',
        ['10 templates, RSVP, wishes, gallery, maps, music', '6 months active'],
        (25, 90, 60))
    pdf.pricing_card('Standard', 'Rp 179.000',
        ['30 templates + all Starter features', 'Countdown, analytics, custom slug', '1 year active'],
        NAVY_MID)
    pdf.pricing_card('Premium', 'Rp 299.000',
        ['All templates + all features', 'Custom domain, WhatsApp blast, full analytics', 'Live streaming, 2 years active'],
        NAVY)
    pdf.callout(
        'Best for market entry. Matches local competitor pricing. Lowest friction to first purchase.',
        bg=(15, 45, 30), border=GREEN)

    pdf.sub('Option B  -  Subscription SaaS (B2B / Wedding Organizer Tier)')
    for item in [
        'Personal - Rp 49K/bln: 1 active invitation, basic templates',
        'Pro - Rp 149K/bln: 5 active invitations, all templates, analytics',
        'Business - Rp 499K/bln: Unlimited invitations, white-label, API access',
    ]:
        pdf.bullet(item)
    pdf.callout('Add as B2B tier for Wedding Organizers in Phase 3 only. Hard sell for individual couples.',
        bg=(50, 30, 10), border=ORANGE)

    pdf.sub('Option C  -  Freemium Lead Generation')
    for item in [
        'Free tier: 3 basic templates, platform watermark, max 50 RSVP guests, 3 months active',
        'Upsell to paid tiers to remove watermark and unlock all features',
        'Watermark on free invitations = organic brand exposure to all guests',
    ]:
        pdf.bullet(item)

    pdf.sub('Option D  -  A La Carte Add-Ons (Post-Purchase Upsells)')
    for item in [
        'Custom domain: +Rp 50.000',
        'WhatsApp blast up to 500 contacts: +Rp 75.000',
        'Live streaming embed: +Rp 50.000',
        'Premium animation pack: +Rp 49.000',
        'Extended active period +1 year: +Rp 49.000',
        'QR code for printed card: +Rp 25.000',
    ]:
        pdf.bullet(item)

    pdf.ln(2)
    pdf.sub('Recommended Stack')
    pdf.callout(
        'Primary: One-time per-event (Option A) at Rp 99K / 179K / 299K  |  '
        'Virality: Freemium with watermark  |  '
        'ARPU: A la carte add-ons post-purchase  |  '
        'B2B Phase 3: Monthly subscription for Wedding Organizers',
        bg=(15, 30, 60), border=ACCENT_BLUE)

    # ---------------------------------------------------------------- PAGE 5: roadmap
    pdf.add_page()
    pdf.section_bar(6, 'Recommended Roadmap')

    pdf.phase_block(1, 'Production Hardening', '2-3 weeks', (20, 80, 50), [
        'Fix CORS wildcard - lock to NEXT_PUBLIC_FRONTEND_URL (security critical)',
        'Lock GET /api/rsvp/:id behind auth middleware - guest data currently exposed',
        'Move hardcoded EC2 IP to environment variable',
        'Add input sanitization on wishes/RSVP fields (XSS prevention)',
        'Set up daily database backups (pg_dump cron to S3 or local)',
        'Implement plan enforcement: feature gating tied to users.plan column',
        'Integrate Midtrans or Xendit payment gateway (revenue blocker)',
        'Add uptime monitoring with Telegram alert on downtime',
    ])
    pdf.phase_block(2, 'Core Feature Completion', '3-4 weeks', NAVY_LIGHT, [
        'WhatsApp blast via Fonnte/Wablas (Indonesian WA API providers)',
        'Personalized WA share links with guest name pre-filled via ?to= token',
        'Guest import via CSV upload',
        'Job queue (Bull + Redis) for scheduled reminders: H-7, H-3, H-1, Hari-H',
        'Invitation duplicate/copy feature',
        'Waze + Google Maps dual navigation button',
        'QR code generator for printed invitation cards',
        'Multi-language toggle (ID/EN) on public invitation page',
    ])
    pdf.phase_block(3, 'Premium Experience', '4-6 weeks', (40, 60, 130), [
        'Lottie animations for section transitions',
        'SVG ornament system: 16+ ornaments per section per template',
        'Clip-mask section transitions',
        'Love story carousel with timeline component',
        'Gift registry UI (bank transfer + GoPay/OVO QR)',
        'AI vow/caption generator based on couple story input',
        'Complete Rumah Gadang template with authentic gonjong rooflines',
        '10 new templates: Betawi, Batak, Javanese Keraton, Sundanese, modern minimalist',
    ])
    pdf.phase_block(4, 'Growth & Scale', 'Ongoing', NAVY, [
        'Static pre-render for public invitation pages (Next.js SSG/ISR)',
        'OG image generation per invitation for social sharing previews',
        'SEO: target keywords "undangan digital pernikahan", "undangan online gratis"',
        'WO account type: manage multiple client invitations from one dashboard',
        'White-label option (remove platform branding, add custom logo)',
        'Affiliate/reseller program',
        'React Native companion app for real-time RSVP monitoring',
    ])

    # ---------------------------------------------------------------- PAGE 6: tech debt + NFR
    pdf.add_page()
    pdf.section_bar(7, 'Technical Debt to Address')
    pdf.body('Priority order before public launch:')
    pdf.ln(2)
    for sev, text, color in [
        ('CRITICAL', 'CORS wildcard - origin: "*" must be removed before any public launch', RED),
        ('CRITICAL', 'RSVP endpoint publicly accessible - no auth, guest data exposed', RED),
        ('HIGH',     'Hardcoded EC2 IP in domains route - blocks domain migration', ORANGE),
        ('HIGH',     'No plan enforcement - all users access same features', ORANGE),
        ('HIGH',     'No payment flow - platform cannot generate any revenue', ORANGE),
        ('MEDIUM',   'No database backup strategy - single point of failure on Postgres', (150, 110, 50)),
        ('MEDIUM',   'JWT stored in-memory only - lost on page refresh', (150, 110, 50)),
        ('LOW',      'No rate limiting on wishes endpoint - spam vector', (90, 100, 120)),
    ]:
        pdf.severity_row(sev, text, color)

    pdf.section_bar(8, 'Non-Functional Requirements')
    pdf.sub('Performance')
    for item in ['Lighthouse mobile score > 85', 'First Contentful Paint < 1.5s', 'Time to Interactive < 3s on 4G']:
        pdf.bullet(item)
    pdf.sub('Security')
    for item in ['OWASP Top 10 compliance before launch', 'All file uploads MIME-type validated',
                 'JWT expiry 24h for production (currently 7 days)', 'No secrets hardcoded in source or Docker images']:
        pdf.bullet(item)
    pdf.sub('Scalability')
    for item in ['Stateless backend for horizontal scaling', 'Uploads to S3/Cloudflare R2 before 1000+ users',
                 'CDN for static assets and ornament images']:
        pdf.bullet(item)
    pdf.sub('Availability')
    for item in ['99.9% uptime SLA', 'Public invitation pages load even if backend is down (SSG)',
                 'Graceful degradation on all error states']:
        pdf.bullet(item)

    pdf.section_bar(9, 'Open Questions')
    pdf.ln(1)
    for i, (q, note) in enumerate([
        ('Domain name?',       'e.g. undanganku.id, undangan.ai, lovelink.id'),
        ('Payment gateway?',   'Midtrans vs Xendit - both support IDR, QRIS, Virtual Account'),
        ('WhatsApp API?',      'Official WA Business API vs Fonnte/Wablas/Maytapi'),
        ('Hosting plan?',      'Stay on single EC2 vs ECS / Railway / Vercel'),
        ('Launch strategy?',   'Soft launch invite-only vs public freemium from day one'),
        ('Custom domain UX?',  'Subdomain (name.platform.id) as easier alternative to full custom domain'),
    ], 1):
        pdf.set_font('DV', 'B', 9)
        pdf.set_text_color(*ACCENT_BLUE)
        pdf.cell(6, 6, f'{i}.')
        pdf.set_text_color(*NAVY)
        pdf.cell(65, 6, q)
        pdf.set_font('DV', 'I', 8.5)
        pdf.set_text_color(*DARK_GRAY)
        pdf.multi_cell(W - 71, 6, note)
        pdf.set_text_color(*NAVY)

    pdf.ln(4)
    pdf.callout(
        'Out of Scope v1: Physical/printed invitation ordering, video invitations, '
        'full wedding website builder, vendor marketplace, multi-event per invitation.',
        bg=(20, 25, 40), border=MID_GRAY)

    pdf.output(OUTPUT)
    print(f'PDF written -> {OUTPUT}')


if __name__ == '__main__':
    build()
