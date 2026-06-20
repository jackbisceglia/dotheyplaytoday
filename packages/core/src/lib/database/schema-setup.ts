import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

export const createTablesIfMissing = Effect.fn(
  "Database.createTablesIfMissing",
)(function* () {
  const sql = yield* SqlClient;

  yield* sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      timezone TEXT NOT NULL,
      unsubscribe_token TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx
    ON users (email)
  `;

  yield* sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_unsubscribe_token_idx
    ON users (unsubscribe_token)
  `;

  yield* sql`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY NOT NULL,
      _tag TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      _tag TEXT NOT NULL,
      source_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      availability TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE UNIQUE INDEX IF NOT EXISTS events_tag_source_id_idx
    ON events (_tag, source_id)
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS events_starts_at_idx
    ON events (starts_at)
  `;

  yield* sql`
    CREATE TABLE IF NOT EXISTS subject_events (
      event_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      PRIMARY KEY (event_id, subject_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS subject_events_subject_id_idx
    ON subject_events (subject_id)
  `;

  yield* sql`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY NOT NULL,
      event_id TEXT NOT NULL,
      _tag TEXT NOT NULL,
      details TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS participants_event_id_idx
    ON participants (event_id)
  `;

  yield* sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      schedule TEXT NOT NULL,
      last_sent_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx
    ON subscriptions (user_id)
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS subscriptions_subject_id_idx
    ON subscriptions (subject_id)
  `;

  yield* sql`
    CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_subject_idx
    ON subscriptions (user_id, subject_id)
  `;
});
