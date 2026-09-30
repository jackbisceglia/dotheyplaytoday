import { Schema } from "effect";

import { SubjectId } from "../subjects/schema.js";
import { Participant } from "./participants/schema.js";
import { Event } from "./schema.js";

export type EventWithParticipants = typeof EventWithParticipants.Type;
export const EventWithParticipants = Schema.Struct({
  ...Event.fields,
  participants: Schema.Array(Participant),
});

export const SubscribedEvent = Schema.Struct({
  ...EventWithParticipants.fields,
  subjectIds: Schema.NonEmptyArray(SubjectId),
});
export type SubscribedEvent = typeof SubscribedEvent.Type;

export const UserSchedule = Schema.Struct({
  today: Schema.String,
  timezone: Schema.TimeZoneNamedFromString,
  events: Schema.Array(SubscribedEvent),
});
export type UserSchedule = typeof UserSchedule.Type;
