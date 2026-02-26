import { Array, Schema } from "effect";

import { TaggedStructWithOptional } from "../../lib/effect/schema.js";

export type NonEmptyEvents = Array.NonEmptyArray<Event>;

export const EventBase = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("EventId")),
  startUtc: Schema.DateTimeUtc,
  site: Schema.NonEmptyString,
});

export type SportsEvent = Schema.Schema.Type<typeof SportsEvent>;
export const SportsEvent = TaggedStructWithOptional("sports", {
  ...EventBase.fields,
  site: Schema.Literal("home", "away"),
  teamName: Schema.NonEmptyString,
  opponent: Schema.NonEmptyString,
});

const Schemas = [SportsEvent];

export type Event = Schema.Schema.Type<typeof Event>;
export const Event = Schema.Union(...Schemas);
