import { Schema } from "effect";

import { TaggedStructWithOptional } from "../../lib/effect/schema";

export type NonEmptyEvents = readonly [Event, ...Event[]];

export const EventBase = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("EventId")),
  startUtc: Schema.DateTimeUtc,
});

export type SportsEvent = Schema.Schema.Type<typeof SportsEvent>;
export const SportsEvent = TaggedStructWithOptional("sports", {
  ...EventBase.fields,
  teamName: Schema.NonEmptyString,
  opponent: Schema.NonEmptyString,
});

const Schemas = [SportsEvent];

export type Event = Schema.Schema.Type<typeof Event>;
export const Event = Schema.Union(...Schemas);
