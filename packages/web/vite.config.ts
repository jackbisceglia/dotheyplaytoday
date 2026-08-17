import cloudflare from "@distilled.cloud/cloudflare-vite-plugin";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  envDir: "../..",
  plugins: [
    process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1"
      ? null
      : cloudflare({
          compatibilityDate: "2026-06-02",
          compatibilityFlags: ["nodejs_compat"],
        }),
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
