import { Database, type EventId } from "@dtpt/core";
import {
  mapToReadError,
  mapToWriteError,
} from "@dtpt/core/lib/database/errors";
import { subjectEventsTable } from "@dtpt/core/modules/subjects/feed/schema";
import { subjectsTable } from "@dtpt/core/modules/subjects/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Effect, Schema } from "effect";

import type { MmaEventSeed, MmaSubjectSeed } from "../schema/mma.js";

export class InvalidMmaSeed extends Schema.TaggedError<InvalidMmaSeed>()(
  "InvalidMmaSeed",
  { message: Schema.String },
) {}

export const validateMmaSubject = Effect.fn("DataSeed.validateMmaSubject")(
  function* (subject: MmaSubjectSeed) {
    const database = yield* Database;
    const existing = yield* database.query.subjectsTable
      .findFirst({ where: { id: subject.id } })
      .pipe(mapToReadError("Seed.subject"));

    if (existing && existing._tag !== subject._tag) {
      return yield* new InvalidMmaSeed({
        message: "Subject ID belongs to another subject type",
      });
    }
  },
);

export const validateMmaEvent = Effect.fn("DataSeed.validateMmaEvent")(
  function* (event: MmaEventSeed) {
    const database = yield* Database;
    const existing = yield* database.query.eventsTable
      .findFirst({ where: { _tag: event._tag, sourceId: event.sourceId } })
      .pipe(mapToReadError("Seed.event"));

    if (existing && existing.id !== event.id) {
      return yield* new InvalidMmaSeed({
        message: "Source identity must retain its allocated card ID",
      });
    }

    const fighters = yield* database.query.subjectsTable
      .findMany({ where: { _tag: "mma_fighter" } })
      .pipe(mapToReadError("Seed.fighters"));
    const fighterIds = new Set(fighters.map((fighter) => fighter.id));

    if (
      event.participants.some(
        (participant) => !fighterIds.has(participant.details.subjectId),
      )
    ) {
      return yield* new InvalidMmaSeed({
        message: "Fight references an unknown fighter",
      });
    }
  },
);

export const reconcileMmaFeed = Effect.fn("DataSeed.reconcileMmaFeed")(
  function* (eventId: EventId) {
    const database = yield* Database;
    // Only MMA-owned edges for this imported card are replaced. Omitted cards and
    // other subject types retain their associations, including historical feeds.
    yield* database
      .delete(subjectEventsTable)
      .where(
        and(
          eq(subjectEventsTable.eventId, eventId),
          inArray(
            subjectEventsTable.subjectId,
            sql`(select ${subjectsTable.id} from ${subjectsTable}
              where ${inArray(subjectsTable._tag, ["mma_fighter", "mma_tracking"])})`,
          ),
        ),
      )
      .pipe(mapToWriteError("Seed.reconcileFeed"));
  },
);
