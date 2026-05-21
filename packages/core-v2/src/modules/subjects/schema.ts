import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { text } from "drizzle-orm/sqlite-core";
import { Array, pipe, Schema } from "effect";

import { sqliteTable } from "../../lib/database/drizzle.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/type-contracts.js";
import { Id } from "../../lib/domain/id.js";
import { SportTeamSubject } from "./sports.js";

export type SubjectSchemasMatchTable = Check<
  TableSchemasMatch<typeof subjectsTable, typeof Subject, typeof SubjectInsert>
>;

export type SubjectId = typeof SubjectId.Type;
export const SubjectId = Id.SchemaBranded("SubjectId");

const subjectDetailSchemas = [SportTeamSubject] as const;

export type SubjectDetails = typeof SubjectDetails.Type;
export const SubjectDetails = Schema.Union(subjectDetailSchemas).pipe(
  Schema.toTaggedUnion("_tag"),
);

const subjectTags = pipe(
  SubjectDetails.members,
  Array.map((member) => member.fields._tag.schema.literal),
);

const domainOverrides = {
  id: SubjectId,
  _tag: Schema.Literals(subjectTags),
  details: SubjectDetails,
};

export const subjectsTable = sqliteTable("subjects", {
  id: text().primaryKey(),
  _tag: text("_tag", { enum: subjectTags }).notNull(),
  details: text({ mode: "json" })
    .notNull()
    .$type<Schema.Codec.Encoded<typeof SubjectDetails>>(),
});

export type Subject = typeof Subject.Type;
export const Subject = createSelectSchema(subjectsTable, domainOverrides);

export type SubjectInsert = typeof SubjectInsert.Type;
export const SubjectInsert = createInsertSchema(subjectsTable, domainOverrides);
