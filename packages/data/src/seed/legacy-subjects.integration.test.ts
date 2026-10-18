import { describe, expect, it } from "@effect/vitest";
import { readdirSync, readFileSync } from "node:fs";
import {
  Database,
  Events,
  EventsLayer,
  IdLayer,
  Subjects,
  SubjectsLayer,
  Subscriptions,
  SubscriptionsLayer,
  Users,
  UsersLayer,
} from "@dtpt/core";
import { createDatabaseLayer } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { EventId, EventSourceId } from "@dtpt/core/modules/events/schema";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import {
  Cause,
  DateTime,
  Effect,
  Exit,
  Layer,
  Predicate,
  Redacted,
  Schema,
} from "effect";

import { ufcCollection } from "../mma/ufc/index.js";
import { mlbCollection } from "../sports/mlb/index.js";
import { nbaCollection } from "../sports/nba/index.js";
import { ncaamCollection } from "../sports/ncaam/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { nhlCollection } from "../sports/nhl/index.js";
import { seedCatalog } from "./catalog.js";

const migrationName = "0006_subject_league_membership.sql";
const migrationsDirectory = new URL(
  "../../migrations/postgres/",
  import.meta.url,
);
const migration = readFileSync(
  new URL(migrationName, migrationsDirectory),
  "utf8",
);
const cleanup = readFileSync(
  new URL("0007_remove_legacy_subject_membership.sql", migrationsDirectory),
  "utf8",
);
const applyMigration = Effect.fn(function* (sql: string) {
  const database = yield* Database;
  for (const statement of sql.split("--> statement-breakpoint")) {
    if (statement.trim()) yield* database.execute(statement);
  }
});
const professionalTeams = [
  nbaCollection,
  nflCollection,
  mlbCollection,
  nhlCollection,
].flatMap((collection) => collection.subjects);
const team = professionalTeams[0];
const college = ncaamCollection.subjects[0];
const fighter = ufcCollection.subjects.find(Predicate.isTagged("mma_fighter"));
const tracking = ufcCollection.subjects.find(
  Predicate.isTagged("mma_tracking"),
);
if (!team || !college || !fighter || !tracking)
  throw new Error("Missing fixtures");
const fixtures = [...professionalTeams, fighter, tracking];

// Deliberately bypass current write schemas to reproduce the stored legacy JSON.
const sqlString = (value: string) => `'${value.replaceAll("'", "''")}'`;
const insertLegacy = Effect.fn(function* (
  id: string,
  tag: string,
  details: unknown,
) {
  const database = yield* Database;
  yield* database.execute(
    `INSERT INTO subjects (id, _tag, details) VALUES (${sqlString(id)}, ${sqlString(tag)}, ${sqlString(JSON.stringify(details))}::jsonb)`,
  );
});

// Explicit local scratch database only. All DDL and data are rolled back.
const databaseUrl = process.env.UFC_TEST_DATABASE_URL;
if (databaseUrl) {
  const url = new URL(databaseUrl);
  if (
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.pathname !== "/dtpt_ufc_test"
  ) {
    throw new Error("UFC_TEST_DATABASE_URL must point at local dtpt_ufc_test");
  }
}

