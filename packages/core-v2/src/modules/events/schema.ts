import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { index, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { sqliteTable } from "../../lib/database/drizzle.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/type-contracts.js";
import { Id } from "../../lib/domain/id.js";
import { TaggedUnion } from "../../lib/effect/index.js";
import { SportEvent } from "./sports/schema.js";

export type EventSchemasMatchTable = Check<
  TableSchemasMatch<typeof eventsTable, typeof Event, typeof EventInsert>
>;

export type EventId = typeof EventId.Type;
export const EventId = Id.SchemaBranded("EventId");

const eventSourceIdPattern =
  /^[a-z][a-z0-9_]*:[a-z][a-z0-9_-]*:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type EventSourceId = typeof EventSourceId.Type;
export const EventSourceId = Schema.String.check(
  Schema.isPattern(eventSourceIdPattern, {
    identifier: "EventSourceId",
    description: "an event source id formatted as <eventType>:<source>:<uuid>",
  }),
).pipe(Schema.brand("EventSourceId"));

export type EventDetails = typeof EventDetails.Type;
export const EventDetails = TaggedUnion([SportEvent]);

export type EventAvailability = typeof EventAvailability.Type;
export const EventAvailability = Schema.Literals(["active", "cancelled"]);

const overrides = {
  id: EventId,
  _tag: Schema.Literals(EventDetails.tags),
  sourceId: EventSourceId,
  startsAt: Schema.DateTimeUtcFromString,
  availability: EventAvailability,
  details: EventDetails,
};

export const eventsTable = sqliteTable(
  "events",
  {
    id: text().primaryKey(),
    _tag: text("_tag", { enum: EventDetails.tags }).notNull(),
    sourceId: text().notNull(),
    startsAt: text().notNull(),
    availability: text({ enum: EventAvailability.literals }).notNull(),
    details: text({ mode: "json" })
      .notNull()
      .$type<Schema.Codec.Encoded<typeof EventDetails>>(),
  },
  (table) => [
    uniqueIndex("events_tag_source_id_idx").on(table._tag, table.sourceId),
    index("events_starts_at_idx").on(table.startsAt),
  ],
);

export type Event = typeof Event.Type;
export const Event = createSelectSchema(eventsTable, overrides);

export type EventInsert = typeof EventInsert.Type;
export const EventInsert = createInsertSchema(eventsTable, overrides);
