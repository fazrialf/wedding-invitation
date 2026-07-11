# Pelaminan — Control Panel Documentation

> Digital Wedding Invitation Platform  
> *Dari Hati, Untuk Selamanya*

## Brand Identity

| Token | Value |
|---|---|
| Product name | Pelaminan |
| Tagline | Dari Hati, Untuk Selamanya |
| Primary | `#6B3F2A` — deep batik brown |
| Gold | `#C8A96E` — warm kuningan |
| Cream | `#E8DCC8` — ivory accent |
| Surface | `#FAF7F2` — off-white warm |
| Dark | `#2C1A0E` — very dark brown |
| Highlight | `#8B1A1A` — deep sirah merah |
| Brand font | Cormorant Garamond italic, semibold |
| Label font | Cinzel, tracked uppercase |
| Body font | Lato |
| Heading font | Playfair Display |

---

## Architecture

```
nginx (:8081)
├── frontend — Next.js 14 (:3000)
└── backend  — Node.js Express (:4000)
     ├── postgres (:5432)
     └── redis (:6379)
```

Rebuild & redeploy:
```bash
cd /home/ssm-user/wedding-invitation
docker compose build frontend
docker compose up -d --force-recreate frontend
```

---

## Page Structure

```
/login                              ← Split-panel login (dark brand + cream form)
/register                           ← Split-panel register (form + dark brand)
/dashboard                          ← Analytics overview
/dashboard/invitations              ← Undangan list (search, filter, delete)
/dashboard/invitations/new          ← 3-step creation wizard
/dashboard/invitations/[id]/edit    ← Full editor (details, media, share, design)
/dashboard/invitations/[id]/rsvp    ← Per-invitation RSVP table + CSV export
/dashboard/invitations/[id]/wishes  ← Per-invitation wishes moderation
/dashboard/invitations/[id]/guests  ← Guest personalization tokens
/dashboard/invitations/[id]/analytics ← Page view analytics
/[slug]                             ← Public invitation page (SSR + OG tags)
```

---

## Key Components

### `PelaminanOrnament.tsx`
Self-contained Javanese SVG ornament (kawung medallion + parang border + corner lotus).  
Props: `width`, `height`, `className`. Used on login/register brand panels.

### `DashboardSidebar.tsx`
- Light/Dark theme toggle — persisted to `localStorage` key `pelaminan-theme`
- Theme change event: `window.dispatchEvent(new Event('pelaminan-theme-change'))`
- Nav: Dashboard → Undangan → Pengaturan
- RSVP & Wishes are **not** in the sidebar — they live under each invitation

### `ThemeContext.tsx`
React context for sidebar theme. Default: `light`.  
Hook: `useTheme()` → `{ theme, toggleTheme }`

---

## Theme System

All dashboard pages support Light/Dark mode via localStorage.  
Pages read `pelaminan-theme` on mount and listen for `pelaminan-theme-change` events.

**Light:** `#FAF7F2` surface, `#2C1A0E` text, `#E8DCC8` borders  
**Dark:** `#1C0F07` surface, `#E8DCC8` text, `#4A2E18` borders

---

## API Endpoints (Backend)

```
GET    /api/invitations              ← list user's invitations
POST   /api/invitations              ← create invitation
GET    /api/invitations/by-id/:id    ← get single invitation
PUT    /api/invitations/:id          ← update invitation
DELETE /api/invitations/:id          ← delete invitation

GET    /api/rsvp/:invitationId       ← get RSVPs for invitation
POST   /api/rsvp                     ← submit RSVP (public)

GET    /api/wishes/all/:invitationId ← get all wishes (auth)
PATCH  /api/wishes/:id               ← toggle approval
DELETE /api/wishes/:id               ← delete wish
POST   /api/wishes                   ← submit wish (public)

POST   /api/uploads/photo            ← upload cover photo
POST   /api/uploads/music            ← upload background music
```

---

## Navigation Structure

```
Sidebar
├── Dashboard      /dashboard            analytics stats + recent invitations
└── Undangan       /dashboard/invitations
     └── [card]
          ├── Edit    → /dashboard/invitations/[id]/edit
          ├── RSVP    → /dashboard/invitations/[id]/rsvp
          ├── Ucapan  → /dashboard/invitations/[id]/wishes
          └── Lihat   → /[slug]  (new tab)
```

---

## Undangan List Features

- Search by bride name, groom name, or slug
- Filter by status: Semua / Aktif / Draft
- Delete with confirmation modal (warns about permanent data loss)
- Quick links to Edit, RSVP, Ucapan, Lihat per card

---

## RSVP Page Features

- Stats: Total Respons, Hadir, Tidak Hadir, Total Tamu
- Sortable table with all guest responses
- CSV export: downloads `rsvp-{slug}.csv`
- Breadcrumb navigation back to Undangan list

---

## Wishes Page Features

- Card grid layout with quote-mark styling
- Approve / hide toggle per wish
- Delete individual wishes
- Stats: Total, Ditampilkan, Disembunyikan

---

## Deployment

Live URL: `http://47.128.231.30:8081`  
GitHub: `https://github.com/fazrialf/wedding-invitation` (branch: `docs/prd`)

```bash
# Full rebuild
docker compose build frontend
docker compose up -d --force-recreate frontend

# Check status
docker compose ps
docker compose logs frontend --tail=50
```
