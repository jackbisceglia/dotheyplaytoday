import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { SubscriptionWithEvents } from "../modules/subscriptions/schema.js";

export const EventsResponse = Schema.Array(SubscriptionWithEvents);
export type EventsResponse = typeof EventsResponse.Type;

export const EventsGroup = HttpApiGroup.make("events").add(
  HttpApiEndpoint.get("list", "/events", {
    success: EventsResponse,
    error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
  }),
);
