import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { createD1HttpDatabaseLayer } from "@dtpt/core/lib/database/d1-http";
import { Config, Effect, Layer, ManagedRuntime, pipe } from "effect";

/**
 * Alchemy physical names follow `${stack}-${id}-${stage}-${suffix}` with
 * non-alphanumeric characters replaced by hyphens. The stack name and D1
 * resource id must match `alchemy.run.ts`.
 */
const AlchemyStackName = "dotheyplaytoday";
const AlchemyDatabaseId = "Database";

const sanitizePhysicalName = (name: string) =>
  name.replaceAll(/[^a-zA-Z0-9-]/g, "-");

/**
 * Mirrors the Alchemy CLI's stage default of `dev_${USER}` so the seed
 * targets the same D1 database that `alchemy dev` and `alchemy deploy`
 * provision. Set ALCHEMY_STAGE to seed another stage.
 */
const StageConfig = Config.string("ALCHEMY_STAGE").pipe(
  Config.orElse(() =>
    Config.string("USER").pipe(Config.map((user) => `dev_${user}`)),
  ),
);

const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const stage = yield* StageConfig;

    return createD1HttpDatabaseLayer({
      databaseNamePrefix: sanitizePhysicalName(
        `${AlchemyStackName}-${AlchemyDatabaseId}-${stage}-`,
      ),
    });
  }),
);

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const DataRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provide(IdLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
