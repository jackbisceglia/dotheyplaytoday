import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { Participant } from "../modules/events/participants/schema.js";
import { Event } from "../modules/events/schema.js";
import { SubjectId } from "../modules/subjects/schema.js";

export const SubscribedEvent = Schema.Struct({
  ...Event.fields,
  participants: Schema.Array(Participant),
  subjectIds: Schema.NonEmptyArray(SubjectId),
});

export const EventsResponse = Schema.Struct({
  today: Schema.String,
  timezone: Schema.TimeZoneNamedFromString,
  events: Schema.Array(SubscribedEvent),
});
export type EventsResponse = typeof EventsResponse.Type;

export const EventsGroup = HttpApiGroup.make("events").add(
  HttpApiEndpoint.get("list", "/events", {
    success: EventsResponse,
    error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
  }),
);
