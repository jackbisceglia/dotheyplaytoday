import { ConfigProvider, Effect, Redacted } from "effect";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";
import { describe, expect, it, vi } from "vitest";

import { AuthConfig } from "../config.js";
import { openAuthPool } from "../pool.js";

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

  it("closes the Better Auth PostgreSQL pool with its Effect scope", async () => {
    let openDuringInnerFinalizer = false;
    const pool = await Effect.runPromise(
      Effect.scoped(
        Effect.gen(function* () {
          const pool = yield* openAuthPool(
            Effect.succeed(
              Redacted.make("postgres://user:password@localhost:5432/database"),
            ),
          );

          yield* Effect.addFinalizer(() =>
            Effect.sync(() => {
              openDuringInnerFinalizer = !pool.ending;
            }),
          );

          return pool;
        }),
      ),
    );

    expect(openDuringInnerFinalizer).toBe(true);
    expect(pool.ended).toBe(true);
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
