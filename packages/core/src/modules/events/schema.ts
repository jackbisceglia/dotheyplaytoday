import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Array, Schema } from "effect";

import { TaggedStructWithOptional } from "../../lib/effect/schema.js";
import { TopicId, topicsTable, topicTags } from "../topics/schema.js";

export type NonEmptyEvents = Array.NonEmptyArray<AllEvents>;

export type EventId = typeof EventId.Type;
export const EventId = Schema.UUID.pipe(Schema.brand("EventId"));

const baseEventFields = {
  startUtc: Schema.DateTimeUtc,
  site: Schema.NonEmptyString,
};

export type SportsEventData = Schema.Schema.Type<typeof SportsEventData>;
export const SportsEventData = TaggedStructWithOptional(topicTags.sports, {
  ...baseEventFields,
  site: Schema.Literal("home", "away"),
  teamName: Schema.NonEmptyString,
  opponent: Schema.NonEmptyString,
});

export type AllEventData = Schema.Schema.Type<typeof AllEventData>;
export const AllEventData = Schema.Union(SportsEventData);

export type SportsEvent = Schema.Schema.Type<typeof SportsEvent>;
export const SportsEvent = TaggedStructWithOptional(topicTags.sports, {
  ...baseEventFields,
  id: EventId,
  site: Schema.Literal("home", "away"),
  teamName: Schema.NonEmptyString,
  opponent: Schema.NonEmptyString,
});

export type AllEvents = Schema.Schema.Type<typeof AllEvents>;
export const AllEvents = Schema.Union(SportsEvent);

export const eventsTable = sqliteTable("events", {
  id: text("id").primaryKey().$type<EventId>(),
  topicId: text("topic_id")
    .notNull()
    .$type<TopicId>()
    .references(() => topicsTable.id, { onDelete: "cascade" }),
  // Temporary shape for MVP. In a follow-up we should model events as their own
  // table(s) keyed by event type since the event domain is a discriminated union.
  data: text("data", { mode: "json" }).notNull().$type<AllEventData>(),
});

const rowRefinements = {
  id: EventId,
  topicId: TopicId,
  data: AllEventData,
};

export type Event = Schema.Schema.Type<typeof Event>;
export const Event = createSelectSchema(eventsTable, rowRefinements);

export type EventInsert = Schema.Schema.Type<typeof EventInsert>;
export const EventInsert = createInsertSchema(eventsTable, rowRefinements);
