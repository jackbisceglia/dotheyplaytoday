import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

export type PingResponse = typeof PingResponse.Type;

export const PingResponse = Schema.Struct({
  ok: Schema.Literal(true),
  service: Schema.Literal("api"),
});

export const PingGroup = HttpApiGroup.make("ping").add(
  HttpApiEndpoint.get("get")`/ping`.addSuccess(PingResponse),
);
