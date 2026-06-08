import { ConfigProvider, Effect } from "effect";

export const DotEnvConfigProvider = ConfigProvider.layerAdd(
  ConfigProvider.fromDotEnv({ path: ".env" }).pipe(
    Effect.orElseSucceed(() => ConfigProvider.fromUnknown({})),
  ),
);
