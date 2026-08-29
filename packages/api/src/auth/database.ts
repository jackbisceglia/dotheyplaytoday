import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "@dtpt/core/modules/auth/schema";
import { usersTable } from "@dtpt/core/modules/users/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const authDatabaseSchema = {
  users: usersTable,
  authSessions: authSessionsTable,
  authAccounts: authAccountsTable,
  authVerifications: authVerificationsTable,
} as const;

export type AuthDatabase = ReturnType<typeof createAuthDatabase>["database"];

/** A Promise Drizzle client dedicated to one Worker request. */
export const createAuthDatabase = (connectionString: string) => {
  const client = postgres(connectionString, {
    max: 1,
    fetch_types: false,
    prepare: true,
  });

  return {
    database: drizzle({ client }),
    close: () => client.end({ timeout: 0 }),
  };
};
