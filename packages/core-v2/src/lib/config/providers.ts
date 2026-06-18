import { ConfigProvider, Effect, Layer } from "effect";
import { Path } from "effect/Path";

/**
 * Installs a caller-selected `.env` config provider for Node runtimes.
 * Relative paths are resolved from the current working directory.
 */
export const createConfigProviderFromDotEnv = Effect.fn(
  function* (envPath: string) {
    const path = yield* Path;

    const resolvedDotEnvPath = path.isAbsolute(envPath)
      ? envPath
      : path.resolve(envPath);

    const Provider = ConfigProvider.fromDotEnv({ path: resolvedDotEnvPath });

    return ConfigProvider.layer(Provider);
  },
  Layer.unwrap,
);

/**
 * Installs a config provider backed by Vite's `import.meta.env`, for
 * browser/Vite runtimes where there is no filesystem `.env` to read.
 */
export const createConfigProviderFromViteEnv = (viteEnv: unknown) =>
  ConfigProvider.layer(ConfigProvider.fromUnknown(viteEnv));
