import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";

import { notification } from "../../notifier/__tests__/fixtures.js";
import { SubscriptionPolicy } from "../policy.js";

describe("SubscriptionPolicy", () => {
  it.effect("allows four subjects and rejects a fifth", () =>
    Effect.gen(function* () {
      const policy = SubscriptionPolicy.subject;

      expect(policy.constraints.max).toBe(4);
      yield* policy.ensureAllowance(notification.user, 4);

      const error = yield* policy
        .ensureAllowance(notification.user, 5)
        .pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "SubjectCapacityReached",
        limit: 4,
        received: 5,
      });
    }),
  );
});
