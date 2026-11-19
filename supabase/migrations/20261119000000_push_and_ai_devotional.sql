-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint   TEXT UNIQUE NOT NULL,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  locale     TEXT NOT NULL DEFAULT 'zh-TW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated devotional content (keyed by date)
CREATE TABLE IF NOT EXISTS ai_devotional_content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_id           TEXT NOT NULL,
  date                DATE NOT NULL,
  notification_title  TEXT,
  notification_body   TEXT,
  devotional_text     TEXT,
  prayer_prompt       TEXT,
  email_intro         TEXT,
  generated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_devotional_content_date_idx ON ai_devotional_content (date);
