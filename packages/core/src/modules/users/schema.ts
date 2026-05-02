import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema as S } from "effect";

const emailSanityPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const usersTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$type<UserId>(),
    email: text("email").notNull(),
    timezone: text("timezone")
      .notNull()
      .$type<S.Schema.Type<typeof S.TimeZoneNamed>>(),
  },
  (table) => [uniqueIndex("email_index").on(table.email)],
);

export type UserId = typeof UserId.Type;
export const UserId = S.UUID.pipe(S.brand("UserId"));

export type EmailAddress = typeof EmailAddress.Type;
export const EmailAddress = S.String.pipe(
  S.pattern(emailSanityPattern, {
    identifier: "EmailAddress",
    description: "an email address",
  }),
);

const rowRefinements = {
  id: UserId,
  email: EmailAddress,
  timezone: S.TimeZoneNamed,
};

export type User = S.Schema.Type<typeof User>;
export const User = createSelectSchema(usersTable, rowRefinements);

export type UserInsert = S.Schema.Type<typeof UserInsert>;
export const UserInsert = createInsertSchema(usersTable, rowRefinements);
