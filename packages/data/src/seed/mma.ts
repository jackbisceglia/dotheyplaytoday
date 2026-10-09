import { Subjects, type EventId } from "@dtpt/core";
import { Effect, Schema } from "effect";

import type { MmaEventSeed, MmaSubjectSeed } from "../schema/mma.js";

export class InvalidMmaSeed extends Schema.TaggedError<InvalidMmaSeed>()(
  "InvalidMmaSeed",
  { message: Schema.String },
) {}

export const validateMmaSubject = Effect.fn("DataSeed.validateMmaSubject")(
  function* (subject: MmaSubjectSeed) {
    const subjects = yield* Subjects;
    const existing = yield* subjects
      .get(subject.id)
      .pipe(Effect.catchTag("SubjectNotFound", () => Effect.void));

    if (existing && existing._tag !== subject._tag) {
      return yield* new InvalidMmaSeed({
        message: "Subject ID belongs to another subject type",
      });
    }
  },
);

export const validateMmaEvent = Effect.fn("DataSeed.validateMmaEvent")(
  function* (event: MmaEventSeed, persistedId: EventId) {
    if (persistedId !== event.id) {
      return yield* new InvalidMmaSeed({
        message: "Source identity must retain its allocated card ID",
      });
    }

    const subjects = yield* Subjects;
    for (const participant of event.participants) {
      const fighter = yield* subjects
        .get(participant.details.subjectId)
        .pipe(Effect.catchTag("SubjectNotFound", () => Effect.void));
      if (fighter?._tag !== "mma_fighter") {
        return yield* new InvalidMmaSeed({
          message: "Fight references an unknown fighter",
        });
      }
    }
  },
);
