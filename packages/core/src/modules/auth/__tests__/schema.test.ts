import { getTableName, getTableUniqueName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";

import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "../schema.js";
import { usersTable } from "../../users/schema.js";

describe("Better Auth database schema", () => {
  it("uses explicit table names that cannot collide with subscriptions", () => {
    expect(getTableName(usersTable)).toBe("users");
    expect(getTableName(authSessionsTable)).toBe("auth_sessions");
    expect(getTableName(authAccountsTable)).toBe("auth_accounts");
    expect(getTableName(authVerificationsTable)).toBe("auth_verifications");
  });

  it("contains the persistent-session and identity constraints", () => {
    expect(getTableUniqueName(authSessionsTable)).toContain("auth_sessions");
    expect(
      getTableConfig(authSessionsTable).indexes.map(
        (index) => index.config.name,
      ),
    ).toContain("auth_sessions_token_idx");
    expect(
      getTableConfig(authAccountsTable).indexes.map(
        (index) => index.config.name,
      ),
    ).toContain("auth_accounts_issuer_account_id_idx");
    expect(
      getTableConfig(authVerificationsTable).indexes.map(
        (index) => index.config.name,
      ),
    ).toContain("auth_verifications_identifier_idx");
  });
});
