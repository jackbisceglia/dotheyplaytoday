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
  DatabaseTransactionError,
  DatabaseWriteError,
  mapToReadError,
  mapToTransactionError,
  mapToWriteError,
  toWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Id } from "../../lib/id/service.js";
import type { WithOptionalKeys } from "../../lib/types.js";
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
import type { Range } from "../subscriptions/time.js";

export type DateRangeUtc = Range<DateTime.Utc>;

export type EventWithParticipants = typeof EventWithParticipants.Type;
export const EventWithParticipants = Schema.Struct({
  ...Event.fields,
  participants: Schema.Array(Participant),
});

export type ListBySubjectOptions = {
  readonly range?: Range<DateTime.Utc>;
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
      event: WithOptionalKeys<EventInsert, "id">,
    ) => Effect.Effect<Event, DatabaseWriteError | Schema.SchemaError>;

    readonly setParticipants: (
      eventId: EventId,
      participants: readonly Omit<ParticipantInsert, "id" | "eventId">[],
    ) => Effect.Effect<
      void,
      DatabaseTransactionError | DatabaseWriteError | Schema.SchemaError
    >;
  }
>()("@dtpt/core/Events") {}

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
    const id = yield* Id;

    const get: Events["Service"]["get"] = Effect.fn("Events.get")(
      function* (eventId) {
        const row = yield* database.query.eventsTable
          .findFirst({
            where: { id: eventId },
          })
          .pipe(mapToReadError("Events.get", { eventId }));

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
          Effect.fn(function* (range: Range<DateTime.Utc>) {
            return {
              gte: yield* encodeDateTimeUtc(range.from),
              lt: yield* encodeDateTimeUtc(range.to),
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
        .pipe(mapToReadError("Events.listBySubject", { subjectId, opts }));

      const eventsWithParticipants = yield* decodeEventWithParticipants(rows);

      return eventsWithParticipants;
    });

    const upsert: Events["Service"]["upsert"] = Effect.fn("Events.upsert")(
      function* (event) {
        const eventId =
          event.id ?? (yield* id.makeFromBrandedSchema(Event.fields.id));

        const insertable = yield* encodeEvent({
          ...event,
          id: eventId,
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
          .pipe(mapToWriteError("Events.upsert"));

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
          const participantId = yield* id.makeFromBrandedSchema(
            Participant.fields.id,
          );

          const insertable = yield* encodeParticipant({
            ...participant,
            id: participantId,
            eventId,
          });

          return insertable;
        }),
      );

      yield* database
        .transaction(() =>
          Effect.gen(function* () {
            yield* database
              .delete(participantsTable)
              .where(eq(participantsTable.eventId, eventId))
              .pipe(
                Effect.catchTag(
                  "EffectDrizzleQueryError",
                  toWriteError("Events.setParticipants", { eventId }),
                ),
              );

            if (Array.isReadonlyArrayEmpty(insertableParticipants)) return;

            yield* database
              .insert(participantsTable)
              .values(insertableParticipants)
              .pipe(
                Effect.catchTag(
                  "EffectDrizzleQueryError",
                  toWriteError("Events.setParticipants", { eventId }),
                ),
              );
          }),
        )
        .pipe(mapToTransactionError("Events.setParticipants", { eventId }));
    });

    return Events.of({
      get,
      listBySubject,
      setParticipants,
      upsert,
    });
  }),
);
