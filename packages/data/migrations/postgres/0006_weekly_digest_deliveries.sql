CREATE TABLE weekly_digest_deliveries (
  user_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  rendered JSONB NOT NULL,
  sent_at TEXT,
  PRIMARY KEY (user_id, week_start),
  CONSTRAINT weekly_digest_deliveries_user_id_users_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
