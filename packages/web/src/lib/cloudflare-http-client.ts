import "server-only";

import { env } from "cloudflare:workers";
import { fromCloudflareFetcher, toHttpClient } from "alchemy/Cloudflare/Bridge";

export const CloudflareBindingHttpClient = toHttpClient(
  fromCloudflareFetcher(env.API),
);
