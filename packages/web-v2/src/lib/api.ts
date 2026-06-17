import { Api } from "@dtpt/core-v2/contracts/api";
import { ApiUrl } from "@dtpt/core-v2/lib/config/api";
import { Effect } from "effect";
import { HttpApiClient } from "effect/unstable/httpapi";

import { RuntimeClient } from "./platform.js";

export type Client = typeof Client;
export const Client = Effect.gen(function* () {
  const baseUrl = yield* ApiUrl;

  return yield* HttpApiClient.make(Api, { baseUrl });
});

export function withApiClient<A, E>(
  useClient: (client: Effect.Success<Client>) => Effect.Effect<A, E>,
) {
  const procedure = Effect.gen(function* () {
    const client = yield* Client;

    return yield* useClient(client);
  });

  return RuntimeClient.runPromise(procedure);
}
