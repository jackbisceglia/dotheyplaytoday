import { describe, expect, it } from "@effect/vitest";
import { readdirSync, readFileSync } from "node:fs";
import {
  Database,
  Events,
  EventsLayer,
  Subjects,
  SubjectsLayer,
  Subscriptions,
  SubscriptionsLayer,
  Users,
  UsersLayer,
  IdLayer,
} from "@dtpt/core";
import { createDatabaseLayer } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { EventId, EventSourceId } from "@dtpt/core/modules/events/schema";
import { MmaEvent } from "@dtpt/core/modules/events/variants/mma.schema";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import {
  EmailAddressFromString,
  usersTable,
} from "@dtpt/core/modules/users/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { DateTime, Effect, Layer, Redacted, Schema } from "effect";
import { eq, sql } from "drizzle-orm";

import { reconcileBouts, seedMmaCatalog } from "./import.js";
import { MmaImport } from "./schema.js";
import { ufcCatalog } from "./ufc.js";
import { UfcCoverageIds } from "./catalog.js";

const decoded = Schema.decodeUnknownSync(MmaImport)(ufcCatalog);
const first = decoded.cards[0];
if (!first) throw new Error("Expected seed card");
const bouts = first.details.bouts;

describe("MMA import boundaries", () => {
  it("rejects missing or null event starts and missing main-card times", () => {
    const firstCard = ufcCatalog.cards[0];
    if (!firstCard) throw new Error("Expected card");
    const { startsAt: _startsAt, ...missingStart } = firstCard;
    for (const invalid of [
      missingStart,
      { ...firstCard, startsAt: null },
      { ...firstCard, details: { ...firstCard.details, timings: {} } },
    ]) {
      expect(() =>
        Schema.decodeUnknownSync(MmaImport)({
          fighters: ufcCatalog.fighters,
          cards: [invalid],
        }),
      ).toThrow();
    }
  });

  it("retains omitted bouts in partial input and removes them only in a complete snapshot", () => {
    expect(reconcileBouts(bouts, [], false)).toEqual(bouts);
    expect(reconcileBouts(bouts, [], true)).toEqual([]);
    const cancelled = bouts.map((bout) => ({
      ...bout,
      status: "cancelled" as const,
    }));
    expect(reconcileBouts(bouts, cancelled, false)).toEqual(cancelled);
  });
  it("decodes repeatable curated seeds and rejects unsupported event categories", () => {
    expect(Schema.encodeSync(MmaImport)(decoded)).toEqual(ufcCatalog);
    expect(() =>
      Schema.decodeUnknownSync(MmaEvent)({
        ...ufcCatalog.cards[0]?.details,
        kind: "contender_series",
      }),
    ).toThrow();
  });
});

// Use only an explicitly supplied local scratch DB. All changes, including DDL,
// are rolled back. This does not deploy infrastructure or contact email services.
const testCard = ufcCatalog.cards[0];
if (!testCard) throw new Error("Expected seed card");
const integrationCatalog = {
  ...ufcCatalog,
  cards: [
    testCard,
    {
      ...testCard,
      id: "b51165b6-7428-4620-a02e-000000000099",
      sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000099",
      sourceUrl: "https://www.ufc.com/event/test-fight-night",
      details: {
        ...testCard.details,
        title: "Test Fight Night",
        kind: "fight_night" as const,
        bouts: [],
      },
    },
  ],
};

const databaseUrl = process.env.UFC_TEST_DATABASE_URL;
if (databaseUrl) {
  const url = new URL(databaseUrl);
  if (
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.pathname !== "/dtpt_ufc_test"
  )
    throw new Error("UFC_TEST_DATABASE_URL must point at local dtpt_ufc_test");
}
const integration = it.live.skipIf(!databaseUrl);

