-- Wedding Digital Invitation — Database Schema
-- Run this on first startup via init script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  plan          VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free','standard','premium')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Themes
CREATE TABLE IF NOT EXISTS themes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            VARCHAR(50) UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  preview_image_url TEXT,
  config_json     JSONB DEFAULT '{}'
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug              VARCHAR(100) UNIQUE NOT NULL,
  theme_slug        VARCHAR(50) DEFAULT 'gold',
  bride_name        VARCHAR(255) NOT NULL,
  bride_full_name   VARCHAR(255),
  bride_bio         TEXT,
  bride_father      VARCHAR(255),
  bride_mother      VARCHAR(255),
  bride_photo_url   TEXT,
  groom_name        VARCHAR(255) NOT NULL,
  groom_full_name   VARCHAR(255),
  groom_bio         TEXT,
  groom_father      VARCHAR(255),
  groom_mother      VARCHAR(255),
  groom_photo_url   TEXT,
  wedding_date      DATE NOT NULL,
  akad_date         VARCHAR(100),
  akad_time         VARCHAR(50),
  akad_venue        TEXT,
  reception_date    VARCHAR(100),
  reception_time    VARCHAR(50),
  reception_venue   TEXT,
  venue_lat         DECIMAL(10,8),
  venue_lng         DECIMAL(11,8),
  cover_photo_url   TEXT,
  music_url         TEXT,
  is_published      BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RSVP Responses
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name     VARCHAR(255) NOT NULL,
  attendance     VARCHAR(10) CHECK (attendance IN ('hadir','tidak')),
  guest_count    INTEGER DEFAULT 1,
  message        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Wishes / Messages
CREATE TABLE IF NOT EXISTS wishes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name     VARCHAR(255) NOT NULL,
  message        TEXT NOT NULL,
  is_approved    BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Guest list (personalized links)
CREATE TABLE IF NOT EXISTS invitation_guests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name     VARCHAR(255) NOT NULL,
  unique_token   VARCHAR(100) UNIQUE NOT NULL,
  opened_at      TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invitations_slug    ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id  ON rsvp_responses(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);

-- Seed themes
INSERT INTO themes (slug, name) VALUES
  ('gold',    'Gold'),
  ('silver',  'Silver'),
  ('dark',    'Dark'),
  ('floral',  'Floral'),
  ('minimal', 'Minimal')
ON CONFLICT (slug) DO NOTHING;
