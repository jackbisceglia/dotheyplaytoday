import ApiWorker from "@dtpt/api/worker";
import { getManagedServiceDomain } from "@dtpt/core/lib/alchemy/domain";
import { exactOptional } from "@dtpt/core/lib/utils";
import { Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";
import { fileURLToPath } from "node:url";

const getWebEsportsDomain = (stage: string) =>
  getManagedServiceDomain("esports", stage);

export default class WebEsports extends Cloudflare.Website.Vite<WebEsports>()(
  "WebEsports",
  Effect.gen(function* () {
    const stage = yield* Stage;
    const apiWorker = yield* ApiWorker;
    const domain = getWebEsportsDomain(stage);

    return {
      name: `dotheyplaytoday-web-esports-${stage}`,
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      compatibility: {
        date: "2026-06-02",
        flags: ["nodejs_compat"],
      },
      dev: { port: 4322, strictPort: true },
      ...exactOptional(domain, (domain) => ({ domain })),
      env: {
        API: apiWorker,
        VITE_API_URL_BASE: apiWorker.url.as<string>(),
      },
    };
  }),
) {}

/** Late-binds WebEsports' resolved public URL without creating a props-level cycle. */
export const bindWebEsportsUrl = (worker: Cloudflare.Worker, web: WebEsports) =>
  worker.bind("WebEsportsUrl", {
    bindings: [
      {
        type: "plain_text",
        name: "VITE_WEB_ESPORTS_URL_BASE",
        text: web.url.as<string>(),
      },
    ],
  });
