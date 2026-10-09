import {
  Database,
  EventId,
  EventSourceId,
  Events,
  mapToTransactionError,
  StringParts,
  Subjects,
} from "@dtpt/core";
import { DateTime, Effect, HashMap, Option, Schema } from "effect";

import { SportsSeed } from "../schema/sports.js";
import { SeedCollections } from "./index.js";

export class SeedEventResolutionError extends Schema.TaggedError<SeedEventResolutionError>()(
  "SeedEventResolutionError",
  {
    collectionId: Schema.String,
    subjectId: Schema.String,
    sourceId: Schema.String,
  },
) {}

export class SeedDuplicateEventSourceIdError extends Schema.TaggedError<SeedDuplicateEventSourceIdError>()(
  "SeedDuplicateEventSourceIdError",
  {
    sourceId: Schema.String,
    firstEventId: Schema.String,
    duplicateEventId: Schema.String,
  },
) {}

export type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;
export type SportsSeedCollection = SportsSeed;
type SportsSeedSubject = SportsSeed["subjects"][number];
type SportsEventIndex = HashMap.HashMap<EventSourceId, EventId>;

export const decodeSportsSeedCollections = Schema.decodeUnknownEffect(
  Schema.Array(SportsSeed),
);

export const summarizeCatalog = (
  collections: readonly SportsSeedCollection[],
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
  collections: readonly SportsSeedCollection[],
) {
  const buildEventIdsBySourceId = Effect.fn(function* () {
    const eventIdsBySourceId = new Map<EventSourceId, EventId>();

    for (const event of collections.flatMap(
      (collection) => collection.events,
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

export type CatalogSeedOptions = {
  readonly collections?: readonly SportsSeedInput[];
  readonly strategy?: "future" | "all";
};

const selectFutureEvents = (
  collections: readonly SportsSeedCollection[],
  cutoff: DateTime.Utc,
) => {
  const skippedSourceIds = new Set<EventSourceId>();

  const selected = collections.map((collection) => {
    const events = collection.events.filter((event) => {
      if (DateTime.isGreaterThanOrEqualTo(event.startsAt, cutoff)) return true;

      skippedSourceIds.add(event.sourceId);
      return false;
    });

    return { ...collection, events };
  });

  return selected.map((collection) => {
    const subjects = collection.subjects.map((subject) => {
      const feedIds = subject.feedIds.filter(
        (sourceId) => !skippedSourceIds.has(sourceId),
      );

      return { ...subject, feedIds };
    });

    return { ...collection, subjects };
  });
};

export const seedCatalog = Effect.fn("DataSeed.seedCatalog")(function* (
  options?: CatalogSeedOptions,
) {
  const decoded = yield* decodeSportsSeedCollections(
    options?.collections ?? SeedCollections,
  );

  yield* validateFeedIds(decoded);

  const strategy = options?.strategy ?? "future";
  let collections = decoded;

  if (strategy === "future") {
    const now = yield* DateTime.now;
    const today = DateTime.startOf(now, "day");
    const cutoff = DateTime.subtract(today, { days: 1 });

    collections = selectFutureEvents(decoded, cutoff);
  }

  const subjects = yield* Subjects;
  const events = yield* Events;
  const database = yield* Database;

  yield* database
    .transaction(() =>
      Effect.gen(function* () {
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
