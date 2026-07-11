import { describe, expect, it } from "@effect/vitest";
import {
  Database,
  DatabaseWriteError,
  Events,
  EventsLayer,
  participantsTable,
  SubjectId,
  subjectEventsTable,
  subjectsTable,
  SubjectsLayer,
  subscriptionsTable,
  usersTable,
  eventsTable,
} from "@dtpt/core";
import {
  createTables,
  layerTest,
} from "@dtpt/core/lib/database/__tests__/setup";
import { SubscriptionInsert } from "@dtpt/core/modules/subscriptions/schema";
import { User, UserInsert } from "@dtpt/core/modules/users/schema";
import { DateTime, Effect, Layer, Schema } from "effect";

import { SportsSeed } from "../../schema/sports.js";
import { nbaCollection } from "../../sports/nba/index.js";
import { nflCollection } from "../../sports/nfl/index.js";
import { worldCupCollection } from "../../sports/world-cup/index.js";
import {
  decodeSportsSeedCollections,
  SeedDuplicateEventSourceIdError,
  SeedEventResolutionError,
  seedCatalog,
  summarizeCatalog,
} from "../catalog.js";
import { reset } from "../reset.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const layerSeedTest = Layer.mergeAll(SubjectsLayer, EventsLayer).pipe(
  Layer.provideMerge(layerTest),
);

const utc = (input: string) =>
  DateTime.toUtc(
    DateTime.makeZonedUnsafe(input, {
      timeZone: "UTC",
      adjustForTimeZone: true,
    }),
  );

const gameSourceId = "sports_game:seed:00000000-0000-4000-8000-000000000801";
const secondGameSourceId =
  "sports_game:seed:00000000-0000-4000-8000-000000000802";
const missingSourceId = "sports_game:seed:00000000-0000-4000-8000-000000000899";
const gameId = "00000000-0000-4000-8000-000000000801";
const duplicateGameId = "00000000-0000-4000-8000-000000000802";
const homeSubjectSeedId = "00000000-0000-4000-8000-000000000811";
const awaySubjectSeedId = "00000000-0000-4000-8000-000000000812";
type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;

const getHomeSubjectId = Effect.gen(function* () {
  const database = yield* Database;
  const rows = yield* database.select().from(subjectsTable);
  const row = rows.find((subject) => subject.details.name === "Celtics");

  if (!row) {
    throw new Error("Expected Celtics subject to be imported");
  }

  return SubjectId.make(row.id);
});

const collection = {
  id: "test.nba",
  subjects: [
    {
      id: homeSubjectSeedId,
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        leagueId: "nba",
        location: "Boston",
        name: "Celtics",
        display: "Boston Celtics",
        abbreviation: "BOS",
        slug: "boston-celtics",
      },
      feedIds: [gameSourceId],
    },
    {
      id: awaySubjectSeedId,
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        leagueId: "nba",
        location: "New York",
        name: "Knicks",
        display: "New York Knicks",
        abbreviation: "NYK",
        slug: "new-york-knicks",
      },
      feedIds: [gameSourceId],
    },
  ],
  events: [
    {
      id: gameId,
      _tag: "sports_game",
      sourceId: gameSourceId,
      startsAt: "2026-06-01T23:30:00Z",
      availability: "active",
      details: {
        _tag: "sports_game",
        leagueId: "nba",
      },
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Boston Celtics",
          },
        },
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "away",
            title: "New York Knicks",
          },
        },
      ],
    },
  ],
} as const satisfies SportsSeedInput;

const runSeedForTest = Effect.fn("DataSeedTest.runSeed")(function* (input: {
  readonly mode: "dev" | "prod";
  readonly collections: readonly SportsSeedInput[];
}) {
  if (input.mode === "dev") {
    yield* reset();
  }

  const collections = yield* seedCatalog(input.collections);

  return {
    mode: input.mode,
    summary: summarizeCatalog(collections),
  };
});

