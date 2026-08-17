import { Effect } from "effect";
import type { Duration } from "effect";

import { ApiClient as BrowserApiClient } from "./api.client.js";
import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = await (async () => {
  if (import.meta.env.SSR) {
    const { ApiClient: ServerApiClient } = await import("./api.server.js");

    return ServerApiClient;
  }

  return BrowserApiClient;
})();

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
  duration: Duration.Input = "10 seconds",
) {
  return RuntimeClient.runPromise(
    Effect.flatMap(Client, useClient).pipe(Effect.timeout(duration)),
  );
}
