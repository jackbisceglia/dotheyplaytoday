import { describe, expect, it } from "@effect/vitest";
import { Config, Effect } from "effect";
import { TestClock } from "effect/testing";

import { makeRateLimiterLayer, RateLimiter } from "../service.js";

const layer = makeRateLimiterLayer(Config.succeed({ limit: 2, window: 60 }));

describe("write rate limiter", () => {
  it.effect(
    "limits each key independently and permits requests after the window expires",
    () =>
      Effect.gen(function* () {
        const limiter = yield* RateLimiter;
        yield* limiter.check("first");
        yield* limiter.check("first");
        const exceeded = yield* limiter.check("first").pipe(Effect.flip);
        expect(exceeded).toMatchObject({
          _tag: "RateLimitExceeded",
          key: "first",
          limit: 2,
          window: 60,
        });

        yield* limiter.check("second");
        yield* TestClock.adjust("61 seconds");
        yield* limiter.check("first");
      }).pipe(Effect.provide(layer)),
  );
});
