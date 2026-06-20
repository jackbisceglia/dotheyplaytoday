import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { UnsubscribeToken } from "../modules/users/schema.js";

export const Request = Schema.Struct({ token: UnsubscribeToken });

export const Response = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedErrorClass<UnsubscribeRateLimited>()(
  "UnsubscribeRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UnsubscribeGroup = HttpApiGroup.make("unsubscribe").add(
  HttpApiEndpoint.post("submit", "/unsubscribe", {
    payload: Request,
    success: Response,
    error: [HttpApiError.InternalServerError, UnsubscribeRateLimited],
  }),
);
