import { Schema } from "effect";

import { Event } from "../events/schema";

export type Topic = Schema.Schema.Type<typeof Topic>;
export const Topic = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("TopicId")),
});

export type TopicData = Schema.Schema.Type<typeof TopicData>;
export const TopicData = Schema.Struct({
  events: Schema.Array(Event),
});
