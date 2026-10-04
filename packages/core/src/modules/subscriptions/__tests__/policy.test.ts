import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";

import { SubscriptionPolicy } from "../policy.js";

describe("SubscriptionPolicy", () => {
  it.effect("accepts the maximum subscriptions and rejects more", () =>
    Effect.gen(function* () {
      const policy = SubscriptionPolicy.subject;
      const { max } = policy.constraints;

      yield* policy.ensureAllowance(max, max);

      const error = yield* policy
        .ensureAllowance(max, max + 1)
        .pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "SubjectCapacityReached",
        limit: max,
        received: max + 1,
      });
    }),
  );
});
