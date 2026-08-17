import ApiWorker from "@dtpt/api/worker";
import { Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Output from "alchemy/Output";
import { Effect } from "effect";
import { fileURLToPath } from "node:url";

export default class Web extends Cloudflare.Website.Vite<Web>()(
  "Web",
  Effect.gen(function* () {
    const stage = yield* Stage;
    const apiWorker = yield* ApiWorker;
    const apiWorkerUrl = apiWorker.url.pipe(
      Output.map((value) => {
        if (value === undefined) {
          throw new Error("API Worker URL is unavailable");
        }

        return value;
      }),
    );

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
        VITE_API_URL: apiWorkerUrl,
      },
    };
  }),
) {}
