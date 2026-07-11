import * as Cloudflare from "alchemy/Cloudflare";
import { ConfigProvider, Effect, Layer } from "effect";
import { Path } from "effect/Path";

/**
 * Installs the workspace-root `.env` config provider for Node runtimes.
 * The path is anchored to this package so package scripts and root one-offs
 * resolve the same file.
 */
export const createConfigProviderFromDotEnv = Effect.fn(function* () {
  // Resolved lazily: `new URL(…, import.meta.url)` throws at module init
  // under workerd, and Worker bundles import this module for the alchemy
  // env provider below.
  const workspaceRootUrl = new URL("../../../../../", import.meta.url);
  const path = yield* Path;
  const resolvedDotEnvPath = yield* path.fromFileUrl(
    new URL(".env", workspaceRootUrl),
  );

  const Provider = ConfigProvider.fromDotEnv({ path: resolvedDotEnvPath });

  return ConfigProvider.layerAdd(Provider).pipe(Layer.catch(() => Layer.empty));
}, Layer.unwrap);

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

// TODO(alchemy): delete once alchemy decodes bindings in its worker
// ConfigProvider. Alchemy deploys worker Config values as secret_text whose
// text is the JSON marker `{"_tag":"Redacted","value":…}` (its
// WorkerRuntimeContext.set), and its own runtime `get` accessor decodes that
// marker — but the ConfigProvider it installs in workers reads the raw env.
const decodeAlchemyEnvValue = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "_tag" in parsed &&
      parsed._tag === "Redacted" &&
      "value" in parsed
    ) {
      return parsed.value;
    }
  } catch {
    // Non-Config bindings are plain text, not JSON.
  }
  return value;
};

/**
 * Installs a config provider that decodes Alchemy's serialized worker env
 * bindings, falling back to the ambient provider for anything else.
 */
export const createConfigProviderFromAlchemyWorkerEnv = () =>
  Layer.effect(
    ConfigProvider.ConfigProvider,
    Effect.gen(function* () {
      const ambient = yield* ConfigProvider.ConfigProvider;
      const env = yield* Cloudflare.Workers.WorkerEnvironment;

      const decoded = Object.fromEntries(
        Object.entries(env).map(([key, value]) => [
          key,
          decodeAlchemyEnvValue(value),
        ]),
      );

      return ConfigProvider.orElse(
        ConfigProvider.fromUnknown(decoded),
        ambient,
      );
    }),
  );
