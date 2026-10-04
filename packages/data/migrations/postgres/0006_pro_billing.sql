-- Freeze the existing-user cohort when this migration runs. New accounts get Free.
ALTER TABLE users
  ADD COLUMN grandfathered_pro BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN stripe_customer_id TEXT;

UPDATE users SET grandfathered_pro = TRUE;

CREATE TABLE billing_subscriptions (
  id TEXT PRIMARY KEY NOT NULL,
  plan TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete',
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  price_id TEXT,
  checkout_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revision INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX users_stripe_customer_id_idx ON users(stripe_customer_id);
CREATE INDEX billing_subscriptions_user_id_idx ON billing_subscriptions(user_id);
CREATE UNIQUE INDEX billing_subscriptions_stripe_subscription_id_idx ON billing_subscriptions(stripe_subscription_id);
CREATE UNIQUE INDEX billing_subscriptions_pending_checkout_idx ON billing_subscriptions(user_id)
  WHERE status = 'incomplete' AND stripe_subscription_id IS NULL;
