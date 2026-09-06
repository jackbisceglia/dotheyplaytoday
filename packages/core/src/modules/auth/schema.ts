import { index, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import { usersTable } from "../users/schema.js";

const timestamps = {
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const authSessionsTable = postgresTable(
  "auth_sessions",
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
    token: text().notNull(),
    ...timestamps,
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_idx").on(table.token),
    index("auth_sessions_user_id_idx").on(table.userId),
  ],
);

export const authAccountsTable = postgresTable(
  "auth_accounts",
  {
    id: text().primaryKey(),
    issuer: text().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true, mode: "date" }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: "date" }),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("auth_accounts_issuer_account_id_idx").on(
      table.issuer,
      table.accountId,
    ),
    index("auth_accounts_user_id_idx").on(table.userId),
  ],
);

export const authVerificationsTable = postgresTable(
  "auth_verifications",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
    ...timestamps,
  },
  (table) => [index("auth_verifications_identifier_idx").on(table.identifier)],
);
