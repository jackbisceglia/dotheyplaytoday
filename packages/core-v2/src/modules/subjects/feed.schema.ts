import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { index, primaryKey, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "../../lib/database/drizzle.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/type-contracts.js";
import { EventId, eventsTable } from "../events/schema.js";
import { SubjectId, subjectsTable } from "./schema.js";

export type SubjectEventSchemasMatchTable = Check<
  TableSchemasMatch<
    typeof subjectEventsTable,
    typeof SubjectEvent,
    typeof SubjectEventInsert
  >
>;

const overrides = {
  eventId: EventId,
  subjectId: SubjectId,
};

export const subjectEventsTable = sqliteTable(
  "subject_events",
  {
    eventId: text()
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    subjectId: text()
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.subjectId] }),
    index("subject_events_subject_id_idx").on(table.subjectId),
  ],
);

export type SubjectEvent = typeof SubjectEvent.Type;
export const SubjectEvent = createSelectSchema(subjectEventsTable, overrides);

export type SubjectEventInsert = typeof SubjectEventInsert.Type;
export const SubjectEventInsert = createInsertSchema(
  subjectEventsTable,
  overrides,
);
