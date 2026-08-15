import solid from "@solidjs/vite-plugin";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const apiClientModules = {
  client: fileURLToPath(new URL("./src/lib/api.client.ts", import.meta.url)),
  server: fileURLToPath(new URL("./src/lib/api.server.ts", import.meta.url)),
};

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
      name: "dtpt:api-client-transport",
      enforce: "pre",
      resolveId(source) {
        if (source === "virtual:dtpt-api-client") {
          return this.environment.name === "client"
            ? apiClientModules.client
            : apiClientModules.server;
        }

        return undefined;
      },
    },
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
