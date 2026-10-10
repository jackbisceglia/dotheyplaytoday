import {
  Database,
  Events,
  Subjects,
  Subject,
  SubjectNotFound,
} from "@dtpt/core";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Schema } from "effect";
import { TestClock } from "effect/testing";
import { vi } from "vitest";

import {
  decodeSeedCollections,
  seedCatalog,
  summarizeCatalog,
} from "./catalog.js";
import { ufcCollection } from "../mma/ufc/index.js";
import { SeedCollections } from "./index.js";

const template = SeedCollections[0];
const input = [
  {
    ...template,
    events: [
      "2026-10-06T23:59:59.999Z",
      "2026-10-07T00:00:00Z",
      "2026-10-07T00:00:00.001Z",
      "2026-10-09T00:00:00Z",
    ].map((startsAt, index) => {
      const event = template.events[index];
      if (!event) throw new Error("Missing seed fixture event");
      return { ...event, startsAt };
    }),
    subjects: template.subjects.map((subject) => ({
      ...subject,
      feedIds: template.events.slice(0, 4).map((event) => event.sourceId),
    })),
  },
];

const seedServices = () => {
  const upsert = vi.fn<Events["Service"]["upsert"]>((event) => {
    if (!event.id) return Effect.die("Missing fixture event ID");
    return Effect.succeed({ ...event, id: event.id });
  });
  const participants = vi.fn<Events["Service"]["setParticipants"]>(
    () => Effect.void,
  );
  const addFeed = vi.fn<Subjects["Service"]["addEventToFeed"]>(
    () => Effect.void,
  );
  const transaction = vi.fn((body: () => Effect.Effect<void>) => body());

  const reconcile = vi.fn(() => Effect.void);
  const layer = Layer.mergeAll(
    // lint(anti-slop/require-safety-comment-for-type-assertion): Only the database methods used by catalog seeding are supplied; domain writes use service fakes.
    // oxlint-disable-next-line anti-slop/no-chained-type-assertions -- This fixture intentionally omits unused Drizzle methods.
    Layer.succeed(Database, {
      transaction,
    } as unknown as Database),
    Layer.mock(Events, { upsert, setParticipants: participants }),
    Layer.mock(Subjects, {
      upsert: (subject) => Effect.succeed(subject),
      addEventToFeed: addFeed,
      removeEventFromFeeds: reconcile,
      get: (id) => {
        const subject = ufcCollection.subjects.find(
          (subject) => subject.id === id,
        );
        return subject
          ? Schema.decodeUnknownEffect(Subject)(subject)
          : Effect.fail(new SubjectNotFound({ key: "id", value: id }));
      },
    }),
  );

  return { upsert, participants, addFeed, transaction, reconcile, layer };
};

describe("catalog seed cutoff", () => {
  for (const { options, now, skip, name } of [
    {
      options: {},
      now: "2026-10-08T00:30:00Z",
      skip: 1,
      name: "keeps the inclusive yesterday UTC boundary",
    },
    {
      options: { strategy: "all" },
      now: "2026-10-08T00:30:00Z",
      skip: 0,
      name: "imports historical corrections explicitly",
    },
    {
      options: { strategy: "future" },
      now: "2026-10-11T23:30:00Z",
      skip: 4,
      name: "skips all historical events and feed references without reconciliation errors",
    },
  ] as const) {
    it.effect(name, () =>
      Effect.gen(function* () {
        // The boundary case is still October 7 in New York; use UTC.
        yield* TestClock.setTime(Date.parse(now));
        const decoded = yield* decodeSeedCollections(input);
        const collection = decoded[0];
        if (!collection) throw new Error("Missing decoded fixture");
        const expected = collection.events.slice(skip);
        const { upsert, participants, addFeed, transaction, layer } =
          seedServices();

        const result = yield* seedCatalog({
          ...options,
          collections: input,
        }).pipe(Effect.provide(layer));

        const imported = result[0];
        if (!imported) throw new Error("Missing imported fixture");
        expect(transaction).toHaveBeenCalledTimes(1);
        expect(imported.events).toEqual(expected);
        expect(upsert.mock.calls.map(([event]) => event.sourceId)).toEqual(
          expected.map((event) => event.sourceId),
        );
        expect(participants.mock.calls).toEqual(
          expected.map((event) => [event.id, event.participants]),
        );
        expect(addFeed.mock.calls.map(([edge]) => edge)).toEqual(
          collection.subjects.flatMap((subject) =>
            expected.map((event) => ({
              eventId: event.id,
              subjectId: subject.id,
            })),
          ),
        );
        expect(imported.subjects.map((subject) => subject.id)).toEqual(
          collection.subjects.map((subject) => subject.id),
        );
      }),
    );
  }
});

describe("UFC uses the shared catalog workflow", () => {
  for (const strategy of ["future", "all"] as const) {
    it.effect(`applies the ${strategy} strategy to UFC events and feeds`, () =>
      Effect.gen(function* () {
        yield* TestClock.setTime(
          Math.max(
            ...ufcCollection.events.map((event) => Date.parse(event.startsAt)),
          ) +
            3 * 24 * 60 * 60 * 1000,
        );
        const { upsert, reconcile, addFeed, layer } = seedServices();
        const collections = yield* seedCatalog({
          collections: [ufcCollection],
          strategy,
        }).pipe(Effect.provide(layer));
        const expectedCount =
          strategy === "all" ? ufcCollection.events.length : 0;
        expect(upsert).toHaveBeenCalledTimes(expectedCount);
        expect(reconcile).toHaveBeenCalledTimes(expectedCount);
        expect(addFeed).toHaveBeenCalledTimes(
          strategy === "all"
            ? ufcCollection.subjects.flatMap((subject) => subject.feedIds)
                .length
            : 0,
        );
        expect(summarizeCatalog(collections)).toContain(
          `events=${expectedCount.toString()}`,
        );
        expect(collections[0]?.subjects).toHaveLength(
          ufcCollection.subjects.length,
        );
      }),
    );
  }
});
