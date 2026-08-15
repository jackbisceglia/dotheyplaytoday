import { Effect } from "effect";
import type { Duration } from "effect";
import { ClientForPlatform } from "virtual:dtpt-api-client";

import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = ClientForPlatform;

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
  duration: Duration.Input = "10 seconds",
) {
  return RuntimeClient.runPromise(
    Effect.flatMap(Client, useClient).pipe(Effect.timeout(duration)),
  );
}
