import { ConfigProvider, Effect, Layer } from "effect";
import { Path } from "effect/Path";

type DotEnvPath = string | URL;

/**
 * Installs a caller-selected `.env` config provider for Node runtimes.
 * URL paths are resolved independently from the current working directory.
 */
export const createConfigProviderFromDotEnv = Effect.fn(
  function* (envPath: DotEnvPath) {
    const path = yield* Path;

    const resolvedDotEnvPath =
      envPath instanceof URL
        ? yield* path.fromFileUrl(envPath)
        : path.isAbsolute(envPath)
          ? envPath
          : path.resolve(envPath);

    const Provider = ConfigProvider.fromDotEnv({ path: resolvedDotEnvPath });

    return ConfigProvider.layerAdd(Provider).pipe(
      Layer.catch(() => Layer.empty),
    );
  },
  Layer.unwrap,
);

/**
 * Installs a config provider backed by Vite's `import.meta.env`, for
 * browser/Vite runtimes where there is no filesystem `.env` to read.
 */
export const createConfigProviderFromViteEnv = (viteEnv: unknown) =>
  ConfigProvider.layer(ConfigProvider.fromUnknown(viteEnv));