describe("UFC PostgreSQL integration", () => {
  integration(
    "migrates, imports, reconciles, selects and schedules without changing unrelated data",
    () => {
      const databaseLayer = createDatabaseLayer(
        Effect.succeed(
          Redacted.make(databaseUrl ?? "postgresql://localhost/dtpt_ufc_test"),
        ),
      );
      const services = Layer.merge(EventsLayer, SubjectsLayer).pipe(
        Layer.provideMerge(Layer.merge(UsersLayer, SubscriptionsLayer)),
        Layer.provide(IdLayer),
        Layer.provide(CloudflareCryptoLayer),
        Layer.provideMerge(databaseLayer),
      );
      return Effect.gen(function* () {
        const database = yield* Database;
        const events = yield* Events;
        const subjects = yield* Subjects;
        const users = yield* Users;
        const subscriptions = yield* Subscriptions;
        const rolledBack = yield* database
          .transaction(() =>
            Effect.gen(function* () {
              const directory = new URL(
                "../../migrations/postgres/",
                import.meta.url,
              );
              for (const filename of readdirSync(directory)
                .filter((name) => name.endsWith(".sql"))
                .sort()) {
                // These migrations contain plain SQL statements, with no
                // procedural bodies or semicolons inside string literals.
                // The PostgreSQL driver accepts one command per query.
                const statements = readFileSync(
                  new URL(filename, directory),
                  "utf8",
                )
                  .replace(/^\s*--.*$/gm, "")
                  .split(";");
                for (const statement of statements) {
                  if (statement.trim()) {
                    yield* database.execute(sql.raw(statement));
                  }
                }
              }
              yield* seedMmaCatalog(integrationCatalog);
              yield* seedMmaCatalog(integrationCatalog);
              expect(yield* subjects.list()).toHaveLength(6);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toHaveLength(1);
              expect(
                yield* events.listBySubject(UfcCoverageIds.all),
              ).toHaveLength(2);
              const [a, b] = decoded.fighters;
              if (!a || !b) throw new Error("Expected fighters and card");
              expect(yield* events.listBySubject(a.id)).toHaveLength(1);

              const teamId = SubjectId.make(
                "40000000-0000-4000-8000-000000000001",
              );
              yield* subjects.upsert({
                id: teamId,
                _tag: "sports_team",
                details: {
                  _tag: "sports_team",
                  leagueId: "nba",
                  display: "Test team",
                  name: "Test",
                  location: "Test",
                  abbreviation: "TST",
                },
              });
              const unrelated = yield* events.upsert({
                id: EventId.make("40000000-0000-4000-8000-000000000002"),
                _tag: "sports_game",
                sourceId: EventSourceId.make(
                  "sports_game:manual:40000000-0000-4000-8000-000000000002",
                ),
                startsAt: DateTime.makeUnsafe("2026-10-03T21:00:00Z"),
                availability: "active",
                details: { _tag: "sports_game", leagueId: "nba" },
              });
              yield* subjects.addEventToFeed({
                subjectId: teamId,
                eventId: unrelated.id,
              });

              const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
              const user = yield* users.create(
                Schema.decodeUnknownSync(EmailAddressFromString)(
                  "ufc-test@example.com",
                ),
                timezone,
              );
              const schedule = {
                _tag: "fixed_local_time",
                sendAtSecondsLocal: 32400,
              } as const;
              yield* subscriptions.replaceForUser({
                user,
                subjectIds: [a.id, b.id, UfcCoverageIds.numbered, teamId],
                schedule,
              });
              expect(yield* subscriptions.listNotificationRecipients()).toEqual(
                [],
              );
              yield* database
                .update(usersTable)
                .set({ emailVerified: true })
                .where(eq(usersTable.id, user.id));
              expect(
                yield* subscriptions.listNotificationRecipients(),
              ).toHaveLength(4);
              const fighterPick = (yield* subscriptions.listForUser(
                user.id,
              )).find((pick) => pick.subjectId === a.id);
              if (!fighterPick) throw new Error("Missing fighter pick");
              const sentAt = DateTime.makeUnsafe("2026-10-03T13:00:00Z");
              yield* subscriptions.markSent({
                subscriptionId: fighterPick.id,
                sentAt,
              });
              yield* subscriptions.replaceForUser({
                user,
                subjectIds: [a.id, b.id, UfcCoverageIds.all, teamId],
                schedule,
              });
              expect(
                (yield* subscriptions.listForUser(user.id)).find(
                  (pick) => pick.subjectId === a.id,
                )?.lastSentAt,
              ).toEqual(sentAt);
              expect(
                (yield* subscriptions
                  .replaceForUser({
                    user,
                    subjectIds: [UfcCoverageIds.numbered, UfcCoverageIds.all],
                    schedule,
                  })
                  .pipe(Effect.flip))._tag,
              ).toBe("InvalidSubjectSelection");
              const otherFighter = decoded.fighters[2];
              if (!otherFighter) throw new Error("Missing fighter");
              expect(
                (yield* subscriptions
                  .replaceForUser({
                    user,
                    subjectIds: [
                      a.id,
                      b.id,
                      otherFighter.id,
                      UfcCoverageIds.all,
                      teamId,
                    ],
                    schedule,
                  })
                  .pipe(Effect.flip))._tag,
              ).toBe("SubjectCapacityReached");

              const range = SubscriptionTiming.localDayUtcRange({
                nowUtc: sentAt,
                timezone,
              });
              const encodedFirst = ufcCatalog.cards[0];
              if (!encodedFirst) throw new Error("Missing encoded card");
              const importCard = (
                details: typeof first.details,
                complete = false,
                availability: "active" | "cancelled" = "active",
                startsAt = encodedFirst.startsAt,
              ) =>
                seedMmaCatalog({
                  fighters: [],
                  cards: [
                    {
                      ...encodedFirst,
                      startsAt,
                      availability,
                      boutsComplete: complete,
                      details: Schema.encodeSync(MmaEvent)(details),
                    },
                  ],
                });
              // A renamed headliner, moved venue and partial empty list retain IDs and follows.
              const renamed = {
                ...first.details,
                title: "UFC 332: Updated headliner",
                venue: { title: "New venue", location: "New city" },
                reviewedAt: DateTime.makeUnsafe("2026-10-04T12:00:00Z"),
                bouts: [],
              };
              yield* importCard(renamed);
              expect((yield* events.listBySubject(a.id))[0]?.id).toBe(first.id);
              // Explicit opponent replacement in the same bout removes the old fighter edge.
              const replacement = {
                ...renamed,
                bouts: first.details.bouts.map((bout) => ({
                  ...bout,
                  fighters: [
                    { subjectId: a.id, title: a.details.display },
                    {
                      subjectId: otherFighter.id,
                      title: otherFighter.details.display,
                    },
                  ],
                })),
              };
              yield* importCard(replacement);
              expect(yield* events.listBySubject(b.id)).toEqual([]);
              expect(yield* events.listBySubject(a.id)).toHaveLength(1);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toHaveLength(1);
              yield* importCard({
                ...replacement,
                bouts: replacement.bouts.map((bout) => ({
                  ...bout,
                  status: "cancelled",
                })),
              });
              expect(yield* events.listBySubject(a.id)).toEqual([]);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toHaveLength(1);
              yield* importCard(replacement);
              // Older sources cannot resurrect removed opponents.
              yield* seedMmaCatalog(integrationCatalog);
              expect(yield* events.listBySubject(b.id)).toEqual([]);
              // Rescheduling changes the ordinary event instant without changing identity.
              yield* importCard(
                {
                  ...replacement,
                  timings: {
                    early: DateTime.makeUnsafe("2026-10-05T20:00:00Z"),
                    prelims: DateTime.makeUnsafe("2026-10-05T21:00:00Z"),
                    main: DateTime.makeUnsafe("2026-10-05T22:00:00Z"),
                  },
                },
                false,
                "active",
                "2026-10-05T20:00:00.000Z",
              );
              expect(yield* events.listBySubject(a.id, { range })).toEqual([]);
              expect((yield* events.listBySubject(a.id))[0]?.id).toBe(first.id);
              const rescheduled = (yield* events.listBySubject(a.id))[0];
              if (!rescheduled) throw new Error("Expected rescheduled card");
              expect(DateTime.formatIso(rescheduled.startsAt)).toBe(
                "2026-10-05T20:00:00.000Z",
              );
              // Complete bout snapshots and explicit cancellations have card-local scope.
              yield* importCard({ ...replacement, bouts: [] }, true);
              expect(yield* events.listBySubject(a.id)).toEqual([]);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toHaveLength(1);
              yield* importCard(replacement, true, "cancelled");
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toEqual([]);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered, {
                  availability: "all",
                }),
              ).toHaveLength(1);
              expect(
                yield* events.listBySubject(UfcCoverageIds.all),
              ).toHaveLength(1);
              expect((yield* events.listBySubject(teamId))[0]?.id).toBe(
                unrelated.id,
              );
              return yield* Effect.fail("rollback-success" as const);
            }),
          )
          .pipe(Effect.flip);
        expect(rolledBack).toBe("rollback-success");
      }).pipe(Effect.provide(services));
    },
    30_000,
  );
});
