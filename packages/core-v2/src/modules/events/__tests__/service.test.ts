import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Array, DateTime, Effect, Layer, Schema } from "effect";

import { DatabaseWriteError } from "../../../lib/database/errors.js";
import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/test-setup.js";
import {
  Subject,
  SubjectId,
  SubjectInsert,
  subjectsTable,
} from "../../subjects/schema.js";
import { EventNotFound } from "../errors.js";
import {
  Participant,
  ParticipantInsert,
  participantsTable,
} from "../participant.schema.js";
import { EventId, EventInsert, EventSourceId, eventsTable } from "../schema.js";
import { Events, EventsLayer } from "../service.js";
import {
  SubjectEventInsert,
  subjectEventsTable,
} from "../subject-event.schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const layerEventsTest = EventsLayer.pipe(Layer.provideMerge(layerTest));

const utc = (input: string) =>
  DateTime.toUtc(
    DateTime.makeZonedUnsafe(input, {
      timeZone: "UTC",
      adjustForTimeZone: true,
    }),
  );

const celticsSubjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

const knicksSubjectInput = {
  id: "00000000-0000-4000-8000-000000000302",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "New York",
    name: "Knicks",
    abbreviation: "NYK",
    slug: "new-york-knicks",
  },
};

const celticsSubjectId = SubjectId.make(celticsSubjectInput.id);
const knicksSubjectId = SubjectId.make(knicksSubjectInput.id);

const celticsKnicksSourceId = EventSourceId.make(
  "sports_game:seed:00000000-0000-4000-8000-000000000701",
);
const lakersCelticsSourceId = EventSourceId.make(
  "sports_game:seed:00000000-0000-4000-8000-000000000702",
);
const missingEventId = EventId.make("00000000-0000-4000-8000-000000009999");

const celticsKnicksEvent = {
  _tag: "sports_game",
  sourceId: celticsKnicksSourceId,
  startsAt: utc("2026-05-24T20:00:00"),
  availability: "active",
  details: {
    _tag: "sports_game",
    leagueId: "nba",
  },
} satisfies Omit<EventInsert, "id">;

const lakersCelticsEvent = {
  _tag: "sports_game",
  sourceId: lakersCelticsSourceId,
  startsAt: utc("2026-05-24T18:00:00"),
  availability: "active",
  details: {
    _tag: "sports_game",
    leagueId: "nba",
  },
} satisfies Omit<EventInsert, "id">;

const participants = [
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
] as const satisfies Array.NonEmptyReadonlyArray<
  Omit<ParticipantInsert, "id" | "eventId">
>;

const replacementParticipants = [
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
      title: "Cleveland Cavaliers",
    },
  },
] as const satisfies Array.NonEmptyReadonlyArray<
  Omit<ParticipantInsert, "id" | "eventId">
>;

const seedSubjects = Effect.gen(function* () {
  const database = yield* Database;
  const inserts = [celticsSubjectInput, knicksSubjectInput].map((subject) =>
    encode(SubjectInsert)(decode(Subject)(subject)),
  );

  yield* database.insert(subjectsTable).values(inserts);
});

const addEventToFeed = (input: {
  readonly eventId: EventId;
  readonly subjectId: SubjectId;
}) =>
  Effect.gen(function* () {
    const database = yield* Database;
    const insert = encode(SubjectEventInsert)(input);

    yield* database.insert(subjectEventsTable).values(insert);
  });

