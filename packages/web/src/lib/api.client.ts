import { Api } from "@dtpt/core/contracts/api";
import { Config, Effect } from "effect";
import { HttpApiClient } from "effect/unstable/httpapi";

export const ApiClient = Effect.gen(function* () {
  const baseUrl = yield* Config.string("VITE_API_URL");

  return yield* HttpApiClient.make(Api, { baseUrl });
});
