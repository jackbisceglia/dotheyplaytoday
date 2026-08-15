import "server-only";

import { Api } from "@dtpt/core/contracts/api";
import { env } from "cloudflare:workers";
import { fromCloudflareFetcher, toHttpClient } from "alchemy/Cloudflare/Bridge";
import { HttpApiClient } from "effect/unstable/httpapi";

export const ClientForPlatform = HttpApiClient.makeWith(Api, {
  baseUrl: "https://api.internal",
  httpClient: toHttpClient(fromCloudflareFetcher(env.API)),
});
