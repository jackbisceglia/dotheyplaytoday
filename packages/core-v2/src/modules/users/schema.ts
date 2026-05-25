import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { sqliteTable } from "../../lib/database/drizzle/index.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/utils.js";
import { Id } from "../../lib/domain/id.js";

export type UserSchemasMatchTable = Check<
  TableSchemasMatch<typeof usersTable, typeof User, typeof UserInsert>
>;

export type UserId = typeof UserId.Type;
export const UserId = Id.SchemaBranded("UserId");

export type EmailAddress = typeof EmailAddress.Type;
export const EmailAddress = Schema.String.check(
  Schema.isPattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, {
    identifier: "EmailAddress",
    description: "an email address",
  }),
).pipe(Schema.brand("EmailAddress"));

export type UnsubscribeToken = typeof UnsubscribeToken.Type;
export const UnsubscribeToken = Id.SchemaBranded("UnsubscribeToken");

const domainOverrides = {
  id: UserId,
  email: EmailAddress,
  timezone: Schema.TimeZoneNamedFromString,
  unsubscribeToken: UnsubscribeToken,
};

export const usersTable = sqliteTable(
  "users",
  {
    id: text().primaryKey(),
    email: text().notNull(),
    timezone: text().notNull(),
    unsubscribeToken: text().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_unsubscribe_token_idx").on(table.unsubscribeToken),
  ],
);

export type User = typeof User.Type;
export const User = createSelectSchema(usersTable, domainOverrides);

export type UserInsert = typeof UserInsert.Type;
export const UserInsert = createInsertSchema(usersTable, domainOverrides);
