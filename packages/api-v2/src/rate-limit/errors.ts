import { Schema } from "effect";

export class RateLimitExceeded extends Schema.TaggedErrorClass<RateLimitExceeded>()(
  "RateLimitExceeded",
  { key: Schema.String, limit: Schema.Int, window: Schema.Int },
) {}
