import { ConfigProvider, Effect, Layer } from "effect";

export const DotEnvConfigProvider = ConfigProvider.layerAdd(
  ConfigProvider.fromDotEnv({ path: ".env" }),
).pipe(
  Layer.catch((error) =>
    Layer.effectDiscard(
      Effect.logWarning("api-v2: unable to load .env", { error }),
    ),
  ),
);
