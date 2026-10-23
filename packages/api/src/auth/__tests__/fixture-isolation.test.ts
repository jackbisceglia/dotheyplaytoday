import { expect, it } from "vitest";

import { makeAuthFixture } from "./fixtures.js";

it("resets users and auth state between fixtures", async () => {
  const first = await makeAuthFixture();
  await first.database.exec(`
    UPDATE users SET email_verified = true, name = 'Previous fixture';
    INSERT INTO users (id, email, timezone, unsubscribe_token)
      VALUES ('another-user', 'another@example.com', 'UTC', 'another-token');
    INSERT INTO auth_sessions (id, expires_at, token, user_id)
      VALUES ('session', CURRENT_TIMESTAMP + INTERVAL '1 hour', 'token', 'another-user');
    INSERT INTO auth_accounts (id, issuer, account_id, provider_id, user_id)
      VALUES ('account', 'issuer', 'account', 'provider', 'another-user');
    INSERT INTO auth_verifications (id, identifier, value, expires_at)
      VALUES ('verification', 'identifier', 'value', CURRENT_TIMESTAMP + INTERVAL '1 hour');
  `);

  const next = await makeAuthFixture();
  expect(await next.rows("users")).toEqual([
    expect.objectContaining({
      id: "existing-notification-user",
      email: "user@example.com",
      email_verified: false,
      name: null,
    }),
  ]);
  expect(await next.rows("auth_sessions")).toEqual([]);
  expect(await next.rows("auth_verifications")).toEqual([]);
  expect(
    (await next.database.query("SELECT * FROM auth_accounts")).rows,
  ).toEqual([]);
});
