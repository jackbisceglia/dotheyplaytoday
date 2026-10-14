import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { jsonb, text } from "drizzle-orm/pg-core";
import { Schema } from "effect";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import type { Check, TableSchemasMatch } from "../../lib/database/utils.js";
import { Id } from "../../lib/id/service.js";
import {
  MmaFighterSubject,
  MmaTrackingSubject,
} from "./variants/mma.schema.js";
import { SportTeamSubject } from "./variants/sport.schema.js";

export type SubjectSchemasMatchTable = Check<
  TableSchemasMatch<typeof subjectsTable, typeof Subject, typeof SubjectInsert>
>;

export type SubjectId = typeof SubjectId.Type;
export const SubjectId = Id.SchemaBranded("SubjectId");

const subjectTags = ["sports_team", "mma_fighter", "mma_tracking"] as const;

export type SubjectDetails = typeof SubjectDetails.Type;
export const SubjectDetails = Schema.Union([
  SportTeamSubject,
  MmaFighterSubject,
  MmaTrackingSubject,
]);


const overrides = {
  id: SubjectId,
  _tag: Schema.Literals(subjectTags),
  details: SubjectDetails,
};

export const subjectsTable = postgresTable("subjects", {
  id: text().primaryKey(),
  _tag: text("_tag", { enum: subjectTags }).notNull(),
  details: jsonb()
    .notNull()
    .$type<Schema.Codec.Encoded<typeof SubjectDetails>>(),
});

export type Subject = typeof Subject.Type;
export const Subject = createSelectSchema(subjectsTable, overrides);

export type SubjectInsert = typeof SubjectInsert.Type;
export const SubjectInsert = createInsertSchema(subjectsTable, overrides);
