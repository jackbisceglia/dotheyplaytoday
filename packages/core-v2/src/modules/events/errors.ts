import { Schema } from "effect";

import { EventId } from "./schema.js";

export class EventNotFound extends Schema.TaggedErrorClass<EventNotFound>()(
  "EventNotFound",
  { eventId: EventId },
) {}
