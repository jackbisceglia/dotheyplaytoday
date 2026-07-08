import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import {
  EventsLayer,
  Id,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "./packages/core/src/index.js";
import { createD1ApiDatabaseLayer } from "./packages/data/src/seed/d1-api.js";
import { runSeed, type SeedRunOptions } from "./packages/data/src/seed/run.js";

const RootDir = fileURLToPath(new URL(".", import.meta.url));
const NotifyCron = "*/15 * * * *";
const NotifyWorkerDevPort = 8788;
const SeedModeConfig = Config.string("DTPT_SEED_MODE").pipe(Config.option);
const SeedRunIdConfig = Config.string("DTPT_SEED_RUN_ID").pipe(
  Config.withDefault("manual"),
);
const SeedIdLayer = Layer.succeed(
  Id,
  Id.of({
    generate: () => Effect.sync(() => randomUUID()),
    makeFromBrandedSchema: (schema) =>
      Effect.sync(() => schema.make(randomUUID())),
  }),
);

type SeedDatabaseInput = {
  readonly accountId: string;
  readonly databaseId: string;
  readonly mode: SeedRunOptions["mode"];
  readonly runId: string;
};

const SeedDatabase = Alchemy.Action(
  "DataSeed.Database",
  Effect.fn("DataSeed.Database")(function* (input: SeedDatabaseInput) {
    const SeedLayer = pipe(
      Layer.mergeAll(
        SubjectsLayer,
        EventsLayer,
        UsersLayer,
        SubscriptionsLayer,
      ),
      Layer.provideMerge(
        createD1ApiDatabaseLayer({
          accountId: input.accountId,
          databaseId: input.databaseId,
        }),
      ),
      Layer.provide(SeedIdLayer),
    );

    return yield* runSeed({ mode: input.mode }).pipe(Effect.provide(SeedLayer));
  }),
);

const decodeSeedMode = (mode: string): SeedRunOptions["mode"] | undefined =>
  mode === "dev" || mode === "prod" ? mode : undefined;

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* Alchemy.AlchemyContext;

    const database = yield* Cloudflare.D1Database("Database", {
      migrationsDir: path.join(RootDir, "packages/data/migrations"),
      primaryLocationHint: "wnam",
    });

    const notifyWorker = yield* Cloudflare.Worker("NotifyWorker", {
      main: path.join(RootDir, "packages/jobs/src/notify/worker.ts"),
      compatibility: {
        date: "2026-06-02",
        flags: ["nodejs_compat"],
      },
      crons: [NotifyCron],
      dev: { port: NotifyWorkerDevPort },
      env: {
        Database: database,
        PUBLIC_WEB_URL_BASE: Config.string("PUBLIC_WEB_URL_BASE"),
        RESEND_API_KEY: Config.redacted("RESEND_API_KEY"),
        RESEND_FROM_EMAIL: Config.string("RESEND_FROM_EMAIL"),
        ENVIRONMENT: context.dev ? "development" : "production",
      },
    });

    const seedMode = yield* SeedModeConfig;
    if (Option.isSome(seedMode)) {
      const mode = decodeSeedMode(seedMode.value);

      if (mode === undefined) {
        return yield* Effect.die(
          new Error(`Invalid DTPT_SEED_MODE "${seedMode.value}"`),
        );
      }

      yield* SeedDatabase({
        accountId: database.accountId,
        databaseId: database.databaseId,
        mode,
        runId: yield* SeedRunIdConfig,
      });
    }

    return {
      databaseName: database.databaseName,
      notifyCron: NotifyCron,
      notifyWorkerName: notifyWorker.workerName,
      notifyWorkerUrl: notifyWorker.url,
    };
  }),
);
