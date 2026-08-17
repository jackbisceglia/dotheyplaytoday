import { Effect } from "effect";
import type { Duration } from "effect";

import { ApiClient as BrowserApiClient } from "./api.client.js";
import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = Effect.gen(function* () {
  if (import.meta.env.SSR) {
    const { ApiClient: ServerApiClient } = yield* Effect.promise(() =>
      import("./api.server.js"),
    );

    return yield* ServerApiClient;
  }

  return yield* BrowserApiClient;
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
