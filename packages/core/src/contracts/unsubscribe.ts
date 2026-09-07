import { Schema } from "effect";

import { UnsubscribeToken } from "../modules/users/schema.js";

export const UnsubscribeRequest = Schema.Struct({ token: UnsubscribeToken });

export const UnsubscribeResponse = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedErrorClass<UnsubscribeRateLimited>()(
  "UnsubscribeRateLimited",
  {},
  { httpApiStatus: 429 },
) {}
