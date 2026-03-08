import path from "node:path";

import { WebConfig } from "@dtpt/core/lib/config/web";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

import { solidStart } from "@solidjs/start/config";
import { Effect } from "effect";

const webPort = WebConfig.pipe(
  Effect.map((config) => config.port),
  Effect.orDie,
  Effect.runSync,
);

export default defineConfig(() => {
  return {
    plugins: [solidStart(), nitro()],
    envDir: "../../",
    server: {
      port: webPort,
    },
    resolve: {
      alias: {
        "~": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});
