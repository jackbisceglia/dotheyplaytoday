import cloudflare from "@distilled.cloud/cloudflare-vite-plugin";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

const isAlchemyEnv = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

/** Installs the Cloudflare provider unless Alchemy is already providing it. */
const standaloneCloudflare = () => {
  if (isAlchemyEnv) return null;

  return cloudflare({
    compatibilityDate: "2026-06-02",
    compatibilityFlags: ["nodejs_compat"],
  });
};

export default defineConfig({
  envDir: isAlchemyEnv ? false : "../..",
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
