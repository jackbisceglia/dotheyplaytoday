import { fileURLToPath } from "node:url";

import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  adapter: node({ mode: "standalone" }),
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
