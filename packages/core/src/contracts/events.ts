import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { UserSchedule } from "../modules/events/read-models.js";

export const EventsResponse = UserSchedule;

export const EventsGroup = HttpApiGroup.make("events").add(
  HttpApiEndpoint.get("list", "/events", {
    success: EventsResponse,
    error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
  }),
);
