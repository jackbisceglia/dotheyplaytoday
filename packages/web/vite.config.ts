import solid from "@solidjs/vite-plugin";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rolldownOptions: {
      external: [/^cloudflare:/],
    },
  },
  envPrefix: ["VITE_", "PUBLIC_"],
  resolve: {
    alias: [
      {
        find: /^@dtpt\/core\/(.+)$/,
        replacement: fileURLToPath(new URL("../core/src/$1", import.meta.url)),
      },
    ],
  },
  plugins: [
    solid({ start: true, ssr: true }),
    {
      name: "dtpt:disable-ssr-dependency-discovery",
      enforce: "post",
      configEnvironment(name) {
        if (name === "ssr") {
          // Alchemy enables discovery after user config, but workerd cannot
          // safely reload the SSR program during an in-flight request.
          return { optimizeDeps: { noDiscovery: true } };
        }

        return undefined;
      },
    },
  ],
});
