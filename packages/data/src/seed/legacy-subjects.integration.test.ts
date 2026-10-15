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
import { DateTime, Effect, Layer, Predicate, Redacted, Schema } from "effect";

import { ufcCollection } from "../mma/ufc/index.js";
import { nbaCollection } from "../sports/nba/index.js";
import { ncaamCollection } from "../sports/ncaam/index.js";
import { seedCatalog } from "./catalog.js";

const fighter = ufcCollection.subjects.find(Predicate.isTagged("mma_fighter"));
const tracking = ufcCollection.subjects.find(
  Predicate.isTagged("mma_tracking"),
);
const team = nbaCollection.subjects[0];
const college = ncaamCollection.subjects[0];
if (!fighter || !tracking || !team || !college)
  throw new Error("Missing fixtures");
const fixtures = [fighter, tracking, team, college];
const collections = [
  {
    id: ufcCollection.id,
    subjects: fixtures.map((subject) => ({ ...subject, feedIds: [] })),
    events: [],
  },
];

// Deliberately bypass current write schemas: these are actual old JSONB rows.
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
const replaceDetails = Effect.fn(function* (id: string, details: unknown) {
  const database = yield* Database;
  yield* database.execute(
    `UPDATE subjects SET details = ${sqlString(JSON.stringify(details))}::jsonb WHERE id = ${sqlString(id)}`,
  );
});

// An explicitly supplied local scratch database only; DDL and data roll back.
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

