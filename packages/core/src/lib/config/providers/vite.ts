import { ConfigProvider } from "effect";

/**
 * Installs a config provider backed by Vite's `import.meta.env`, for
 * browser/Vite runtimes where there is no filesystem `.env` to read.
 *
 * Runtime-neutral: the values are inlined at build time, so this resolves the
 * same way during server rendering and after client hydration.
 */
export const createConfigProviderFromViteEnv = (viteEnv: unknown) =>
  ConfigProvider.layer(ConfigProvider.fromUnknown(viteEnv));
