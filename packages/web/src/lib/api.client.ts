import { Api } from "@dtpt/core/contracts/api";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { Effect } from "effect";
import { HttpApiClient } from "effect/unstable/httpapi";

export const ClientForPlatform = Effect.gen(function* () {
  const baseUrl = yield* ApiUrl;

  return yield* HttpApiClient.make(Api, { baseUrl });
});
