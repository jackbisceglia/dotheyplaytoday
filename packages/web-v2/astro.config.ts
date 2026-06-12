import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
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
