import { ConfigProvider, Effect, Layer } from "effect";
import { Path } from "effect/Path";

// TODO: Separate Node dotenv resolution from browser providers to fix Vite's unresolved asset warning.
const WORKSPACE_ROOT_URL = new URL("../../../../../", import.meta.url);

/**
 * Installs the workspace-root `.env` config provider for Node runtimes.
 * The path is anchored to this package so package scripts and root one-offs
 * resolve the same file.
 */
export const createConfigProviderFromDotEnv = Effect.fn(
  function* () {
    const path = yield* Path;
    const resolvedDotEnvPath = yield* path.fromFileUrl(
      new URL(".env", WORKSPACE_ROOT_URL),
    );

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

/**
 * Installs a config provider backed by Cloudflare's Worker `env` object.
 */
export const createConfigProviderFromCloudflareEnv = (env: unknown) =>
  ConfigProvider.layer(ConfigProvider.fromUnknown(env));
