-- Plan enforcement: add starter tier + expiry tracking

-- 1. Drop old check constraint and add starter
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE users ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('free', 'starter', 'standard', 'premium'));

-- 2. Add plan expiry column (NULL = no expiry / lifetime)
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  plan_expires_at TIMESTAMPTZ DEFAULT NULL;

-- Free tier expires 3 months from account creation
-- Set for existing free users who don't have an expiry yet
UPDATE users
  SET plan_expires_at = created_at + INTERVAL '3 months'
  WHERE plan = 'free' AND plan_expires_at IS NULL;