describe("subject league SQL migration", () => {
  it.live.skipIf(!databaseUrl)(
    "expands existing membership, then cleans legacy fields before the separate catalog seed",
    () => {
      const services = Layer.merge(EventsLayer, SubjectsLayer).pipe(
        Layer.provideMerge(Layer.merge(UsersLayer, SubscriptionsLayer)),
        Layer.provide(IdLayer),
        Layer.provide(CloudflareCryptoLayer),
        Layer.provideMerge(
          createDatabaseLayer(
            Effect.succeed(
              Redacted.make(
                databaseUrl ?? "postgresql://localhost/dtpt_ufc_test",
              ),
            ),
          ),
        ),
      );
      return Effect.gen(function* () {
        const database = yield* Database;
        const subjects = yield* Subjects;
        const events = yield* Events;
        const users = yield* Users;
        const subscriptions = yield* Subscriptions;
        const result = yield* database
          .transaction(() =>
            Effect.gen(function* () {
              for (const filename of readdirSync(migrationsDirectory)
                .filter((name) => name.endsWith(".sql") && name < migrationName)
                .sort()) {
                // Historical migrations contain only plain SQL statements.
                const sql = readFileSync(
                  new URL(filename, migrationsDirectory),
                  "utf8",
                );
                for (const statement of sql
                  .replace(/^\s*--.*$/gm, "")
                  .split(";")) {
                  if (statement.trim()) yield* database.execute(statement);
                }
              }

              expect(professionalTeams).toHaveLength(124);
              for (const subject of fixtures) {
                const { league, ...details } = subject.details;
                // Existing professional rows have no conferenceId; the SQL must
                // supply their real affiliations without relying on the new seeds.
                yield* insertLegacy(subject.id, subject._tag, {
                  ...details,
                  leagueId: league.id,
                });
              }
              const legacyRows = yield* database.query.subjectsTable.findMany({
                orderBy: { id: "asc" },
              });
              expect((yield* subjects.list().pipe(Effect.flip))._tag).toBe(
                "SchemaError",
              );

              const user = yield* users.create(
                Schema.decodeUnknownSync(EmailAddressFromString)(
                  "migration@example.com",
                ),
                DateTime.zoneMakeNamedUnsafe("America/New_York"),
              );
              yield* database.execute(
                `INSERT INTO subscriptions (id, user_id, subject_id, schedule, last_sent_at) VALUES ('40000000-0000-4000-8000-000000000001', ${sqlString(user.id)}, ${sqlString(fighter.id)}, '{"_tag":"fixed_local_time","sendAtSecondsLocal":32400}'::jsonb, '2026-10-14T13:00:00.000Z')`,
              );
              const subscriptionsBefore =
                yield* database.query.subscriptionsTable.findMany();
              const event = yield* events.upsert({
                id: EventId.make("40000000-0000-4000-8000-000000000002"),
                _tag: "sports_game",
                sourceId: EventSourceId.make(
                  "sports_game:manual:40000000-0000-4000-8000-000000000002",
                ),
                startsAt: DateTime.makeUnsafe("2026-10-15T20:00:00Z"),
                availability: "active",
                details: { _tag: "sports_game", leagueId: "nba" },
              });
              yield* subjects.addEventToFeed({
                subjectId: SubjectId.make(team.id),
                eventId: event.id,
              });
              const feedsBefore =
                yield* database.query.subjectEventsTable.findMany();

              // Unknown conference-less IDs and malformed nested values must fail
              // atomically, rather than leave a partly migrated database.
              const { league: _teamLeague, ...teamDetails } = team.details;
              const invalidId = "40000000-0000-4000-8000-000000000099";
              for (const invalid of [
                { ...teamDetails, leagueId: "nba" },
                {
                  ...teamDetails,
                  leagueId: "nba",
                  league: { id: "nba", conferenceId: "sec" },
                },
              ]) {
                yield* insertLegacy(invalidId, "sports_team", invalid);
                const failed = yield* database
                  .transaction(() => applyMigration(migration))
                  .pipe(Effect.exit);
                expect(Exit.isFailure(failed)).toBe(true);
                if (Exit.isFailure(failed)) {
                  expect(Cause.pretty(failed.cause)).toContain(
                    "invalid or unmapped membership",
                  );
                }
                yield* database.execute(
                  `DELETE FROM subjects WHERE id = ${sqlString(invalidId)}`,
                );
                expect(
                  yield* database.query.subjectsTable.findMany({
                    orderBy: { id: "asc" },
                  }),
                ).toEqual(legacyRows);
              }

              yield* applyMigration(migration);
              const expanded = yield* database.query.subjectsTable.findMany({
                orderBy: { id: "asc" },
              });
              // The migration adds membership only; old readers keep every old field.
              expect(
                expanded.map(
                  ({ details: { league: _league, ...details }, ...row }) => ({
                    ...row,
                    details,
                  }),
                ),
              ).toEqual(legacyRows);
              yield* applyMigration(migration);
              expect(
                yield* database.query.subjectsTable.findMany({
                  orderBy: { id: "asc" },
                }),
              ).toEqual(expanded);

              const migrated = yield* subjects.list();
              expect(migrated).toHaveLength(fixtures.length);
              for (const subject of fixtures) {
                const current = yield* subjects.get(SubjectId.make(subject.id));
                expect(current.details.league).toEqual(subject.details.league);
                expect(current.details).not.toHaveProperty("leagueId");
              }
              expect(
                (yield* subscriptions.listForUser(user.id))[0]?.subject.id,
              ).toBe(fighter.id);
              expect(
                yield* database.query.subscriptionsTable.findMany(),
              ).toEqual(subscriptionsBefore);
              expect(
                yield* database.query.subjectEventsTable.findMany(),
              ).toEqual(feedsBefore);
              expect(
                yield* subjects
                  .get(SubjectId.make(college.id))
                  .pipe(Effect.flip),
              ).toMatchObject({ _tag: "SubjectNotFound" });

              // The contract migration must also clean rows outside the catalog.
              const uncatalogId = "40000000-0000-4000-8000-000000000098";
              yield* insertLegacy(uncatalogId, "sports_team", {
                ...team.details,
                leagueId: team.details.league.id,
                conferenceId: team.details.league.conferenceId,
              });
              const beforeCleanup =
                yield* database.query.subjectsTable.findMany({
                  orderBy: { id: "asc" },
                });
              const canonicalBeforeCleanup = yield* subjects.list();

              // Refuse to erase the only membership on a still-flat row.
              yield* insertLegacy(invalidId, "sports_team", {
                ...teamDetails,
                leagueId: "nba",
              });
              const failedCleanup = yield* database
                .transaction(() => applyMigration(cleanup))
                .pipe(Effect.exit);
              expect(Exit.isFailure(failedCleanup)).toBe(true);
              if (Exit.isFailure(failedCleanup)) {
                expect(Cause.pretty(failedCleanup.cause)).toContain(
                  "cleanup requires valid nested membership",
                );
              }
              yield* database.execute(
                `DELETE FROM subjects WHERE id = ${sqlString(invalidId)}`,
              );
              expect(
                yield* database.query.subjectsTable.findMany({
                  orderBy: { id: "asc" },
                }),
              ).toEqual(beforeCleanup);

              // Simulate the later deployment only after old workers retire.
              yield* applyMigration(cleanup);
              const cleaned = yield* database.query.subjectsTable.findMany({
                orderBy: { id: "asc" },
              });
              for (const row of cleaned) {
                expect(row.details).not.toHaveProperty("leagueId");
                expect(row.details).not.toHaveProperty("conferenceId");
              }
              expect(yield* subjects.list()).toEqual(canonicalBeforeCleanup);
              yield* applyMigration(cleanup);
              expect(
                yield* database.query.subjectsTable.findMany({
                  orderBy: { id: "asc" },
                }),
              ).toEqual(cleaned);
              expect(
                (yield* events.listBySubject(SubjectId.make(team.id)))[0]
                  ?.details,
              ).toEqual({ _tag: "sports_game", leagueId: "nba" });

              // The version bump refreshes the catalog after SQL cleanup.
              const collections = [
                {
                  id: ufcCollection.id,
                  subjects: [...fixtures, college].map((subject) => ({
                    ...subject,
                    feedIds: [],
                  })),
                  events: [],
                },
              ];
              yield* seedCatalog({ collections, strategy: "all" });
              yield* seedCatalog({ collections, strategy: "all" });
              expect(yield* subjects.list()).toHaveLength(fixtures.length + 2);
              expect(
                (yield* subjects.get(SubjectId.make(uncatalogId))).details
                  .league,
              ).toEqual(team.details.league);
              for (const row of yield* database.query.subjectsTable.findMany()) {
                expect(row.details).toHaveProperty("league");
                expect(row.details).not.toHaveProperty("leagueId");
              }
              expect(
                yield* database.query.subscriptionsTable.findMany(),
              ).toEqual(subscriptionsBefore);
              expect(
                yield* database.query.subjectEventsTable.findMany(),
              ).toEqual(feedsBefore);
              expect(
                (yield* events.listBySubject(SubjectId.make(team.id)))[0]?.id,
              ).toBe(event.id);

              // The migration does not weaken the existing MMA identity check.
              const { feedIds: _feedIds, ...fighterInput } = fighter;
              const collision = [
                {
                  id: ufcCollection.id,
                  subjects: [{ ...fighterInput, id: tracking.id, feedIds: [] }],
                  events: [],
                },
              ];
              expect(
                (yield* seedCatalog({
                  collections: collision,
                  strategy: "all",
                }).pipe(Effect.flip))._tag,
              ).toBe("InvalidMmaSeed");
              return yield* Effect.fail("rollback-success" as const);
            }),
          )
          .pipe(Effect.flip);
        expect(result).toBe("rollback-success");
      }).pipe(Effect.provide(services));
    },
    60_000,
  );
});
