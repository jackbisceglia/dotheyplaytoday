import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi";

export const PingResponse = Schema.Struct({
  ok: Schema.Literal(true),
  service: Schema.Literal("api"),
});

export const PingApi = HttpApi.make("ping").add(
  HttpApiGroup.make("ping").add(
    HttpApiEndpoint.get("get", "/ping", { success: PingResponse }),
  ),
);
