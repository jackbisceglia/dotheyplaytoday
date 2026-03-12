import { Clock, Effect, Ref } from "effect";

import { SignupRateLimited } from "@dtpt/core/lib/contracts/signup";

type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
};

type MakeSignupWriteRateLimiterOptions = {
  maxAttempts: number;
  windowMs: number;
};

type SignupWriteRateLimiterService = {
  use: (identity: string) => Effect.Effect<void, SignupRateLimited>;
};

const defaultOptions: MakeSignupWriteRateLimiterOptions = {
  maxAttempts: 20,
  windowMs: 5 * 60 * 1000,
};

const normalizeIdentity = (identity: string) => {
  const normalized = identity.trim();

  return normalized.length > 0 ? normalized : "unknown";
};

export const makeSignupWriteRateLimiter = (
  options: MakeSignupWriteRateLimiterOptions = defaultOptions,
): Effect.Effect<SignupWriteRateLimiterService> =>
  Effect.gen(function* () {
    const stateRef = yield* Ref.make(new Map<string, RateLimitEntry>());

    const use = Effect.fn("SignupWriteRateLimiter.use")(function* (
      identity: string,
    ) {
      const now = yield* Clock.currentTimeMillis;
      const key = normalizeIdentity(identity);
      const isLimited = yield* Ref.modify(stateRef, (state) => {
        const nextState = new Map(state);
        const current = state.get(key);

        if (
          current === undefined ||
          now - current.windowStartedAt >= options.windowMs
        ) {
          nextState.set(key, {
            count: 1,
            windowStartedAt: now,
          });

          return [false, nextState] as const;
        }

        const nextCount = current.count + 1;
        nextState.set(key, {
          count: nextCount,
          windowStartedAt: current.windowStartedAt,
        });

        return [nextCount > options.maxAttempts, nextState] as const;
      });

      if (isLimited) {
        return yield* SignupRateLimited.make({
          message: "Too many signup attempts. Please try again later.",
        });
      }
    });

    return { use };
  });

export class SignupWriteRateLimiter extends Effect.Service<SignupWriteRateLimiter>()(
  "@dtpt/api/SignupWriteRateLimiter",
  {
    effect: makeSignupWriteRateLimiter(),
  },
) {}
