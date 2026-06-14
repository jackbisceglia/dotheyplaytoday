import { Effect } from "effect";

import type { User } from "../users/schema.js";
import { SubjectCapacityReached } from "./errors.js";

export const SubscriptionConstraints = {
  subject: { min: 0, max: 2 },
} as const;

const SubscriptionSubjectPolicy = {
  ensureAllowance(_user: User, received: number) {
    const { max } = SubscriptionConstraints.subject;

    if (received > max) {
      return Effect.fail(new SubjectCapacityReached({ limit: max, received }));
    }

    return Effect.void;
  },
};

export const SubscriptionPolicy = {
  subject: SubscriptionSubjectPolicy,
} as const;
