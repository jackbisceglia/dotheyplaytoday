import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Array, Schema } from "effect";

import { TaggedStructWithOptional } from "../../lib/effect/schema.js";
import { topicsTable, topicTags } from "../topics/schema.js";

export type NonEmptyEvents = Array.NonEmptyArray<AllEvents>;

const baseEventFields = {
  id: Schema.UUID.pipe(Schema.brand("EventId")),
  startUtc: Schema.DateTimeUtc,
  site: Schema.NonEmptyString,
};

export type SportsEvent = Schema.Schema.Type<typeof SportsEvent>;
export const SportsEvent = TaggedStructWithOptional(topicTags.sports, {
  ...baseEventFields,
  site: Schema.Literal("home", "away"),
  teamName: Schema.NonEmptyString,
  opponent: Schema.NonEmptyString,
});

export type AllEvents = Schema.Schema.Type<typeof AllEvents>;
export const AllEvents = Schema.Union(SportsEvent);

export const eventsTable = sqliteTable("topic_events", {
  id: text("id").primaryKey(),
  topicId: text("topic_id")
    .notNull()
    .references(() => topicsTable.id, { onDelete: "cascade" }),
  // Temporary shape for MVP. In a follow-up we should model events as their own
  // table(s) keyed by event type since the event domain is a discriminated union.
  data: text("data", { mode: "json" }).notNull().$type<AllEvents>(),
});

const rowRefinements = {
  id: Schema.UUID.pipe(Schema.brand("EventId")),
  topicId: (topicId: Schema.Schema<string>) =>
    topicId.pipe(Schema.brand("TopicId")),
  data: AllEvents,
};

export type Event = Schema.Schema.Type<typeof Event>;
export const Event = createSelectSchema(eventsTable, rowRefinements);

export type EventInsert = Schema.Schema.Type<typeof EventInsert>;
export const EventInsert = createInsertSchema(eventsTable, rowRefinements);

export const createEventId = (id: string) => SportsEvent.fields.id.make(id);
