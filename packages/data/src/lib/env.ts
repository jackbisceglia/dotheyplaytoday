import { ConfigProvider, Layer } from "effect";

export const DotEnvConfigProvider = ConfigProvider.layerAdd(
  ConfigProvider.fromDotEnv({ path: ".env" }),
).pipe(Layer.catch(() => Layer.empty));
