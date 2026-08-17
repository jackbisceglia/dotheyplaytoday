import "server-only";

import { Api } from "@dtpt/core/contracts/api";
import { env } from "cloudflare:workers";
import { fromCloudflareFetcher, toHttpClient } from "alchemy/Cloudflare/Bridge";
import { HttpApiClient } from "effect/unstable/httpapi";

export const ApiClient = HttpApiClient.makeWith(Api, {
  httpClient: toHttpClient(fromCloudflareFetcher(env.API)),
});
