import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema as S } from "effect";

const emailSanityPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const EmailAddress = S.String.pipe(
  S.pattern(emailSanityPattern, {
    identifier: "EmailAddress",
    description: "an email address",
  }),
);

export const usersTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    timezone: text("timezone").notNull(),
  },
  (table) => [uniqueIndex("email_index").on(table.email)],
);

const rowRefinements = {
  id: S.UUID.pipe(S.brand("UserId")),
  email: EmailAddress,
  timezone: S.TimeZoneNamed,
};

export type User = S.Schema.Type<typeof User>;
export const User = createSelectSchema(usersTable, rowRefinements);

export type UserInsert = S.Schema.Type<typeof UserInsert>;
export const UserInsert = createInsertSchema(usersTable, rowRefinements);

export const createUserId = (id: string) => User.fields.id.make(id);
