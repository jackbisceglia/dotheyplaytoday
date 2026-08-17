import cloudflare from "@distilled.cloud/cloudflare-vite-plugin";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

/** Installs the Cloudflare provider unless Alchemy is already providing it. */
function standaloneCloudflare() {
  const isAlchemyEnv = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

  if (isAlchemyEnv) return null;

  return cloudflare({
    compatibilityDate: "2026-06-02",
    compatibilityFlags: ["nodejs_compat"],
  });
}

export default defineConfig({
  envDir:
    process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1" ? false : "../..",
  plugins: [
    standaloneCloudflare(),
    solid({ start: true, ssr: true }),
    {
      name: "dtpt:disable-ssr-dependency-discovery",
      enforce: "post",
      configEnvironment(name) {
        if (name === "ssr") {
          // Alchemy re-enables discovery after user config. Keep it disabled
          // until its workerd runtime can safely reload an in-flight program.
          return { optimizeDeps: { noDiscovery: true } };
        }

        return undefined;
      },
    },
  ],
});
