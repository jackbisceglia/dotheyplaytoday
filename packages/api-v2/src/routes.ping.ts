import { Api } from "@dtpt/core-v2/contracts/api";
import { HttpApiBuilder } from "effect/unstable/httpapi";
import { Effect } from "effect";

export const PingGroupLayer = HttpApiBuilder.group(Api, "ping", (handlers) =>
  handlers.handle(
    "get",
    Effect.fn("PingHttpApi.get")(function* () {
      return yield* Effect.succeed({
        ok: true as const,
        service: "api-v2" as const,
      });
    }),
  ),
);
