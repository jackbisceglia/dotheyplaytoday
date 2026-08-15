import { Effect } from "effect";
import type { Duration } from "effect";
import { ClientForPlatform } from "virtual:dtpt-api-client";

import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = ClientForPlatform;

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
) {
  const procedure = Effect.gen(function* () {
    const client = yield* Client;

    return yield* useClient(client);
  });

  return RuntimeClient.runPromise(procedure);
}

export function withApiClientDeadline<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
  duration: Duration.Input = "15 seconds",
) {
  const procedure = Effect.gen(function* () {
    const client = yield* Client;

    return yield* useClient(client);
  }).pipe(Effect.timeout(duration));

  return RuntimeClient.runPromise(procedure);
}
