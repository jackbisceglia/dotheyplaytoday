import { DateTime, Effect, Predicate, Schema } from "effect";

import { EventId } from "../events/schema.js";
import { isEventWithParticipants } from "../events/joined.js";
import { SubjectDetails, SubjectId } from "../subjects/schema.js";
import type { User } from "../users/schema.js";
import type { WeeklyDigest } from "./schema.js";

export class MmaScheduleRenderError extends Schema.TaggedError<MmaScheduleRenderError>()(
  "MmaScheduleRenderError",
  {
    subjectId: SubjectId,
    eventId: Schema.optional(EventId),
    message: Schema.String,
  },
) {}

/** Fighter and coverage feed links select cards for the same presentation. */
export const mmaSchedule = Effect.fn("MmaSchedule.present")(function* (
  group: WeeklyDigest["groups"][number],
  timezone: User["timezone"],
) {
  const { subject } = group;

  if (
    !(
      (Predicate.isTagged(subject, "mma_tracking") &&
        SubjectDetails.guards.mma_tracking(subject.details)) ||
      (Predicate.isTagged(subject, "mma_fighter") &&
        SubjectDetails.guards.mma_fighter(subject.details))
    )
  ) {
    return yield* new MmaScheduleRenderError({
      subjectId: subject.id,
      message: "Expected a UFC fighter or card coverage subject",
    });
  }

  const cards = yield* Effect.forEach(group.events, (event) => {
    if (!isEventWithParticipants("mma_card")(event)) {
      return Effect.fail(
        new MmaScheduleRenderError({
          subjectId: subject.id,
          eventId: event.id,
          message: "Expected an MMA card with MMA participants",
        }),
      );
    }

    return Effect.succeed(event);
  });

  const ordered = [...cards].sort(
    (a, b) =>
      DateTime.toEpochMillis(a.details.timings.main) -
        DateTime.toEpochMillis(b.details.timings.main) ||
      a.id.localeCompare(b.id),
  );
  const rows = ordered.map((card) => {
    const start = DateTime.setZone(card.details.timings.main, timezone);
    const time = DateTime.format(start, {
      locale: "en-US",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      date: DateTime.format(start, {
        locale: "en-US",
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      label: card.details.title,
      time: `${time}, main card`,
    };
  });

  return {
    title: Predicate.isTagged(subject, "mma_tracking")
      ? "UFC Events"
      : subject.details.display,
    rows,
  };
});
