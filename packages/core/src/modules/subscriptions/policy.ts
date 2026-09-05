import { Effect } from "effect";

import type { User } from "../users/schema.js";
import { SubjectCapacityReached } from "./errors.js";

const CONSTRAINTS = {
  subject: { min: 0, max: 4 },
} as const;

const SubscriptionSubjectPolicy = {
  constraints: CONSTRAINTS.subject,
  ensureAllowance(_user: User, received: number) {
    const { max } = CONSTRAINTS.subject;

    if (received > max) {
      return Effect.fail(new SubjectCapacityReached({ limit: max, received }));
    }

    return Effect.void;
  },
};

export const SubscriptionPolicy = {
  subject: SubscriptionSubjectPolicy,
} as const;
