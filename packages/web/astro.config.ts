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
          find: /^@dtpt\/core\/(.+)$/,
          replacement: fileURLToPath(
            new URL("../core/src/$1", import.meta.url),
          ),
        },
      ],
    },
  },
});
