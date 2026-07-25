import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { index, jsonb, text } from "drizzle-orm/pg-core";
import { Schema } from "effect";

import { postgresTable } from "../../../lib/database/drizzle/index.js";
import type { Check, TableSchemasMatch } from "../../../lib/database/utils.js";
import { Id } from "../../../lib/id/service.js";
import { TaggedUnion } from "../../../lib/effect/index.js";
import { EventId, eventsTable } from "../schema.js";
import { SportParticipant } from "./variants/sport.schema.js";

export type ParticipantSchemasMatchTable = Check<
  TableSchemasMatch<
    typeof participantsTable,
    typeof Participant,
    typeof ParticipantInsert
  >
>;

export type ParticipantId = typeof ParticipantId.Type;
export const ParticipantId = Id.SchemaBranded("ParticipantId");

export type ParticipantDetails = typeof ParticipantDetails.Type;
export const ParticipantDetails = TaggedUnion([SportParticipant]);

const overrides = {
  _tag: Schema.Literals(ParticipantDetails.tags),
  id: ParticipantId,
  eventId: EventId,
  details: ParticipantDetails,
};

export const participantsTable = postgresTable(
  "participants",
  {
    _tag: text("_tag", { enum: ParticipantDetails.tags }).notNull(),
    id: text().primaryKey(),
    eventId: text()
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    details: jsonb()
      .notNull()
      .$type<Schema.Codec.Encoded<typeof ParticipantDetails>>(),
  },
  (table) => [index("participants_event_id_idx").on(table.eventId)],
);

export type Participant = typeof Participant.Type;
export const Participant = createSelectSchema(participantsTable, overrides);

export type ParticipantInsert = typeof ParticipantInsert.Type;
export const ParticipantInsert = createInsertSchema(
  participantsTable,
  overrides,
);
