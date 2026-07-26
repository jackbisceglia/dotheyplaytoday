import { ConfigProvider, Effect, Layer } from "effect";
import { Path } from "effect/Path";

const WORKSPACE_ROOT_URL = new URL("../../../../../../", import.meta.url);

/**
 * Installs the workspace-root `.env` config provider for Node runtimes.
 * The path is anchored to this package so package scripts and root one-offs
 * resolve the same file.
 *
 * Server-only: this reads the filesystem, so it lives apart from the runtime-
 * neutral providers and must not be imported by code that also runs in a
 * browser bundle.
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
