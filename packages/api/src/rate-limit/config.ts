import { Config } from "effect";

export type RateLimitConfig = Config.Success<typeof RateLimitConfig>;
export const RateLimitConfig = Config.all({
  limit: Config.Number("RATE_LIMIT_WRITE_MAX").pipe(Config.withDefault(20)),
  window: Config.Number("RATE_LIMIT_WRITE_WINDOW").pipe(Config.withDefault(60)),
});
