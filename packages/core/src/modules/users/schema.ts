import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { boolean, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { Schema } from "effect";
import * as SchemaTransformation from "effect/SchemaTransformation";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import type { Check, TableSchemasMatch } from "../../lib/database/utils.js";
import { Id } from "../../lib/id/service.js";

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

export const EmailAddressFromString = Schema.String.pipe(
  Schema.decode(
    SchemaTransformation.trim().compose(SchemaTransformation.toLowerCase()),
  ),
  Schema.decodeTo(EmailAddress),
);

export type UnsubscribeToken = typeof UnsubscribeToken.Type;
export const UnsubscribeToken = Id.SchemaBranded("UnsubscribeToken");

const domainOverrides = {
  id: UserId,
  email: EmailAddress,
  timezone: Schema.TimeZoneNamedFromString,
  unsubscribeToken: UnsubscribeToken,
  createdAt: Schema.DateTimeUtcFromDate,
  updatedAt: Schema.DateTimeUtcFromDate,
};

const insertOverrides = {
  ...domainOverrides,
  emailVerified: Schema.optional(Schema.Boolean),
  createdAt: Schema.optional(Schema.DateTimeUtcFromDate),
  updatedAt: Schema.optional(Schema.DateTimeUtcFromDate),
};

export const usersTable = postgresTable(
  "users",
  {
    id: text().primaryKey(),
    email: text().notNull(),
    timezone: text().notNull(),
    unsubscribeToken: text().notNull(),
    name: text(),
    emailVerified: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_unsubscribe_token_idx").on(table.unsubscribeToken),
  ],
);

export type User = typeof User.Type;
export const User = createSelectSchema(usersTable, domainOverrides);

export type UserInsert = typeof UserInsert.Type;
export const UserInsert = createInsertSchema(usersTable, insertOverrides);
