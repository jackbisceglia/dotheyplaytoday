import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { UnsubscribeToken } from "../modules/users/schema.js";

export const UnsubscribeRequest = Schema.Struct({ token: UnsubscribeToken });

export const UnsubscribeResponse = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedErrorClass<UnsubscribeRateLimited>()(
  "UnsubscribeRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UnsubscribeGroup = HttpApiGroup.make("unsubscribe").add(
  HttpApiEndpoint.post("submit", "/unsubscribe", {
    payload: UnsubscribeRequest,
    success: UnsubscribeResponse,
    error: [HttpApiError.InternalServerError, UnsubscribeRateLimited],
  }),
);
