import ApiWorker from "@dtpt/api/worker";
import { Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";
import { fileURLToPath } from "node:url";

export default class Web extends Cloudflare.Website.Vite<Web>()(
  "Web",
  Effect.gen(function* () {
    const stage = yield* Stage;
    const apiWorker = yield* ApiWorker;

    return {
      name: `dotheyplaytoday-web-${stage}`,
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      compatibility: {
        date: "2026-06-02",
        flags: ["nodejs_compat"],
      },
      dev: { port: 4321, strictPort: true },
      env: {
        API: apiWorker,
        VITE_API_URL_BASE: apiWorker.url.as<string>(),
      },
    };
  }),
) {}
