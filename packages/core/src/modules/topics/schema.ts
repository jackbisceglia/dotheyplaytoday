import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Schema as S } from "effect";

const defaultTopicTag = "sports" as const satisfies TopicTag;

export type TopicTag = (typeof topicTags)[keyof typeof topicTags];
export const topicTags = {
  sports: "sports",
} as const;

export const topicsTable = sqliteTable("topics", {
  id: text("id").primaryKey(),
  _tag: text("_tag").notNull().default(defaultTopicTag),
  title: text("title").notNull(),
});

const rowRefinements = {
  id: S.UUID.pipe(S.brand("TopicId")),
  _tag: S.Literal(...Object.values(topicTags)),
};

export type Topic = S.Schema.Type<typeof Topic>;
export const Topic = createSelectSchema(topicsTable, rowRefinements);

export type TopicInsert = S.Schema.Type<typeof TopicInsert>;
export const TopicInsert = createInsertSchema(topicsTable, rowRefinements);

export const createTopicId = (id: string) => Topic.fields.id.make(id);
