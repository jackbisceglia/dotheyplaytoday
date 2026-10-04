import { Schema } from "effect";

export class RateLimitExceeded extends Schema.TaggedError<RateLimitExceeded>()(
  "RateLimitExceeded",
  { key: Schema.String, limit: Schema.Int, window: Schema.Int },
) {}
