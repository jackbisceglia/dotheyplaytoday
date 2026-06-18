import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare(),
  vite: {
    envDir: "../../",
    resolve: {
      alias: [
        {
          find: /^@dtpt\/core-v2\/(.+)$/,
          replacement: fileURLToPath(
            new URL("../core-v2/src/$1", import.meta.url),
          ),
        },
      ],
    },
  },
});
