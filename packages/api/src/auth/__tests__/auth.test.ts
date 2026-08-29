import { ConfigProvider, Effect } from "effect";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";
import { describe, expect, it, vi } from "vitest";

import { usersTable } from "@dtpt/core/modules/users/schema";

import { AuthConfig } from "../config.js";
import { makeAuthDatabase } from "../database.js";

describe("authentication boundaries", () => {
  it("keeps environment configuration limited to the auth secret", async () => {
    const config = await Effect.runPromise(
      AuthConfig.pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({
              env: { BETTER_AUTH_SECRET: "test-secret" },
            }),
          ),
        ),
      ),
    );

    expect(Object.keys(config)).toEqual(["secret"]);
  });

  it("backs Promise Drizzle with the existing Effect SQL client", async () => {
    const unsafe = vi.fn(() => ({
      raw: Effect.succeed({ rowCount: 1 }),
      values: Effect.succeed([["user-id"]]),
    }));
    const database = makeAuthDatabase({ unsafe }, Effect.runPromise);

    const selected = await database
      .select({ id: usersTable.id })
      .from(usersTable);
    const deleted = await database.delete(usersTable);

    expect(selected).toEqual([{ id: "user-id" }]);
    expect(deleted).toEqual([{ rowCount: 1 }]);
    expect(unsafe).toHaveBeenCalledTimes(2);
  });

  it("returns the ordinary success response before eligibility filtering", async () => {
    const sendMagicLink = vi.fn(() => Promise.resolve());
    const auth = betterAuth({
      baseURL: "https://api.example.com",
      secret: "test-secret-that-is-at-least-thirty-two-characters",
      database: memoryAdapter({}),
      plugins: [magicLink({ disableSignUp: true, sendMagicLink })],
    });

    const response = await auth.handler(
      new Request("https://api.example.com/api/auth/sign-in/magic-link", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://api.example.com",
        },
        body: JSON.stringify({ email: "unknown@example.com" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: true });
    expect(sendMagicLink).toHaveBeenCalledOnce();
  });
});
