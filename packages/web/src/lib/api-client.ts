import { HttpApiClient } from "@effect/platform";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { Api } from "@dtpt/core/lib/contracts/api";
import { Effect } from "effect";

import { RuntimeClient } from "./platform.js";

const ApiClient = ApiUrl.pipe(
  Effect.flatMap((baseUrl) => HttpApiClient.make(Api, { baseUrl })),
);

export function pingApi() {
  return RuntimeClient.runPromise(
    ApiClient.pipe(Effect.flatMap((client) => client.ping.get())),
  );
}
