-- Analytics page views table
CREATE TABLE IF NOT EXISTS page_views (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name     TEXT,
  ip_address     TEXT,
  user_agent     TEXT,
  referer        TEXT,
  viewed_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_invitation ON page_views(invitation_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at  ON page_views(viewed_at);

-- Custom domains table
CREATE TABLE IF NOT EXISTS custom_domains (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID REFERENCES invitations(id) ON DELETE CASCADE UNIQUE,
  domain         TEXT UNIQUE NOT NULL,
  verified       BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Email reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id  UUID REFERENCES invitations(id) ON DELETE CASCADE,
  reminder_type  TEXT NOT NULL CHECK (reminder_type IN ('email','whatsapp')),
  recipient_name TEXT NOT NULL,
  recipient      TEXT NOT NULL,
  message        TEXT,
  sent           BOOLEAN DEFAULT false,
  sent_at        TIMESTAMPTZ,
  scheduled_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_invitation ON reminders(invitation_id);
