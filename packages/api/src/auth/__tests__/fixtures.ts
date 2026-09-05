import * as Cloudflare from "alchemy/Cloudflare";
import { Id } from "@dtpt/core/lib/id/service";
import { sendMagicLink } from "@dtpt/core/modules/email/transactional/magic-link";
import { memoryAdapter } from "better-auth/adapters/memory";
import { ConfigProvider, Effect, Layer, Redacted } from "effect";
import { vi } from "vitest";

import { createAuth } from "../auth.js";

// Replace only persistence and email delivery; exercise the production constructor.
const storage = vi.hoisted(() => ({
  current: {} as Record<string, Record<string, unknown>[]>,
}));
vi.mock("better-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("better-auth")>();
  return {
    ...actual,
    betterAuth: (options: Parameters<typeof actual.betterAuth>[0]) =>
      actual.betterAuth({
        ...options,
        database: memoryAdapter(storage.current),
      }),
  };
});
vi.mock(
  "@dtpt/core/modules/email/transactional/magic-link",
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import("@dtpt/core/modules/email/transactional/magic-link")
    >()),
    sendMagicLink: vi.fn(() => Effect.void),
  }),
);

let client = 0;

export const makeAuthFixture = async () => {
  const database = {
    users: [
      {
        id: "existing-notification-user",
        email: "user@example.com",
        name: "Test User",
        email_verified: false,
        timezone: "America/New_York",
        unsubscribe_token: "existing-unsubscribe-token",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    auth_sessions: [] as Record<string, unknown>[],
    auth_accounts: [] as Record<string, unknown>[],
    auth_verifications: [] as Record<string, unknown>[],
  };
  storage.current = database;
  const sender = vi.mocked(sendMagicLink).mockClear();
  const pending: Promise<unknown>[] = [];
  const layer = Layer.mergeAll(
    ConfigProvider.layer(
      ConfigProvider.fromEnv({
        env: {
          BETTER_AUTH_SECRET:
            "test-secret-that-is-at-least-thirty-two-characters",
          VITE_API_URL_BASE: "https://api.example.com",
          VITE_WEB_URL_BASE: "https://www.example.com",
        },
      }),
    ),
    Layer.mock(Id, {}),
    Layer.mock(Cloudflare.WorkerExecutionContext, {
      get cache(): never {
        throw new Error("Cache is not used by auth");
      },
      raw: {
        waitUntil: (promise) => {
          pending.push(promise);
        },
        passThroughOnException: () => undefined,
        props: {},
        get tracing(): never {
          throw new Error("Tracing is not used by auth");
        },
      },
    }),
  );
  const makeAuth = () =>
    Effect.runPromise(
      Effect.scoped(
        createAuth(
          Effect.succeed(
            Redacted.make("postgres://user:password@localhost:5432/database"),
          ),
        ).pipe(Effect.provide(layer)),
      ),
    );
  const auth = await makeAuth();
  const ip = `192.0.2.${String(++client)}`;
  const request = (
    path: string,
    body?: unknown,
    origin = "https://www.example.com",
  ) =>
    new Request(`https://api.example.com/api/auth${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": ip,
        origin,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

  return { auth, makeAuth, database, sendMagicLink: sender, pending, request };
};