describe("v2 Events service", () => {
  it.effect(
    "upserts events by tag and source id while preserving event id",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const events = yield* Events;
        const first = yield* events.upsert(celticsKnicksEvent);
        const second = yield* events.upsert({
          ...celticsKnicksEvent,
          startsAt: utc("2026-05-25T20:00:00"),
          availability: "cancelled",
        });
        const selected = yield* events.get(first.id);

        expect(second.id).toBe(first.id);
        expect(selected.id).toBe(first.id);
        expect(selected.startsAt).toEqual(utc("2026-05-25T20:00:00"));
        expect(selected.availability).toBe("cancelled");
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect(
    "fails primary reads with EventNotFound when the row is missing",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const events = yield* Events;
        const error = yield* events.get(missingEventId).pipe(Effect.flip);

        expect(error).toBeInstanceOf(EventNotFound);
        if (!(error instanceof EventNotFound)) {
          return;
        }
        expect(error.eventId).toBe(missingEventId);
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect("replaces event-local participants authoritatively", () =>
    Effect.gen(function* () {
      yield* createTables;

      const events = yield* Events;
      const database = yield* Database;
      const event = yield* events.upsert(celticsKnicksEvent);

      yield* events.setParticipants(event.id, participants);
      yield* events.setParticipants(event.id, replacementParticipants);

      const rows = yield* database
        .select()
        .from(participantsTable)
        .where(eq(participantsTable.eventId, event.id));
      const persistedParticipants = rows.map((row) => decode(Participant)(row));

      expect(persistedParticipants).toHaveLength(2);
      expect(
        persistedParticipants.map((participant) => participant.details.title),
      ).toEqual(["Boston Celtics", "Cleveland Cavaliers"]);
      expect(
        persistedParticipants.every(
          (participant) => participant.eventId === event.id,
        ),
      ).toBe(true);
    }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect(
    "rolls participant replacement back when the event id violates the foreign key",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const events = yield* Events;
        const database = yield* Database;
        const error = yield* events
          .setParticipants(missingEventId, participants)
          .pipe(Effect.flip);
        const rows = yield* database.select().from(participantsTable);

        expect(error).toBeInstanceOf(DatabaseWriteError);
        if (!(error instanceof DatabaseWriteError)) {
          return;
        }
        expect(error.operation).toBe("Events.setParticipants");
        expect(error.metadata).toEqual({ eventId: missingEventId });
        expect(rows).toHaveLength(0);
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect(
    "validates replacement participants before deleting existing rows",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const events = yield* Events;
        const database = yield* Database;
        const event = yield* events.upsert(celticsKnicksEvent);

        yield* events.setParticipants(event.id, participants);

        const error = yield* events
          .setParticipants(event.id, [
            {
              _tag: "sports_game",
              details: {
                _tag: "sports_game",
                role: "home",
                title: "",
              },
            },
          ] as never)
          .pipe(Effect.flip);
        const rows = yield* database
          .select()
          .from(participantsTable)
          .where(eq(participantsTable.eventId, event.id));

        expect(error._tag).toBe("SchemaError");
        expect(rows).toHaveLength(2);
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect(
    "lists active subject events with participants in schedule order",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubjects;

        const events = yield* Events;
        const first = yield* events.upsert(celticsKnicksEvent);
        const second = yield* events.upsert(lakersCelticsEvent);

        yield* events.setParticipants(first.id, participants);
        yield* events.setParticipants(second.id, replacementParticipants);
        yield* addEventToFeed({
          eventId: first.id,
          subjectId: celticsSubjectId,
        });
        yield* addEventToFeed({
          eventId: second.id,
          subjectId: celticsSubjectId,
        });
        yield* addEventToFeed({
          eventId: first.id,
          subjectId: knicksSubjectId,
        });

        const celticsFeed = yield* events.listBySubject(celticsSubjectId);
        const knicksFeed = yield* events.listBySubject(knicksSubjectId);

        expect(celticsFeed.map((event) => event.id)).toEqual([
          second.id,
          first.id,
        ]);
        expect(knicksFeed.map((event) => event.id)).toEqual([first.id]);
        expect(celticsFeed[0]?.participants).toHaveLength(2);
        expect(celticsFeed[1]?.participants).toHaveLength(2);
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect(
    "filters subject event reads by UTC range and cancellation state",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubjects;

        const events = yield* Events;
        const active = yield* events.upsert(celticsKnicksEvent);
        const cancelled = yield* events.upsert({
          ...lakersCelticsEvent,
          availability: "cancelled",
        });

        yield* events.setParticipants(active.id, participants);
        yield* events.setParticipants(cancelled.id, replacementParticipants);
        yield* addEventToFeed({
          eventId: active.id,
          subjectId: celticsSubjectId,
        });
        yield* addEventToFeed({
          eventId: cancelled.id,
          subjectId: celticsSubjectId,
        });

        const defaultFeed = yield* events.listBySubject(celticsSubjectId);
        const cancelledOnly = yield* events.listBySubject(celticsSubjectId, {
          availability: "cancelled",
        });
        const allAvailability = yield* events.listBySubject(celticsSubjectId, {
          availability: "all",
        });
        const rangedOut = yield* events.listBySubject(celticsSubjectId, {
          range: {
            fromUtc: utc("2026-05-25T00:00:00"),
            toUtc: utc("2026-05-26T00:00:00"),
          },
        });

        expect(defaultFeed.map((event) => event.id)).toEqual([active.id]);
        expect(cancelledOnly.map((event) => event.id)).toEqual([
          cancelled.id,
        ]);
        expect(allAvailability.map((event) => event.id)).toEqual([
          cancelled.id,
          active.id,
        ]);
        expect(rangedOut).toEqual([]);
      }).pipe(Effect.provide(layerEventsTest)),
  );

  it.effect("validates event upserts before writing", () =>
    Effect.gen(function* () {
      yield* createTables;

      const events = yield* Events;
      const database = yield* Database;
      const error = yield* events
        .upsert({
          ...celticsKnicksEvent,
          sourceId: "not-a-source-id",
        } as never)
        .pipe(Effect.flip);
      const rows = yield* database.select().from(eventsTable);

      expect(error._tag).toBe("SchemaError");
      expect(rows).toHaveLength(0);
    }).pipe(Effect.provide(layerEventsTest)),
  );
});
