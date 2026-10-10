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
import { DateTime, Effect, Layer, Predicate, Redacted, Schema } from "effect";

import { seedCatalog } from "./catalog.js";
import { MmaSeed } from "../schema/mma.js";
import { ufcCollection as catalog } from "../mma/ufc/index.js";
import { UfcCoverageIds } from "../mma/ufc/subjects.js";

// Fix the date and use one fight to isolate reconciliation from live lineup size.
const sourceCard = catalog.events[0];
if (!sourceCard) throw new Error("Expected catalog card");
const participants = sourceCard.participants.slice(0, 2);
const fighterTitles = new Set(participants.map((p) => p.details.title));
const fighters = catalog.subjects.filter(Predicate.isTagged("mma_fighter"));
const ufcCollection = {
  ...catalog,
  events: [
    {
      ...sourceCard,
      startsAt: "2026-10-03T20:00:00.000Z",
      details: {
        ...sourceCard.details,
        category: "numbered" as const,
        timings: {
          prelims: "2026-10-03T20:00:00.000Z",
          main: "2026-10-04T00:00:00.000Z",
        },
      },
      participants,
    },
  ],
  subjects: [
    ...fighters.filter((fighter) => fighterTitles.has(fighter.details.display)),
    ...fighters
      .filter((fighter) => !fighterTitles.has(fighter.details.display))
      .slice(0, 2),
    ...catalog.subjects.filter(Predicate.isTagged("mma_tracking")),
  ].map((subject) => ({
    ...subject,
    feedIds:
      subject._tag === "mma_tracking" ||
      fighterTitles.has(subject.details.display)
        ? [sourceCard.sourceId]
        : [],
  })),
};

const decoded = Schema.decodeUnknownSync(MmaSeed)(ufcCollection);
const first = decoded.events[0];
if (!first) throw new Error("Expected seed card");

describe("MMA import boundaries", () => {
  it("rejects missing or null event starts and missing main-card times", () => {
    const firstCard = ufcCollection.events[0];
    if (!firstCard) throw new Error("Expected card");
    const { startsAt: _startsAt, ...missingStart } = firstCard;
    for (const invalid of [
      missingStart,
      { ...firstCard, startsAt: null },
      { ...firstCard, startsAt: "2026-10-04T20:00:00.000Z" },
      { ...firstCard, details: { ...firstCard.details, timings: {} } },
    ]) {
      expect(() =>
        Schema.decodeUnknownSync(MmaSeed)({
          id: ufcCollection.id,
          subjects: ufcCollection.subjects,
          events: [invalid],
        }),
      ).toThrow();
    }
  });

  it("rejects duplicate fighters, oversized fights, and conflicting placement at the seed boundary", () => {
    const card = ufcCollection.events[0];
    const participant = card?.participants[0];
    const thirdFighter = ufcCollection.subjects.filter(
      Predicate.isTagged("mma_fighter"),
    )[2];
    if (!card || !participant || !thirdFighter)
      throw new Error("Expected catalog fixtures");
    const { placement: _placement, ...unassigned } = participant.details;
    for (const participants of [
      [{ ...participant, details: unassigned }],
      [
        ...card.participants,
        {
          ...participant,
          details: {
            ...participant.details,
            title: thirdFighter.details.display,
          },
        },
      ],
      card.participants.map((p, index) => ({
        ...p,
        details: { ...p.details, placement: index === 0 ? "main" : "prelims" },
      })),
      [
        ...card.participants,
        {
          ...participant,
          details: { ...participant.details, fightId: "another-fight" },
        },
      ],
    ]) {
      expect(() =>
        Schema.decodeUnknownSync(MmaSeed)({
          id: ufcCollection.id,
          subjects: ufcCollection.subjects,
          events: [{ ...card, participants }],
        }),
      ).toThrow();
    }
  });

  it("decodes repeatable curated seeds and rejects unsupported event categories", () => {
    expect(Schema.encodeSync(MmaSeed)(decoded)).toEqual(ufcCollection);
    expect(() =>
      Schema.decodeUnknownSync(MmaEvent)({
        ...ufcCollection.events[0]?.details,
        category: "contender_series",
      }),
    ).toThrow();
  });
});

