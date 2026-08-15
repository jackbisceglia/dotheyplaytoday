import { Effect } from "effect";
import type { Duration } from "effect";
import { ClientForPlatform } from "virtual:dtpt-api-client";

import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = ClientForPlatform;

const useApiClient = <A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
) => Effect.flatMap(Client, useClient);

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
) {
  return RuntimeClient.runPromise(useApiClient(useClient));
}

export function withApiClientDeadline<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
  duration: Duration.Input = "15 seconds",
) {
  return RuntimeClient.runPromise(
    useApiClient(useClient).pipe(Effect.timeout(duration)),
  );
}
