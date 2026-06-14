import { Api } from "@dtpt/core-v2/contracts/api";
import { ApiUrl } from "@dtpt/core-v2/lib/config/api";
import { Effect } from "effect";
import { HttpApiClient } from "effect/unstable/httpapi";

import { RuntimeClient } from "./platform.js";

export const Client = Effect.gen(function* () {
  const baseUrl = yield* ApiUrl;

  return yield* HttpApiClient.make(Api, { baseUrl });
});

export type Client = Effect.Success<typeof Client>;

export function withApiClient<A, E>(
  fn: (client: Client) => Effect.Effect<A, E>,
): Promise<A> {
  return RuntimeClient.runPromise(
    Effect.gen(function* () {
      const client = yield* Client;

      return yield* fn(client);
    }),
  );
}
