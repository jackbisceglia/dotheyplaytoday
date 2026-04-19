import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { Event, type SportsEvent } from "../events/schema.js";

const DEFAULT_TOPIC_TYPE = "sports";

export type Topic = Schema.Schema.Type<typeof Topic>;
export const Topic = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("TopicId")),
  events: Schema.Array(Event),
});

export const topicsTable = sqliteTable("topics", {
  id: text("id").primaryKey(),
  type: text("type").notNull().default(DEFAULT_TOPIC_TYPE),
  title: text("title").notNull(),
});

export const eventsTable = sqliteTable("events", {
  id: text("id").primaryKey(),
  topicId: text("topic_id")
    .notNull()
    .references(() => topicsTable.id, { onDelete: "cascade" }),
  // Temporary shape for MVP. In a follow-up we should model events as their own
  // table(s) keyed by event type since the event domain is a discriminated union.
  event: text("event", { mode: "json" }).notNull().$type<SportsEvent>(),
});
