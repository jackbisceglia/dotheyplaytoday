import * as Cloudflare from "alchemy/Cloudflare";
import { Id } from "@dtpt/core/lib/id/service";
import { sendMagicLink } from "@dtpt/core/modules/email/transactional/magic-link";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { ConfigProvider, Effect, Layer } from "effect";
import { onTestFinished, vi } from "vitest";

import { Auth } from "../auth.js";

// Keep the production auth/adapter configuration; replace only the DB driver.
const storage = vi.hoisted<{ current?: PGlite }>(() => ({}));
vi.mock("drizzle-orm/node-postgres", () => ({
  drizzle: () => {
    if (!storage.current) throw new Error("Missing test database");
    return drizzle({ client: storage.current });
  },
}));
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
  const database = new PGlite();
  onTestFinished(() => database.close());
  await database.exec(
    await readFile(
      new URL(
        "../../../../data/migrations/postgres/0001_initial.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await database.exec(`INSERT INTO users (id, email, timezone, unsubscribe_token)
    VALUES ('existing-notification-user', 'user@example.com', 'America/New_York', 'existing-unsubscribe-token')`);
  await database.exec(
    await readFile(
      new URL(
        "../../../../data/migrations/postgres/0004_better_auth.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  storage.current = database;
  const rows = async (
    table: "users" | "auth_sessions" | "auth_verifications",
  ) =>
    (await database.query<Record<string, unknown>>(`SELECT * FROM ${table}`))
      .rows;
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
      cache: { purge: () => Effect.die("Cache is not used by auth") },
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
      Auth.pipe(
        Effect.provide(
          Auth.layer("postgres://user:password@localhost:5432/database").pipe(
            Layer.provide(layer),
          ),
        ),
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

  return {
    auth,
    makeAuth,
    database,
    rows,
    sendMagicLink: sender,
    pending,
    request,
  };
};
