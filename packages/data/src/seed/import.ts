import {
  createTablesIfMissing,
  Database,
  DatabaseWriteError,
  EventId,
  EventSourceId,
  Events,
  eventsTable,
  participantsTable,
  subjectEventsTable,
  Subjects,
  subjectsTable,
} from "@dtpt/core-v2";
import { SqlClient } from "effect/unstable/sql/SqlClient";
import { Effect, HashMap, Option, Schema } from "effect";

import { SportsSeed } from "../schema/sports.js";

export class SeedEventResolutionError extends Schema.TaggedErrorClass<SeedEventResolutionError>()(
  "SeedEventResolutionError",
  {
    collectionId: Schema.String,
    subjectId: Schema.String,
    sourceId: Schema.String,
  },
) {}

export type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;
export type SportsSeedCollection = SportsSeed;
type SportsSeedSubject = SportsSeed["subjects"][number];
type SportsEventIndex = HashMap.HashMap<EventSourceId, EventId>;

export const decodeSportsSeedCollections = Schema.decodeUnknownEffect(
  Schema.Array(SportsSeed),
);

const validateFeedIds = Effect.fn("DataSeed.validateFeedIds")(
  function* (collections: readonly SportsSeedCollection[]) {
    const sourceIds = new Set(
      collections.flatMap((collection) =>
        collection.events.map((event) => event.sourceId),
      ),
    );

    for (const collection of collections) {
      for (const subject of collection.subjects) {
        for (const sourceId of subject.feedIds) {
          if (sourceIds.has(sourceId)) continue;

          return yield* new SeedEventResolutionError({
            collectionId: collection.id,
            subjectId: subject.id,
            sourceId,
          });
        }
      }
    }
  },
);

export const seed = Effect.fn("DataSeed.seed")(function* (
  collections: readonly SportsSeedCollection[],
) {
  yield* validateFeedIds(collections);

  const subjects = yield* Subjects;
  const events = yield* Events;

  yield* Effect.forEach(
    collections.flatMap((collection) => collection.subjects),
    (subjectSeed) => {
      const { feedIds: _feedIds, ...subject } = subjectSeed;

      return subjects.upsert(subject);
    },
    { discard: true },
  );

  const importedEvents = yield* Effect.forEach(
    collections.flatMap((collection) => collection.events),
    (eventSeed) =>
      Effect.gen(function* () {
        const { participants, ...eventInput } = eventSeed;
        const event = yield* events.upsert(eventInput);

        yield* events.setParticipants(event.id, participants);

        return [event.sourceId, event.id] as const;
      }),
  );
  const eventIndex = HashMap.fromIterable(importedEvents);
  const feedEdges = yield* Effect.forEach(collections, (collection) =>
    Effect.forEach(collection.subjects, (subject) =>
      Effect.forEach(subject.feedIds, (sourceId) =>
        Effect.gen(function* () {
          const eventId = yield* resolveEventSource({
            collectionId: collection.id,
            eventIndex,
            sourceId,
            subjectId: subject.id,
          });

          return { eventId, subjectId: subject.id };
        }),
      ),
    ),
  ).pipe(Effect.map((edges) => edges.flat(2)));

  yield* Effect.forEach(feedEdges, subjects.addEventToFeed, {
    discard: true,
  });
});

export const resetDevCatalog = Effect.fn("DataSeed.resetDevCatalog")(
  function* () {
    yield* createTablesIfMissing();

    const database = yield* Database;
    const sql = yield* SqlClient;

    yield* sql
      .withTransaction(
        Effect.gen(function* () {
          yield* database.delete(subjectEventsTable);
          yield* database.delete(participantsTable);
          yield* database.delete(eventsTable);
          yield* database.delete(subjectsTable);
        }),
      )
      .pipe(
        Effect.catchTag(
          "SqlError",
          (cause) =>
            Effect.fail(
              new DatabaseWriteError({
                operation: "DataSeed.resetDevCatalog",
                cause,
                metadata: { mode: "dev" },
              }),
            ),
        ),
      );
  },
);

const resolveEventSource = Effect.fn("DataSeed.resolveEventSource")(
  function* (input: {
    readonly collectionId: string;
    readonly eventIndex: SportsEventIndex;
    readonly sourceId: EventSourceId;
    readonly subjectId: SportsSeedSubject["id"];
  }) {
    const eventId = HashMap.get(input.eventIndex, input.sourceId);

    if (Option.isSome(eventId)) return eventId.value;

    return yield* new SeedEventResolutionError({
      collectionId: input.collectionId,
      sourceId: input.sourceId,
      subjectId: input.subjectId,
    });
  },
);
