import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
  // the workspace root owns the single `.env`; `PUBLIC_` mirrors the prefix the
  // shared `@dtpt/core` config keys already use, so it must be exposed to the
  // client bundle alongside Vite's own default.
  envDir: "../../",
  envPrefix: ["PUBLIC_", "VITE_"],
  server: { port: 4321 },
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: /^@dtpt\/core\/(.+)$/,
        replacement: fileURLToPath(new URL("../core/src/$1", import.meta.url)),
      },
    ],
  },
  plugins: [
    tanstackStart(),
    // solid's vite plugin must come after start's vite plugin
    viteSolid({ ssr: true }),
  ],
});
