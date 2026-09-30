import { Schema } from "effect";

import { EventWithParticipants } from "../../events/participants/schema.js";
import { SubscriptionWithSubject } from "../../subscriptions/schema.js";

export type SubscriptionWithEvents = typeof SubscriptionWithEvents.Type;
export const SubscriptionWithEvents = Schema.Struct({
  ...SubscriptionWithSubject.fields,
  events: Schema.Array(EventWithParticipants),
});
