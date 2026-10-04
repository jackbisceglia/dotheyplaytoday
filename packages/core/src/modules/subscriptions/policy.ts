import { Effect } from "effect";

import { plans } from "../billing/policy.js";
import { SubjectCapacityReached } from "./errors.js";

const CONSTRAINTS = {
  subject: { min: 1, max: plans.pro.teamLimit },
} as const;

const SubscriptionSubjectPolicy = {
  constraints: CONSTRAINTS.subject,
  ensureAllowance(limit: number, received: number) {
    if (received > limit) {
      return Effect.fail(new SubjectCapacityReached({ limit, received }));
    }

    return Effect.void;
  },
};

export const SubscriptionPolicy = {
  subject: SubscriptionSubjectPolicy,
} as const;
