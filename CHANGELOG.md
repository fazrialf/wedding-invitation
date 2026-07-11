# Changelog — Pelaminan Digital Wedding Invitation

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

> **MAJOR** — breaking changes (DB schema overhaul, complete UI rewrite)
> **MINOR** — new features (new page, new API route, new component)
> **PATCH** — fixes, copy changes, style tweaks, small improvements

---

## [Unreleased]
> Changes staged but not yet tagged

---

## [0.5.0] — 2026-07-11
### Added
- Dashboard home revamped: hero welcome bar, activity feed, plan info card,
  getting started checklist, upcoming wedding countdowns
- Stats row with live counts: Total Undangan, Dipublikasikan, Total RSVP, Ucapan Masuk
- Days-until countdown cards for upcoming wedding dates
- Plan usage progress bar with feature list and upgrade CTA
- Getting started checklist with auto-completion tracking

### Changed
- Dashboard no longer duplicates invitation list — now a genuine analytics home

---

## [0.4.0] — 2026-07-11
### Added
- `/dashboard/invitations` — Undangan list page with search, status filter, delete confirmation modal
- `/dashboard/invitations/[id]/rsvp` — per-invitation RSVP table + CSV export
- `/dashboard/invitations/[id]/wishes` — per-invitation wishes moderation (approve/hide/delete)

### Changed
- RSVP and Wishes removed from top-level sidebar — now scoped under each invitation
- `/dashboard/rsvp` and `/dashboard/wishes` redirect to `/dashboard/invitations`

---

## [0.3.0] — 2026-07-10
### Added
- `PelaminanOrnament.tsx` — Javanese kawung + parang SVG ornament component
- `ThemeContext.tsx` — Light/Dark theme provider with localStorage persistence
- `DashboardSidebar.tsx` — full rebuild with Pelaminan brand, Light/Dark toggle, mobile drawer

### Changed
- Login page — split-panel layout: dark brown brand panel + cream form panel
- Register page — matching split-panel layout
- All page titles updated to "Pelaminan — Digital Wedding Invitation"
- Brand font changed from Great Vibes → Cormorant Garamond italic semibold
- Subtitle changed from "Studio" → "Digital Wedding Invitation"

---

## [0.2.0] — 2026-07-09
### Added
- 25 invitation templates across 5 categories (Minimalist, Floral, Nature, Fairytale, Adat)
- 75 color palettes (3 per template)
- Palette picker in creation wizard Step 3
- Ornament families: floral, nature, fairytale, adat corner + divider + hero images
- `ImageCornerOrnament` and `HeroOrnament` components
- Gift Registry section (`GiftRegistry` component)
- Rundown/Timeline section (`RundownTimeline` component)
- Live phone preview in creation wizard Step 3
- Per-invitation analytics page (page views, RSVP conversion, bar chart)
- Per-invitation reminders page (WhatsApp bulk send)
- Custom domain page with DNS verification
- `docs/CONTROL_PANEL.md` — control panel reference

### Fixed
- Ornament prefix detection covering all 5 categories (flo-*, min-* were missing)
- Corner ornaments use `fixed` positioning (was `absolute`, caused layout breaks)
- Dark background sections use `text-white` opacity tiers instead of `primaryHex`

---

## [0.1.0] — 2026-07-01
### Added
- Initial commit: Wedding Invitation SaaS platform
- Next.js 14 + TypeScript frontend
- Node.js Express backend (port 4000)
- PostgreSQL database with invitations, rsvp_responses, wishes, page_views tables
- Redis for caching
- Nginx reverse proxy (port 8081)
- Docker Compose orchestration (5 containers)
- JWT authentication (login, register)
- Invitation CRUD API
- Public invitation pages (`/[slug]`) with SSR + OG meta tags
- Multi-theme system: gold, silver, dark, floral, minimal
- Envelope opener animation
- RSVP form with dual-insert to wishes table
- WishesWall (UCAPAN) display component
- Photo upload (cover, bride, groom, gallery)
- Background music upload
- WhatsApp share with personalized `?to=GuestName` links
- Mira-Ibrahim (Botanical Elegance) theme

---

[Unreleased]: https://github.com/fazrialf/wedding-invitation/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/fazrialf/wedding-invitation/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/fazrialf/wedding-invitation/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/fazrialf/wedding-invitation/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/fazrialf/wedding-invitation/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fazrialf/wedding-invitation/releases/tag/v0.1.0
