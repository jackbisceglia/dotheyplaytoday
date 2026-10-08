import { Database, Events, Subjects } from "@dtpt/core";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { TestClock } from "effect/testing";
import { vi } from "vitest";

import { decodeSportsSeedCollections, seedCatalog } from "./catalog.js";
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

  const layer = Layer.mergeAll(
    // The importer only calls transaction; domain writes use the service fakes.
    Layer.succeed(Database, { transaction } as unknown as Database),
    Layer.mock(Events, { upsert, setParticipants: participants }),
    Layer.mock(Subjects, {
      upsert: (subject) => Effect.succeed(subject),
      addEventToFeed: addFeed,
    }),
  );

  return { upsert, participants, addFeed, transaction, layer };
};

describe("catalog seed cutoff", () => {
  for (const { strategy, now, skip, name } of [
    {
      strategy: "recent",
      now: "2026-10-08T00:30:00Z",
      skip: 1,
      name: "keeps the inclusive yesterday UTC boundary",
    },
    {
      strategy: "all",
      now: "2026-10-08T00:30:00Z",
      skip: 0,
      name: "imports historical corrections explicitly",
    },
    {
      strategy: "recent",
      now: "2026-10-11T23:30:00Z",
      skip: 4,
      name: "skips all historical events and feed references without reconciliation errors",
    },
  ] as const) {
    it.effect(name, () =>
      Effect.gen(function* () {
        // The boundary case is still October 7 in New York; use UTC.
        yield* TestClock.setTime(Date.parse(now));
        const decoded = yield* decodeSportsSeedCollections(input);
        const collection = decoded[0];
        if (!collection) throw new Error("Missing decoded fixture");
        const expected = collection.events.slice(skip);
        const { upsert, participants, addFeed, transaction, layer } =
          seedServices();

        const result = yield* seedCatalog({
          collections: input,
          strategy,
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
