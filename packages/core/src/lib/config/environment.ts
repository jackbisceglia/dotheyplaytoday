import { Config, Effect } from "effect";

export const RuntimeEnvironments = Config.all({
  nodeEnvironment: Config.string("NODE_ENV").pipe(
    Config.withDefault(undefined),
  ),
  railwayEnvironmentName: Config.string("RAILWAY_ENVIRONMENT_NAME").pipe(
    Config.withDefault(undefined),
  ),
});

export const BackendRuntime = Effect.gen(function* () {
  const environments = yield* RuntimeEnvironments;
  const railway =
    environments.railwayEnvironmentName === ""
      ? undefined
      : environments.railwayEnvironmentName;
  const node = environments.nodeEnvironment;

  return railway ?? node;
});
