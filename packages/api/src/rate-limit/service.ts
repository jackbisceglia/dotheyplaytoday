import {
  Config,
  Context,
  DateTime,
  Duration,
  Effect,
  Layer,
  Option,
} from "effect";
import { HttpServerRequest } from "effect/unstable/http";

import {
  RateLimitConfig,
  type RateLimitConfig as RateLimitConfigShape,
} from "./config.js";
import { RateLimitExceeded } from "./errors.js";

export const getRateLimitKey = (request: HttpServerRequest.HttpServerRequest) =>
  Option.getOrElse(request.remoteAddress, () => "unknown");

export class RateLimiter extends Context.Service<
  RateLimiter,
  {
    readonly check: (key: string) => Effect.Effect<void, RateLimitExceeded>;
  }
>()("@dtpt/api/RateLimiter") {}

export const makeRateLimiterLayer = (
  InputConfig: Config.Config<RateLimitConfigShape>,
) =>
  Layer.effect(
    RateLimiter,
    Effect.gen(function* () {
      const config = yield* InputConfig;
      const windows = new Map<
        string,
        { readonly resetAt: number; readonly count: number }
      >();
      const windowMs = Duration.toMillis(Duration.seconds(config.window));

      function getOrInit(key: string, now: number) {
        const value = windows.get(key);

        if (!value) {
          return reset(key, now);
        }

        return value;
      }

      function reset(key: string, now: number) {
        const value = { count: 0, resetAt: now + windowMs };

        windows.set(key, value);

        return value;
      }

      function increment(key: string) {
        const current = windows.get(key);

        if (current) {
          windows.set(key, { ...current, count: current.count + 1 });
        }
      }

      const check: RateLimiter["Service"]["check"] = Effect.fn(
        "RateLimiter.check",
      )(function* (key) {
        const now = DateTime.toEpochMillis(yield* DateTime.now);

        const initial = getOrInit(key, now);
        const current = now > initial.resetAt ? reset(key, now) : initial;

        if (current.count >= config.limit) {
          return yield* new RateLimitExceeded({
            key,
            limit: config.limit,
            window: config.window,
          });
        }

        increment(key);
      });

      return RateLimiter.of({ check });
    }),
  );

export const RateLimiterLayer = makeRateLimiterLayer(RateLimitConfig);
