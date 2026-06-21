import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { text } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { sqliteTable } from "../../lib/database/drizzle/index.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/utils.js";
import { Id } from "../../lib/id/service.js";
import { TaggedUnion } from "../../lib/effect/index.js";
import { SportTeamSubject } from "./variants/sport.schema.js";

export type SubjectSchemasMatchTable = Check<
  TableSchemasMatch<typeof subjectsTable, typeof Subject, typeof SubjectInsert>
>;

export type SubjectId = typeof SubjectId.Type;
export const SubjectId = Id.SchemaBranded("SubjectId");

export type SubjectDetails = typeof SubjectDetails.Type;
export const SubjectDetails = TaggedUnion([SportTeamSubject]);

const overrides = {
  id: SubjectId,
  _tag: Schema.Literals(SubjectDetails.tags),
  details: SubjectDetails,
};

export const subjectsTable = sqliteTable("subjects", {
  id: text().primaryKey(),
  _tag: text("_tag", { enum: SubjectDetails.tags }).notNull(),
  details: text({ mode: "json" })
    .notNull()
    .$type<Schema.Codec.Encoded<typeof SubjectDetails>>(),
});

export type Subject = typeof Subject.Type;
export const Subject = createSelectSchema(subjectsTable, overrides);

export type SubjectInsert = typeof SubjectInsert.Type;
export const SubjectInsert = createInsertSchema(subjectsTable, overrides);
