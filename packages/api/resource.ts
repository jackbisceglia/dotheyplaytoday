import * as Cloudflare from "alchemy/Cloudflare";

/** Binds the API's resolved public URL into a Worker's environment. */
export const bindApiUrl = (worker: Cloudflare.Worker, api: Cloudflare.Worker) =>
  worker.bind("ApiUrl", {
    bindings: [
      {
        type: "plain_text",
        name: "VITE_API_URL_BASE",
        text: api.url.as<string>(),
      },
    ],
  });
