CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  timezone TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL
);

CREATE UNIQUE INDEX users_email_idx
ON users (email);

CREATE UNIQUE INDEX users_unsubscribe_token_idx
ON users (unsubscribe_token);

CREATE TABLE subjects (
  id TEXT PRIMARY KEY NOT NULL,
  _tag TEXT NOT NULL,
  details TEXT NOT NULL
);

CREATE TABLE events (
  id TEXT PRIMARY KEY NOT NULL,
  _tag TEXT NOT NULL,
  source_id TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  availability TEXT NOT NULL,
  details TEXT NOT NULL
);

CREATE UNIQUE INDEX events_tag_source_id_idx
ON events (_tag, source_id);

CREATE INDEX events_starts_at_idx
ON events (starts_at);

CREATE TABLE subject_events (
  event_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  PRIMARY KEY (event_id, subject_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE INDEX subject_events_subject_id_idx
ON subject_events (subject_id);

CREATE TABLE participants (
  id TEXT PRIMARY KEY NOT NULL,
  event_id TEXT NOT NULL,
  _tag TEXT NOT NULL,
  details TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX participants_event_id_idx
ON participants (event_id);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  schedule TEXT NOT NULL,
  last_sent_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE INDEX subscriptions_user_id_idx
ON subscriptions (user_id);

CREATE INDEX subscriptions_subject_id_idx
ON subscriptions (subject_id);

CREATE UNIQUE INDEX subscriptions_user_subject_idx
ON subscriptions (user_id, subject_id);
