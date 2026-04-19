import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const EmailAddress = Schema.String.pipe(
  Schema.pattern(emailRegex, {
    identifier: "EmailAddress",
    description: "an email address",
  }),
);

export type User = Schema.Schema.Type<typeof User>;
export const User = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("UserId")),
  email: EmailAddress,
  timezone: Schema.TimeZoneNamed,
});

export const usersTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    timezone: text("timezone").notNull(),
  },
  (table) => [uniqueIndex("email_index").on(table.email)],
);