// Use only an explicitly supplied local scratch DB. All changes, including DDL,
// are rolled back. This does not deploy infrastructure or contact email services.
const testCard = ufcCollection.events[0];
if (!testCard) throw new Error("Expected seed card");
const integrationEvents = [
  testCard,
  {
    ...testCard,
    id: "b51165b6-7428-4620-a02e-000000000099",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000099",
    sourceUrl: "https://www.ufc.com/event/test-fight-night",
    participants: [],
    details: {
      ...testCard.details,
      title: "Test Fight Night",
      category: "fight_night" as const,
    },
  },
];
const collectionWithEvents = (events: MmaSeed["events"]): MmaSeed => ({
  ...decoded,
  events,
  subjects: decoded.subjects.map((subject) => ({
    ...subject,
    feedIds: events
      .filter((event) =>
        Predicate.isTagged(subject, "mma_tracking")
          ? subject.details.scope === "all" ||
            event.details.category === "numbered"
          : event.participants.some(
              (participant) =>
                participant.details.title === subject.details.display,
            ),
      )
      .map((event) => event.sourceId),
  })),
});
const integrationCatalog = Schema.encodeSync(MmaSeed)(
  collectionWithEvents(
    Schema.decodeUnknownSync(MmaSeed)({
      ...ufcCollection,
      events: integrationEvents,
    }).events,
  ),
);

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
                    yield* database.execute(statement);
                  }
                }
              }
              yield* seedCatalog({
                collections: [integrationCatalog],
                strategy: "all",
              });
              yield* seedCatalog({
                collections: [integrationCatalog],
                strategy: "all",
              });
              expect(yield* subjects.list()).toHaveLength(6);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered),
              ).toHaveLength(1);
              expect(
                yield* events.listBySubject(UfcCoverageIds.all),
              ).toHaveLength(2);
              const [a, b] = decoded.subjects.filter(
                Predicate.isTagged("mma_fighter"),
              );
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
              yield* database.update(usersTable).set({ emailVerified: true });
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
              const otherFighter = decoded.subjects.filter(
                Predicate.isTagged("mma_fighter"),
              )[2];
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
              const importCard = (card: typeof first) =>
                seedCatalog({
                  collections: [
                    Schema.encodeSync(MmaSeed)(collectionWithEvents([card])),
                  ],
                  strategy: "all",
                });
              const cardFor = (subjectId: typeof a.id) =>
                events.listBySubject(subjectId);
              const renamed = {
                ...first,
                details: {
                  ...first.details,
                  title: "UFC 332: Updated headliner",
                  venue: { title: "New venue", location: "New city" },
                },
              };
              yield* importCard(renamed);
              expect((yield* cardFor(a.id))[0]?.id).toBe(first.id);
              expect(
                (yield* importCard({
                  ...renamed,
                  id: EventId.make("b51165b6-7428-4620-a02e-000000000098"),
                }).pipe(Effect.flip))._tag,
              ).toBe("InvalidMmaSeed");
              expect((yield* cardFor(a.id))[0]?.id).toBe(first.id);

              expect((yield* cardFor(a.id))[0]?.participants).toHaveLength(2);
              // A bad later card rolls back the first card's metadata, participants and matches.
              const cleared = {
                ...renamed,
                participants: [],
              };
              const invalid = {
                ...first,
                sourceId: EventSourceId.make(
                  "mma_card:ufc:b51165b6-7428-4620-a02e-000000000099",
                ),
                id: EventId.make("b51165b6-7428-4620-a02e-000000000098"),
              };
              expect(
                (yield* seedCatalog({
                  collections: [
                    Schema.encodeSync(MmaSeed)(
                      collectionWithEvents([cleared, invalid]),
                    ),
                  ],
                  strategy: "all",
                }).pipe(Effect.flip))._tag,
              ).toBe("InvalidMmaSeed");
              expect((yield* cardFor(a.id))[0]?.details).toEqual(
                renamed.details,
              );
              expect((yield* cardFor(a.id))[0]?.participants).toHaveLength(2);
              // A single known participant represents an unknown opponent.
              yield* importCard({
                ...renamed,
                participants: first.participants.slice(0, 1),
              });
              expect((yield* cardFor(a.id))[0]?.participants).toHaveLength(1);
              expect(yield* cardFor(b.id)).toEqual([]);
              const replacement = {
                ...renamed,
                participants: first.participants.map((participant) =>
                  participant.details.title === b.details.display
                    ? {
                        ...participant,
                        details: {
                          ...participant.details,
                          title: otherFighter.details.display,
                        },
                      }
                    : participant,
                ),
              };
              yield* importCard(replacement);
              yield* importCard(replacement);
              expect(yield* cardFor(b.id)).toEqual([]);
              expect(
                (yield* cardFor(a.id))[0]?.participants.map((p) => p.details),
              ).toEqual(
                expect.arrayContaining(
                  replacement.participants.map((p) => p.details),
                ),
              );
              expect((yield* cardFor(a.id))[0]?.participants).toHaveLength(2);
              expect(yield* cardFor(UfcCoverageIds.numbered)).toHaveLength(1);
              // Grouping changes affect display, not card or fighter identity/matching.
              const regrouped = replacement.participants.map((p, index) => ({
                ...p,
                details: {
                  ...p.details,
                  fightId: `fight-${String(index + 1)}`,
                },
              }));
              yield* importCard({ ...replacement, participants: regrouped });
              expect((yield* cardFor(a.id))[0]?.id).toBe(first.id);
              expect(
                (yield* cardFor(a.id))[0]?.participants.map((p) => p.details),
              ).toEqual(
                expect.arrayContaining(regrouped.map((p) => p.details)),
              );
              yield* importCard(cleared);
              expect(yield* cardFor(a.id)).toEqual([]);
              expect(
                (yield* cardFor(UfcCoverageIds.numbered))[0]?.participants,
              ).toEqual([]);
              yield* importCard(replacement);
              // Rescheduling uses the ordinary event instant and keeps the card ID.
              yield* importCard({
                ...replacement,
                startsAt: DateTime.makeUnsafe("2026-10-05T20:00:00Z"),
                details: {
                  ...replacement.details,
                  timings: {
                    prelims: DateTime.makeUnsafe("2026-10-05T20:00:00Z"),
                    main: DateTime.makeUnsafe("2026-10-05T22:00:00Z"),
                  },
                },
              });
              expect(yield* events.listBySubject(a.id, { range })).toEqual([]);
              const rescheduled = (yield* cardFor(a.id))[0];
              if (!rescheduled) throw new Error("Expected rescheduled card");
              expect(rescheduled.id).toBe(first.id);
              expect(DateTime.formatIso(rescheduled.startsAt)).toBe(
                "2026-10-05T20:00:00.000Z",
              );
              yield* importCard({
                ...replacement,
                details: { ...replacement.details, category: "fight_night" },
              });
              expect(yield* cardFor(UfcCoverageIds.numbered)).toEqual([]);
              expect(yield* cardFor(UfcCoverageIds.all)).toHaveLength(2);
              expect(yield* cardFor(a.id)).toHaveLength(1);
              yield* importCard({ ...replacement, availability: "cancelled" });
              expect(yield* cardFor(UfcCoverageIds.numbered)).toEqual([]);
              expect(
                yield* events.listBySubject(UfcCoverageIds.numbered, {
                  availability: "all",
                }),
              ).toHaveLength(1);
              expect(yield* cardFor(UfcCoverageIds.all)).toHaveLength(1);
              expect((yield* cardFor(teamId))[0]?.id).toBe(unrelated.id);
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
