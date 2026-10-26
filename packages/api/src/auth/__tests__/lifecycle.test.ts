import { Id } from "@dtpt/core/lib/id/service";
import * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import type { DBAdapter } from "better-auth";
import {
  ConfigProvider,
  Context,
  Effect,
  Exit,
  Fiber,
  Layer,
  Scope,
} from "effect";
import type { Pool } from "pg";
import { describe, expect, it, vi } from "vitest";

import { makeReusableAuth } from "../auth.js";

const state = vi.hoisted<{
  opened: string[];
  closed: string[];
  calls: string[];
}>(() => ({
  opened: [],
  closed: [],
  calls: [],
}));

vi.mock("pg", () => ({
  Pool: class {
    constructor(readonly options: { connectionString: string }) {
      state.opened.push(options.connectionString);
    }
    end() {
      state.closed.push(this.options.connectionString);
      return Promise.resolve(undefined);
    }
  },
}));
vi.mock("drizzle-orm/node-postgres", () => ({
  drizzle: ({ client }: { client: Pool }) => client,
}));
vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: (pool: Pool) => (): DBAdapter => {
    const url = pool.options.connectionString ?? "missing";
    const unexpected = (): Promise<never> =>
      Promise.reject(new Error("Unexpected adapter operation"));
    const adapter: DBAdapter = {
      id: "drizzle",
      create: unexpected,
      findOne: () => {
        expect(state.closed).not.toContain(url);
        state.calls.push(url);
        return Promise.resolve(null);
      },
      findMany: unexpected,
      count: unexpected,
      update: unexpected,
      updateMany: unexpected,
      delete: unexpected,
      deleteMany: unexpected,
      consumeOne: unexpected,
      incrementOne: unexpected,
      transaction: (f) => f(adapter),
    };
    return adapter;
  },
}));

const config = Layer.mergeAll(
  ConfigProvider.layer(
    ConfigProvider.fromUnknown({
      BETTER_AUTH_SECRET: "test-secret-at-least-thirty-two-characters",
      VITE_API_URL_BASE: "https://api.example.com",
      VITE_WEB_URL_BASE: "https://www.example.com",
    }),
  ),
  Layer.mock(Id, {}),
);

const requestContext = (id: string) =>
  Context.make(RuntimeContext, {
    Type: "test",
    id,
    env: {},
    get: () => Effect.die("Unexpected binding lookup"),
    set: () => Effect.die("Unexpected binding write"),
  }).pipe(
    Context.add(Cloudflare.WorkerExecutionContext, {
      raw: {
        waitUntil: vi.fn(),
        passThroughOnException: vi.fn(),
        props: {},
        get tracing(): never {
          throw new Error("Unused");
        },
      },
      waitUntil: () => Effect.die("Unused"),
      passThroughOnException: () => Effect.void,
      access: Effect.succeed(undefined),
      cache: { purge: () => Effect.die("Unused") },
    }),
  );

const make = () =>
  Effect.runPromise(
    makeReusableAuth(
      RuntimeContext.pipe(Effect.map((runtime) => runtime.id)),
    ).pipe(Effect.provide(config)),
  );

const lookup = async (
  client: Parameters<Parameters<Awaited<ReturnType<typeof make>>["use"]>[0]>[0],
) => (await client.$context).adapter.findOne({ model: "user", where: [] });

describe("reusable auth ownership", () => {
  it("shares endpoints, isolates overlapping requests, and releases each pool once", async () => {
    const auth = await make();
    const firstEntered = Promise.withResolvers<undefined>();
    const secondEntered = Promise.withResolvers<undefined>();
    const firstDone = Promise.withResolvers<undefined>();
    const clients: unknown[] = [];
    const run = (id: string, work: Parameters<typeof auth.use>[0]) =>
      Effect.runPromise(
        auth
          .use(work)
          .pipe(Effect.provideContext(requestContext(id)), Effect.scoped),
      );
    const first = run("first", async (client) => {
      clients.push(client);
      await lookup(client);
      firstEntered.resolve(undefined);
      await secondEntered.promise;
      await lookup(client);
    }).then(() => {
      firstDone.resolve(undefined);
    });
    await firstEntered.promise;
    const second = run("second", async (client) => {
      clients.push(client);
      await lookup(client);
      secondEntered.resolve(undefined);
      await firstDone.promise;
      await lookup(client);
    });
    await Promise.all([first, second]);
    expect(clients[0]).toBe(clients[1]);
    expect(state.calls).toEqual(["first", "second", "first", "second"]);
    expect(state.opened).toEqual(["first", "second"]);
    expect(state.closed).toEqual(["first", "second"]);

    await Effect.runPromise(
      Effect.gen(function* () {
        yield* auth.use(lookup);
        yield* auth.use(lookup);
      }).pipe(Effect.provideContext(requestContext("third")), Effect.scoped),
    );
    expect(state.opened.filter((id) => id === "third")).toHaveLength(1);
    expect(state.closed.filter((id) => id === "third")).toHaveLength(1);
  });

  it("closes on failure and waits for native auth work before interruption cleanup", async () => {
    const auth = await make();
    await expect(
      Effect.runPromise(
        auth
          .use(() => Promise.reject(new Error("failure")))
          .pipe(
            Effect.provideContext(requestContext("failure")),
            Effect.scoped,
          ),
      ),
    ).rejects.toThrow();
    expect(state.closed.filter((id) => id === "failure")).toHaveLength(1);

    const entered = Promise.withResolvers<undefined>();
    const release = Promise.withResolvers<undefined>();
    const scope = Scope.makeUnsafe();
    const fiber = Effect.runFork(
      auth
        .use(async (client) => {
          entered.resolve(undefined);
          await release.promise;
          await lookup(client);
        })
        .pipe(
          Effect.provideContext(requestContext("interrupted")),
          Scope.provide(scope),
        ),
    );
    await entered.promise;
    const stopped = Effect.runPromise(Fiber.interrupt(fiber)).then(() =>
      Effect.runPromise(Scope.close(scope, Exit.void)),
    );
    expect(state.closed).not.toContain("interrupted");
    release.resolve(undefined);
    await stopped;
    expect(state.closed.filter((id) => id === "interrupted")).toHaveLength(1);
  });
});
