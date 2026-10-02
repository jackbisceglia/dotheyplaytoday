import { Schema } from "effect";

import { EventWithParticipants } from "../events/service.js";
import { Subject } from "../subjects/schema.js";
import { User } from "../users/schema.js";

export const WeeklyDigest = Schema.Struct({
  user: User,
  from: Schema.DateTimeUtcFromString,
  to: Schema.DateTimeUtcFromString,
  teams: Schema.NonEmptyArray(
    Schema.Struct({
      subject: Subject,
      events: Schema.Array(EventWithParticipants),
    }),
  ),
});
export type WeeklyDigest = typeof WeeklyDigest.Type;
