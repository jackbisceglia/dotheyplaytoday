import { HttpApiBuilder } from "@effect/platform";
import { Api } from "@dtpt/core/lib/contracts/api";
import { Effect } from "effect";

export const PingGroupLayer = HttpApiBuilder.group(Api, "ping", (handlers) => {
  return handlers.handle("get", () =>
    Effect.succeed({
      ok: true as const,
      service: "api" as const,
    }),
  );
});