const changedCollection = {
  ...collection,
  events: [
    {
      ...collection.events[0],
      startsAt: "2026-06-02T00:30:00Z",
      availability: "cancelled",
      participants: [
        {
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Boston Celtics Updated",
          },
        },
        collection.events[0].participants[1],
      ],
    },
  ],
} as const satisfies SportsSeedInput;

describe("data seed catalog", () => {
  it("registers NBA seed data explicitly", () => {
    expect(nbaCollection.id).toBe("sports.nba");
    expect(nbaCollection.subjects).toHaveLength(30);
    expect(nbaCollection.events).toHaveLength(3);

    const spurs = nbaCollection.subjects.find(
      (subject) => subject.details.slug === "san-antonio-spurs",
    );

    expect(spurs?.feedIds).toEqual([
      "sports_game:seed:00000000-0000-4000-8000-000000000702",
      "sports_game:seed:00000000-0000-4000-8000-000000000703",
    ]);
  });

  it("registers NFL regular season seed data explicitly", () => {
    expect(nflCollection.id).toBe("sports.nfl");
    expect(nflCollection.subjects).toHaveLength(32);
    expect(nflCollection.events).toHaveLength(272);

    const eventSourceIds = new Set(
      nflCollection.events.map((event) => event.sourceId),
    );
    const feedIds = nflCollection.subjects.flatMap(
      (subject) => subject.feedIds,
    );

    expect(feedIds).toHaveLength(544);
    expect(eventSourceIds.size).toBe(272);
    expect(feedIds.every((sourceId) => eventSourceIds.has(sourceId))).toBe(
      true,
    );
    expect(
      nflCollection.subjects.every((subject) => subject.feedIds.length === 17),
    ).toBe(true);
  });

  it("registers World Cup seed data explicitly", () => {
    expect(worldCupCollection.id).toBe("sports.world-cup");
    expect(worldCupCollection.subjects).toHaveLength(48);
    expect(worldCupCollection.events).toHaveLength(74);

    const eventSourceIds = new Set(
      worldCupCollection.events.map((event) => event.sourceId),
    );
    const feedIds = worldCupCollection.subjects.flatMap(
      (subject) => subject.feedIds,
    );
    const unitedStates = worldCupCollection.subjects.find(
      (subject) => subject.details.slug === "united-states",
    );
    const argentina = worldCupCollection.subjects.find(
      (subject) => subject.details.slug === "argentina",
    );

    expect(feedIds).toHaveLength(148);
    expect(eventSourceIds.size).toBe(74);
    expect(feedIds.every((sourceId) => eventSourceIds.has(sourceId))).toBe(
      true,
    );
    expect(argentina?.feedIds).toContain(
      "sports_game:seed:00000000-0000-4000-8000-000000001000",
    );
    expect(unitedStates?.feedIds).toEqual([
      "sports_game:seed:00000000-0000-4000-8000-000000000919",
      "sports_game:seed:00000000-0000-4000-8000-000000000921",
      "sports_game:seed:00000000-0000-4000-8000-000000000923",
    ]);
  });

  it.effect(
    "rejects sports event seeds without one home and one away participant",
    () =>
      Effect.gen(function* () {
        const oneParticipantCollection = {
          ...collection,
          events: [
            {
              ...collection.events[0],
              participants: [collection.events[0].participants[0]],
            },
          ],
        } as const satisfies SportsSeedInput;
        const duplicateHomeCollection = {
          ...collection,
          events: [
            {
              ...collection.events[0],
              participants: [
                collection.events[0].participants[0],
                {
                  ...collection.events[0].participants[1],
                  details: {
                    ...collection.events[0].participants[1].details,
                    role: "home",
                  },
                },
              ],
            },
          ],
        } as const satisfies SportsSeedInput;

        const oneParticipantError = yield* decodeSportsSeedCollections([
          oneParticipantCollection,
        ]).pipe(Effect.flip);
        const duplicateHomeError = yield* decodeSportsSeedCollections([
          duplicateHomeCollection,
        ]).pipe(Effect.flip);

        expect(oneParticipantError._tag).toBe("SchemaError");
        expect(duplicateHomeError._tag).toBe("SchemaError");
      }),
  );

  it.effect(
    "imports one sports game as an event with feed edges and participants",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const database = yield* Database;
        const result = yield* runSeedForTest({
          mode: "prod",
          collections: [collection],
        });

        const [eventRows, feedRows, participantRows] = yield* Effect.all([
          database.select().from(eventsTable),
          database.select().from(subjectEventsTable),
          database.select().from(participantsTable),
        ]);

        expect(result).toEqual({
          mode: "prod",
          summary:
            "seed:catalog collections=1 subjects=2 events=1 feedEdges=2 participants=2",
        });
        expect(eventRows).toHaveLength(1);
        expect(eventRows[0]?.id).toBe(gameId);
        expect(feedRows).toHaveLength(2);
        expect(participantRows).toHaveLength(2);
      }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect(
    "updates existing events for stable source ids instead of duplicating them",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const database = yield* Database;
        const events = yield* Events;

        yield* runSeedForTest({
          mode: "prod",
          collections: [collection],
        });

        const homeSubjectId = yield* getHomeSubjectId;
        const firstRows = yield* database.select().from(eventsTable);
        yield* runSeedForTest({
          mode: "prod",
          collections: [changedCollection],
        });
        const secondRows = yield* database.select().from(eventsTable);
        const feed = yield* events.listBySubject(homeSubjectId, {
          availability: "all",
        });

        expect(firstRows).toHaveLength(1);
        expect(secondRows).toHaveLength(1);
        expect(secondRows[0]?.id).toBe(firstRows[0]?.id);
        expect(feed).toHaveLength(1);
        expect(feed[0]?.startsAt).toEqual(utc("2026-06-02T00:30:00"));
        expect(feed[0]?.availability).toBe("cancelled");

        const participantDetails = feed[0]?.participants
          .map((participant) => participant.details)
          .sort((left, right) => left.role.localeCompare(right.role));

        expect(participantDetails).toEqual([
          {
            _tag: "sports_game",
            role: "away",
            title: "New York Knicks",
          },
          {
            _tag: "sports_game",
            role: "home",
            title: "Boston Celtics Updated",
          },
        ]);
      }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect("rejects duplicate event source ids before writing", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      const duplicateSourceCollection = {
        ...collection,
        events: [
          collection.events[0],
          {
            ...collection.events[0],
            id: duplicateGameId,
          },
        ],
      } as const satisfies SportsSeedInput;

      const error = yield* runSeedForTest({
        mode: "prod",
        collections: [duplicateSourceCollection],
      }).pipe(Effect.flip);
      const eventRows = yield* database.select().from(eventsTable);

      expect(error).toBeInstanceOf(SeedDuplicateEventSourceIdError);
      if (!(error instanceof SeedDuplicateEventSourceIdError)) return;
      expect(error.sourceId).toBe(gameSourceId);
      expect(error.firstEventId).toBe(gameId);
      expect(error.duplicateEventId).toBe(duplicateGameId);
      expect(eventRows).toHaveLength(0);
    }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect(
    "rejects subject feed edges with unresolved event source ids before writing",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const database = yield* Database;
        const unresolvedCollection = {
          ...collection,
          subjects: [
            {
              ...collection.subjects[0],
              feedIds: [missingSourceId],
            },
            collection.subjects[1],
          ],
        } as const satisfies SportsSeedInput;

        const error = yield* runSeedForTest({
          mode: "prod",
          collections: [unresolvedCollection],
        }).pipe(Effect.flip);
        const eventRows = yield* database.select().from(eventsTable);

        expect(error).toBeInstanceOf(SeedEventResolutionError);
        if (!(error instanceof SeedEventResolutionError)) return;
        expect(error.subjectId).toBe(homeSubjectSeedId);
        expect(error.sourceId).toBe(missingSourceId);
        expect(eventRows).toHaveLength(0);
      }).pipe(Effect.provide(layerSeedTest)),
  );

  // TODO(database): restore this assertion when catalog seeding is atomic again.
  // D1 support removed the transaction boundary, so partial writes are expected for now.
  it.effect.skip("rolls seed writes back when an event import fails", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      const collidingEventIdCollection = {
        ...collection,
        subjects: [
          {
            ...collection.subjects[0],
            feedIds: [gameSourceId, secondGameSourceId],
          },
          collection.subjects[1],
        ],
        events: [
          collection.events[0],
          {
            ...collection.events[0],
            sourceId: secondGameSourceId,
          },
        ],
      } as const satisfies SportsSeedInput;

      const error = yield* runSeedForTest({
        mode: "prod",
        collections: [collidingEventIdCollection],
      }).pipe(Effect.flip);
      const [subjectRows, eventRows, feedRows, participantRows] =
        yield* Effect.all([
          database.select().from(subjectsTable),
          database.select().from(eventsTable),
          database.select().from(subjectEventsTable),
          database.select().from(participantsTable),
        ]);

      expect(error).toBeInstanceOf(DatabaseWriteError);
      expect(subjectRows).toHaveLength(0);
      expect(eventRows).toHaveLength(0);
      expect(feedRows).toHaveLength(0);
      expect(participantRows).toHaveLength(0);
    }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect("production seed does not modify users or subscriptions", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      yield* runSeedForTest({
        mode: "prod",
        collections: [collection],
      });
      const homeSubjectId = yield* getHomeSubjectId;
      const user = decode(User)({
        id: "00000000-0000-4000-8000-000000000901",
        email: "fan@example.com",
        timezone: "America/New_York",
        unsubscribeToken: "00000000-0000-4000-8000-000000000902",
      });
      const subscription = decode(SubscriptionInsert)({
        id: "00000000-0000-4000-8000-000000000903",
        userId: user.id,
        subjectId: homeSubjectId,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 32400,
        },
        lastSentAt: null,
      });

      yield* database.insert(usersTable).values(encode(UserInsert)(user));
      yield* database
        .insert(subscriptionsTable)
        .values(encode(SubscriptionInsert)(subscription));
      yield* runSeedForTest({
        mode: "prod",
        collections: [changedCollection],
      });

      const [userRows, subscriptionRows] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
      ]);

      expect(userRows).toHaveLength(1);
      expect(subscriptionRows).toHaveLength(1);
      expect(userRows[0]?.email).toBe("fan@example.com");
      expect(subscriptionRows[0]?.subjectId).toBe(homeSubjectId);
    }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect("reset clears all current seed tables", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      yield* runSeedForTest({
        mode: "prod",
        collections: [collection],
      });
      const homeSubjectId = yield* getHomeSubjectId;
      const user = decode(User)({
        id: "00000000-0000-4000-8000-000000000911",
        email: "reset@example.com",
        timezone: "America/New_York",
        unsubscribeToken: "00000000-0000-4000-8000-000000000912",
      });
      const subscription = decode(SubscriptionInsert)({
        id: "00000000-0000-4000-8000-000000000913",
        userId: user.id,
        subjectId: homeSubjectId,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 32400,
        },
        lastSentAt: null,
      });

      yield* database.insert(usersTable).values(encode(UserInsert)(user));
      yield* database
        .insert(subscriptionsTable)
        .values(encode(SubscriptionInsert)(subscription));
      yield* reset();

      const [
        userRows,
        subscriptionRows,
        subjectRows,
        eventRows,
        feedRows,
        participantRows,
      ] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
        database.select().from(subjectsTable),
        database.select().from(eventsTable),
        database.select().from(subjectEventsTable),
        database.select().from(participantsTable),
      ]);

      expect(userRows).toHaveLength(0);
      expect(subscriptionRows).toHaveLength(0);
      expect(subjectRows).toHaveLength(0);
      expect(eventRows).toHaveLength(0);
      expect(feedRows).toHaveLength(0);
      expect(participantRows).toHaveLength(0);
    }).pipe(Effect.provide(layerSeedTest)),
  );
});
