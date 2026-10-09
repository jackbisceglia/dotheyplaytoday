import { Clock, Context, Effect, Layer } from "effect";

import {
  mapToReadError,
  type DatabaseReadError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import type { User } from "../users/schema.js";
import { resolveBillingAccess } from "./policy.js";

export type BillingAccess = ReturnType<typeof resolveBillingAccess>;

export class Billing extends Context.Service<
  Billing,
  {
    readonly getAccess: (
      user: User,
    ) => Effect.Effect<BillingAccess, DatabaseReadError>;
  }
>()("@dtpt/core/Billing") {}

export const BillingLayer = Layer.effect(
  Billing,
  Effect.gen(function* () {
    const database = yield* Database;
    return Billing.of({
      getAccess: Effect.fn("Billing.getAccess")(function* (user) {
        const subscriptions = yield* database.query.billingSubscriptionsTable
          .findMany({
            where: { userId: user.id },
          })
          .pipe(mapToReadError("Billing.getAccess", { userId: user.id }));
        return resolveBillingAccess(
          user,
          subscriptions,
          yield* Clock.currentTimeMillis,
        );
      }),
    });
  }),
);
