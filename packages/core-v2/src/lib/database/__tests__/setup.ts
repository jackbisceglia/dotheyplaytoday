import { SqlClient } from "effect/unstable/sql/SqlClient";
import { Effect } from "effect";

import { createDatabaseLayer } from "../service.js";

export const layerTest = createDatabaseLayer(":memory:");

export const createTables = Effect.gen(function* () {
  const sql = yield* SqlClient;

  yield* sql`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      timezone TEXT NOT NULL,
      unsubscribe_token TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE UNIQUE INDEX users_email_idx
    ON users (email)
  `;

  yield* sql`
    CREATE UNIQUE INDEX users_unsubscribe_token_idx
    ON users (unsubscribe_token)
  `;

  yield* sql`
    CREATE TABLE subjects (
      id TEXT PRIMARY KEY NOT NULL,
      _tag TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE TABLE events (
      id TEXT PRIMARY KEY NOT NULL,
      _tag TEXT NOT NULL,
      source_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      availability TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE UNIQUE INDEX events_tag_source_id_idx
    ON events (_tag, source_id)
  `;

  yield* sql`
    CREATE INDEX events_starts_at_idx
    ON events (starts_at)
  `;

  yield* sql`
    CREATE TABLE subject_events (
      event_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      PRIMARY KEY (event_id, subject_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )
  `;

  yield* sql`
    CREATE INDEX subject_events_subject_id_idx
    ON subject_events (subject_id)
  `;

  yield* sql`
    CREATE TABLE participants (
      id TEXT PRIMARY KEY NOT NULL,
      event_id TEXT NOT NULL,
      _tag TEXT NOT NULL,
      details TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `;

  yield* sql`
    CREATE INDEX participants_event_id_idx
    ON participants (event_id)
  `;
});
