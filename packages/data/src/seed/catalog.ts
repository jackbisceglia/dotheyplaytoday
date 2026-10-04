import {
  Database,
  EventId,
  EventSourceId,
  Events,
  mapToTransactionError,
  StringParts,
  Subjects,
} from "@dtpt/core";
import { Effect, HashMap, Option, Schema } from "effect";

import { CatalogSeed } from "../schema/catalog.js";
import { SeedCollections } from "./index.js";

export class SeedEventResolutionError extends Schema.TaggedErrorClass<SeedEventResolutionError>()(
  "SeedEventResolutionError",
  {
    collectionId: Schema.String,
    subjectId: Schema.String,
    sourceId: Schema.String,
  },
) {}

export class SeedDuplicateEventSourceIdError extends Schema.TaggedErrorClass<SeedDuplicateEventSourceIdError>()(
  "SeedDuplicateEventSourceIdError",
  {
    sourceId: Schema.String,
    firstEventId: Schema.String,
    duplicateEventId: Schema.String,
  },
) {}

export type CatalogSeedInput = Schema.Codec.Encoded<typeof CatalogSeed>;
export type CatalogSeedCollection = CatalogSeed;
type CatalogSeedSubject = CatalogSeed["subjects"][number];
type CatalogSeedEvent = CatalogSeed["events"][number];
type CatalogEventIndex = HashMap.HashMap<EventSourceId, EventId>;

export const decodeCatalogSeedCollections = Schema.decodeUnknownEffect(
  Schema.Array(CatalogSeed),
);

export const summarizeCatalog = (
  collections: readonly CatalogSeedCollection[],
) => {
  const summary = {
    collections: collections.length,
    subjects: collections.reduce(
      (total, collection) => total + collection.subjects.length,
      0,
    ),
    events: collections.reduce(
      (total, collection) => total + collection.events.length,
      0,
    ),
    feedEdges: collections.reduce(
      (total, collection) =>
        total +
        collection.subjects.reduce(
          (subjectTotal, subject) => subjectTotal + subject.feedIds.length,
          0,
        ),
      0,
    ),
    participants: collections.reduce(
      (total, collection) =>
        total +
        collection.events.reduce(
          (eventTotal, event) => eventTotal + event.participants.length,
          0,
        ),
      0,
    ),
  };

  return StringParts()
    .add("seed:catalog")
    .add(`collections=${summary.collections.toString()}`)
    .add(`subjects=${summary.subjects.toString()}`)
    .add(`events=${summary.events.toString()}`)
    .add(`feedEdges=${summary.feedEdges.toString()}`)
    .add(`participants=${summary.participants.toString()}`)
    .make();
};

const validateFeedIds = Effect.fn("DataSeed.validateFeedIds")(function* (
  collections: readonly CatalogSeedCollection[],
) {
  const buildEventIdsBySourceId = Effect.fn(function* () {
    const eventIdsBySourceId = new Map<EventSourceId, EventId>();

    for (const event of collections.flatMap(
      (collection): readonly CatalogSeedEvent[] => collection.events,
    )) {
      const existingEventId = eventIdsBySourceId.get(event.sourceId);

      if (existingEventId) {
        // If a duplicate source id is found, error early in the import process.
        return yield* new SeedDuplicateEventSourceIdError({
          sourceId: event.sourceId,
          firstEventId: existingEventId,
          duplicateEventId: event.id,
        });
      }

      eventIdsBySourceId.set(event.sourceId, event.id);
    }

    return eventIdsBySourceId;
  });

  const validateSubjectFeedIds = Effect.fn(function* (
    eventIdsBySourceId: Map<EventSourceId, EventId>,
  ) {
    for (const collection of collections) {
      for (const subject of collection.subjects) {
        for (const sourceId of subject.feedIds) {
          if (!eventIdsBySourceId.has(sourceId)) {
            return yield* new SeedEventResolutionError({
              collectionId: collection.id,
              subjectId: subject.id,
              sourceId,
            });
          }
        }
      }
    }
  });

  const eventIdsBySourceId = yield* buildEventIdsBySourceId();

  yield* validateSubjectFeedIds(eventIdsBySourceId);
});

export const seedCatalog = Effect.fn("DataSeed.seedCatalog")(function* (
  input?: readonly CatalogSeedInput[],
) {
  const collections = yield* decodeCatalogSeedCollections(
    input ?? SeedCollections,
  );

  yield* validateFeedIds(collections);

  const subjects = yield* Subjects;
  const events = yield* Events;
  const database = yield* Database;

  yield* database
    .transaction(() =>
      Effect.gen(function* () {
        yield* Effect.forEach(
          collections.flatMap(
            (collection): readonly CatalogSeedSubject[] => collection.subjects,
          ),
          (subjectSeed) => {
            const { feedIds: _feedIds, ...subject } = subjectSeed;

            return subjects.upsert(subject);
          },
          { discard: true },
        );

        const importedEvents = yield* Effect.forEach(
          collections.flatMap(
            (collection): readonly CatalogSeedEvent[] => collection.events,
          ),
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
      }),
    )
    .pipe(
      mapToTransactionError("DataSeed.seedCatalog", {
        collectionCount: collections.length,
      }),
    );

  return collections;
});

const resolveEventSource = Effect.fn("DataSeed.resolveEventSource")(
  function* (input: {
    readonly collectionId: string;
    readonly eventIndex: CatalogEventIndex;
    readonly sourceId: EventSourceId;
    readonly subjectId: CatalogSeedSubject["id"];
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
