import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { text } from "drizzle-orm/pg-core";
import { Schema } from "effect";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import type { Check, TableSchemasMatch } from "../../lib/database/utils.js";

export const FeedbackRequestMaxLength = 2_000;

export type FeedbackType = typeof FeedbackType.Type;
export const FeedbackType = Schema.Literals(["new_subject", "general"]);

export type FeedbackRequestText = typeof FeedbackRequestText.Type;
export const FeedbackRequestText = Schema.String.check(
  Schema.isLengthBetween(1, FeedbackRequestMaxLength),
);

const overrides = {
  type: FeedbackType,
  request: FeedbackRequestText,
};

export const feedbackTable = postgresTable("feedback", {
  type: text({ enum: FeedbackType.literals }).notNull(),
  request: text().notNull(),
});

export type Feedback = typeof Feedback.Type;
export const Feedback = createSelectSchema(feedbackTable, overrides);

export type FeedbackInsert = typeof FeedbackInsert.Type;
export const FeedbackInsert = createInsertSchema(feedbackTable, overrides);

export type FeedbackSchemasMatchTable = Check<
  TableSchemasMatch<
    typeof feedbackTable,
    typeof Feedback,
    typeof FeedbackInsert
  >
>;
