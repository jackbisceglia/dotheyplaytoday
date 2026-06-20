import { Schema } from "effect";

import { EventWithParticipants } from "../../events/service.js";
import { Subject } from "../../subjects/schema.js";
import { Subscription } from "../../subscriptions/schema.js";
import { User } from "../../users/schema.js";

export type Notification = typeof Notification.Type;
export const Notification = Schema.Struct({
  sendAt: Schema.DateTimeUtcFromString,
  user: User,
  subscription: Subscription,
  subject: Subject,
  events: Schema.NonEmptyArray(EventWithParticipants),
});
