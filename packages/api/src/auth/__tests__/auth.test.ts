import { ConfigProvider, Effect } from "effect";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";
import { describe, expect, it, vi } from "vitest";

import { AuthConfig } from "../config.js";
import { toPromiseDatabase } from "../database.js";

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

  it("runs Promise-based Drizzle calls through Effect", async () => {
    const selectBuilder = Object.assign(() => undefined, {
      from: vi.fn(() => Effect.succeed([{ id: "user-id" }])),
    });
    const select = vi.fn(() => selectBuilder);
    const findFirst = vi.fn(() => Effect.succeed({ id: "user-id" }));
    const usersQuery = Object.assign(() => undefined, { findFirst });
    const query = Object.assign(() => undefined, { usersTable: usersQuery });
    const database = toPromiseDatabase({ select, query }, Effect.runPromise);

    const selected = await Promise.resolve(database.select().from());
    const found = await Promise.resolve(database.query.usersTable.findFirst());

    expect(selected).toEqual([{ id: "user-id" }]);
    expect(found).toEqual({ id: "user-id" });
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