describe("legacy subject PostgreSQL migration", () => {
  it.live.skipIf(!databaseUrl)(
    "reads bounded legacy shapes and backfills in place without hiding corruption or collisions",
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
              const directory = new URL(
                "../../migrations/postgres/",
                import.meta.url,
              );
              for (const filename of readdirSync(directory)
                .filter((name) => name.endsWith(".sql"))
                .sort()) {
                for (const statement of readFileSync(
                  new URL(filename, directory),
                  "utf8",
                )
                  .replace(/^\s*--.*$/gm, "")
                  .split(";")) {
                  if (statement.trim()) yield* database.execute(statement);
                }
              }

              for (const subject of fixtures) {
                const { league, ...details } = subject.details;
                yield* insertLegacy(subject.id, subject._tag, {
                  ...details,
                  leagueId: league.id,
                  p4p: undefined,
                  conferenceId:
                    "conferenceId" in league ? league.conferenceId : undefined,
                });
              }
              const legacyRows = yield* database.query.subjectsTable.findMany({
                orderBy: { id: "asc" },
              });
              const read = yield* subjects.list();
              expect(read).toHaveLength(fixtures.length);
              for (const subject of read) {
                expect(yield* subjects.get(subject.id)).toEqual(subject);
                expect(subject.details).not.toHaveProperty("leagueId");
                expect(subject.details).not.toHaveProperty("conferenceId");
              }
              expect(
                (yield* subjects.get(SubjectId.make(fighter.id))).details,
              ).toMatchObject({
                league: { id: "ufc" },
                p4p: null,
              });
              expect(
                (yield* subjects.get(SubjectId.make(college.id))).details,
              ).toMatchObject({ league: { id: "ncaam", apRank: null } });
              // Reads normalize in memory only.
              expect(
                yield* database.query.subjectsTable.findMany({
                  orderBy: { id: "asc" },
                }),
              ).toEqual(legacyRows);

              const user = yield* users.create(
                Schema.decodeUnknownSync(EmailAddressFromString)(
                  "migration@example.com",
                ),
                DateTime.zoneMakeNamedUnsafe("America/New_York"),
              );
              // The old rows predate new subscription readers, so insert the existing
              // subscription directly rather than using the current selection decoder.
              yield* database.execute(
                `INSERT INTO subscriptions (id, user_id, subject_id, schedule, last_sent_at) VALUES ('40000000-0000-4000-8000-000000000001', ${sqlString(user.id)}, ${sqlString(fighter.id)}, '{"_tag":"fixed_local_time","sendAtSecondsLocal":32400}'::jsonb, '2026-10-14T13:00:00.000Z')`,
              );
              const subscriptionBefore =
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

              // Deployed-main teams may have no conference at all. Refuse to invent
              // one, then repair from the authoritative seed by the same subject ID.
              const { league: teamLeague, ...teamDetails } = team.details;
              const incompleteTeam = {
                ...teamDetails,
                leagueId: teamLeague.id,
              };
              yield* replaceDetails(team.id, {
                ...incompleteTeam,
                conferenceId: "sec",
              });
              expect(
                (yield* subjects.get(SubjectId.make(team.id)).pipe(Effect.flip))
                  ._tag,
              ).toBe("SchemaError");
              yield* replaceDetails(team.id, incompleteTeam);
              expect(
                (yield* subjects.get(SubjectId.make(team.id)).pipe(Effect.flip))
                  ._tag,
              ).toBe("SchemaError");
              expect((yield* subjects.list().pipe(Effect.flip))._tag).toBe(
                "SchemaError",
              );

              yield* seedCatalog({ collections, strategy: "all" });
              yield* seedCatalog({ collections, strategy: "all" });
              expect(
                yield* database.query.subscriptionsTable.findMany(),
              ).toEqual(subscriptionBefore);
              expect(
                yield* database.query.subjectEventsTable.findMany(),
              ).toEqual(feedsBefore);
              expect(
                (yield* events.listBySubject(SubjectId.make(team.id)))[0]?.id,
              ).toBe(event.id);
              expect(
                (yield* subscriptions.listForUser(user.id))[0]?.subject.id,
              ).toBe(fighter.id);
              for (const row of yield* database.query.subjectsTable.findMany()) {
                expect(row.details).toHaveProperty("league");
                expect(row.details).not.toHaveProperty("leagueId");
                expect(row.details).not.toHaveProperty("conferenceId");
              }
              expect(
                (yield* subjects.get(SubjectId.make(team.id))).details.league,
              ).toEqual(teamLeague);

              const { league: _league, ...fighterDetails } = fighter.details;
              const legacyFighter = { ...fighterDetails, leagueId: "ufc" };
              for (const invalid of [
                { ...legacyFighter, leagueId: "unknown" },
                { ...legacyFighter, display: "" },
                { ...legacyFighter, p4p: 99 },
                { ...legacyFighter, league: null },
                { ...legacyFighter, league: { id: "unknown" } },
              ]) {
                yield* replaceDetails(fighter.id, invalid);
                expect(
                  (yield* subjects
                    .get(SubjectId.make(fighter.id))
                    .pipe(Effect.flip))._tag,
                ).toBe("SchemaError");
                expect(
                  (yield* seedCatalog({ collections, strategy: "all" }).pipe(
                    Effect.flip,
                  ))._tag,
                ).toBe("SchemaError");
                expect(
                  (yield* database.query.subjectsTable.findFirst({
                    where: { id: fighter.id },
                  }))?.details,
                ).toEqual(invalid);
              }

              // A legacy row of another MMA type must still trip collision validation;
              // an earlier successful upsert in this seed must be rolled back too.
              yield* replaceDetails(fighter.id, legacyFighter);
              yield* database.execute(
                `UPDATE subjects SET _tag = 'mma_fighter' WHERE id = ${sqlString(tracking.id)}`,
              );
              yield* replaceDetails(tracking.id, legacyFighter);
              expect(
                (yield* seedCatalog({ collections, strategy: "all" }).pipe(
                  Effect.flip,
                ))._tag,
              ).toBe("InvalidMmaSeed");
              expect(
                (yield* database.query.subjectsTable.findFirst({
                  where: { id: fighter.id },
                }))?.details,
              ).toEqual(legacyFighter);
              expect(
                yield* database.query.subscriptionsTable.findMany(),
              ).toEqual(subscriptionBefore);
              expect(
                yield* database.query.subjectEventsTable.findMany(),
              ).toEqual(feedsBefore);
              return yield* Effect.fail("rollback-success" as const);
            }),
          )
          .pipe(Effect.flip);
        expect(result).toBe("rollback-success");
      }).pipe(Effect.provide(services));
    },
    30_000,
  );
});
