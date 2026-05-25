import { SqlClient } from "effect/unstable/sql/SqlClient";
import { eq } from "drizzle-orm";
import {
  Array,
  Context,
  DateTime,
  Effect,
  Layer,
  Match,
  Option,
  Schema,
} from "effect";

import {
  DatabaseReadError,
  DatabaseWriteError,
  toReadError,
  toWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Id } from "../../lib/domain/id.js";
import { SubjectId } from "../subjects/schema.js";
import { EventNotFound } from "./errors.js";
import {
  Participant,
  ParticipantInsert,
  participantsTable,
} from "./participants/schema.js";
import {
  Event,
  EventAvailability,
  EventId,
  EventInsert,
  eventsTable,
} from "./schema.js";

export type EventWithParticipants = typeof EventWithParticipants.Type;
export const EventWithParticipants = Schema.Struct({
  ...Event.fields,
  participants: Schema.Array(Participant),
});

export type DateRangeUtc = {
  readonly fromUtc: DateTime.Utc;
  readonly toUtc: DateTime.Utc;
};

export type ListBySubjectOptions = {
  readonly range?: DateRangeUtc;
  readonly availability?: EventAvailability | "all";
};

export class Events extends Context.Service<
  Events,
  {
    readonly get: (
      eventId: EventId,
    ) => Effect.Effect<
      Event,
      EventNotFound | DatabaseReadError | Schema.SchemaError
    >;

    readonly listBySubject: (
      subjectId: SubjectId,
      opts?: ListBySubjectOptions,
    ) => Effect.Effect<
      readonly EventWithParticipants[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly upsert: (
      event: Omit<EventInsert, "id">,
    ) => Effect.Effect<Event, DatabaseWriteError | Schema.SchemaError>;

    readonly setParticipants: (
      eventId: EventId,
      participants: Array.NonEmptyReadonlyArray<
        Omit<ParticipantInsert, "id" | "eventId">
      >,
    ) => Effect.Effect<void, DatabaseWriteError | Schema.SchemaError>;
  }
>()("@dtpt/core-v2/Events") {}

const decodeEvent = Schema.decodeUnknownEffect(Event);
const decodeEventWithParticipants = Schema.decodeUnknownEffect(
  Schema.Array(EventWithParticipants),
);
const encodeEvent = Schema.encodeEffect(EventInsert);
const encodeParticipant = Schema.encodeEffect(ParticipantInsert);
const encodeDateTimeUtc = Schema.encodeEffect(Schema.DateTimeUtcFromString);

export const EventsLayer = Layer.effect(
  Events,
  Effect.gen(function* () {
    const database = yield* Database;
    const sql = yield* SqlClient;

    const get: Events["Service"]["get"] = Effect.fn("Events.get")(
      function* (eventId) {
        const row = yield* database.query.eventsTable
          .findFirst({
            where: { id: eventId },
          })
          .pipe(toReadError("Events.get", { eventId }));

        if (!row) {
          return yield* new EventNotFound({ eventId });
        }

        const event = yield* decodeEvent(row);

        return event;
      },
    );

    const listBySubject: Events["Service"]["listBySubject"] = Effect.fn(
      "Events.listBySubject",
    )(function* (subjectId, opts) {
      const availabilityFilter = Match.value(opts?.availability).pipe(
        Match.when(undefined, () => "active" as const),
        // undefined means no availability filter.
        Match.when("all", () => undefined),
        Match.orElse((availability) => availability),
      );

      const startsAt = yield* Match.value(opts?.range).pipe(
        Match.when(undefined, () => Effect.void.pipe(Effect.as(undefined))),
        Match.orElse(
          Effect.fn(function* (range: DateRangeUtc) {
            return {
              gte: yield* encodeDateTimeUtc(range.fromUtc),
              lt: yield* encodeDateTimeUtc(range.toUtc),
            };
          }),
        ),
      );

      const rows = yield* database.query.eventsTable
        .findMany({
          where: {
            availability: availabilityFilter,
            startsAt,
            subjectEvents: { subjectId },
          },
          with: {
            participants: {
              orderBy: { id: "asc" },
            },
          },
          orderBy: { startsAt: "asc", id: "asc" },
        })
        .pipe(toReadError("Events.listBySubject", { subjectId, opts }));

      const eventsWithParticipants = yield* decodeEventWithParticipants(rows);

      return eventsWithParticipants;
    });

    const upsert: Events["Service"]["upsert"] = Effect.fn("Events.upsert")(
      function* (event) {
        const insertable = yield* encodeEvent({
          ...event,
          id: yield* Id.createFromBrandedSchema(Event.fields.id),
        });

        const rows = yield* database
          .insert(eventsTable)
          .values(insertable)
          .onConflictDoUpdate({
            target: [eventsTable._tag, eventsTable.sourceId],
            set: {
              startsAt: insertable.startsAt,
              availability: insertable.availability,
              details: insertable.details,
            },
          })
          .returning()
          .pipe(toWriteError("Events.upsert"));

        const row = Array.head(rows);

        if (Option.isNone(row)) {
          return yield* new DatabaseWriteError({
            operation: "Events.upsert",
          });
        }

        const upserted = yield* decodeEvent(row.value);

        return upserted;
      },
    );

    const setParticipants: Events["Service"]["setParticipants"] = Effect.fn(
      "Events.setParticipants",
    )(function* (eventId, participants) {
      const insertableParticipants = yield* Effect.forEach(
        participants,
        Effect.fn(function* (participant) {
          const id = yield* Id.createFromBrandedSchema(Participant.fields.id);

          const insertable = yield* encodeParticipant({
            ...participant,
            id,
            eventId,
          });

          return insertable;
        }),
      );

      yield* sql
        .withTransaction(
          Effect.gen(function* () {
            yield* database
              .delete(participantsTable)
              .where(eq(participantsTable.eventId, eventId));

            yield* database
              .insert(participantsTable)
              .values(insertableParticipants);
          }),
        )
        .pipe(
          Effect.catchTag("SqlError", (cause) =>
            Effect.fail(
              new DatabaseWriteError({
                operation: "Events.setParticipants",
                cause,
                metadata: { eventId },
              }),
            ),
          ),
        );
    });

    return Events.of({
      get,
      listBySubject,
      setParticipants,
      upsert,
    });
  }),
);
