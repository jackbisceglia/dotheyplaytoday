import { Api } from "@dtpt/core/contracts/api";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { Effect } from "effect";
import type { Duration } from "effect";
import { HttpClient } from "effect/unstable/http";
import { HttpApiClient } from "effect/unstable/httpapi";

import { RuntimeClient } from "./platform.js";

const RuntimeHttpClient = Effect.gen(function* () {
  if (import.meta.env.SSR) {
    const { CloudflareBindingHttpClient } = yield* Effect.promise(() =>
      import("./cloudflare-http-client.js"),
    );

    return CloudflareBindingHttpClient;
  }

  return yield* HttpClient.HttpClient;
});

export type Client = typeof Client;
export const Client = Effect.gen(function* () {
  const baseUrl = yield* ApiUrl;
  const httpClient = yield* RuntimeHttpClient;

  return yield* HttpApiClient.makeWith(Api, { baseUrl, httpClient });
});

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
  duration: Duration.Input = "10 seconds",
) {
  const procedure = Effect.gen(function* () {
    const client = yield* Client;

    return yield* useClient(client);
  }).pipe(Effect.timeout(duration));

  return RuntimeClient.runPromise(procedure);
}
