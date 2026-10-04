import { Schema } from "effect";

import { EventId } from "./schema.js";

export class EventNotFound extends Schema.TaggedError<EventNotFound>()(
  "EventNotFound",
  { eventId: EventId },
) {}
