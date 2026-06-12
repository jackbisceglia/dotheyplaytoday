import { Schema } from "effect";
import { HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";

export const PingResponse = Schema.Struct({
  ok: Schema.Literal(true),
  service: Schema.Literal("api-v2"),
});

export const PingGroup = HttpApiGroup.make("ping").add(
  HttpApiEndpoint.get("get", "/ping", { success: PingResponse }),
);
