import { Api } from "@dtpt/core/contracts/api";
import { Billing } from "@dtpt/core/modules/billing/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Schema } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";
import { BillingConfig, isBillingConfigured } from "../billing/config.js";
import { withNoStoreResponse } from "../lib/no-store.js";

export const BillingGroupLayer = HttpApiBuilder.group(
  Api,
  "billing",
  Effect.fn("BillingHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;
    const users = yield* Users;
    const billing = yield* Billing;
    const config = yield* BillingConfig;

    return handlers.handle(
      "get",
      Effect.fn("BillingHttpApi.get")(
        function* (ctx) {
          const session = yield* auth.getSession(ctx.request.headers);
          if (!session) return yield* new HttpApiError.Unauthorized({});
          const user = yield* users.get(
            yield* Schema.decodeUnknownEffect(UserId)(session.user.id),
          );
          return {
            ...(yield* billing.getAccess(user)),
            available: isBillingConfigured(config),
          };
        },
        Effect.tapErrorTag(
          ["AuthRequestError", "DatabaseReadError", "SchemaError"],
          (error) => Effect.logError("billing: unexpected failure", { error }),
        ),
        Effect.catchTags({
          UserNotFound: () => Effect.fail(new HttpApiError.Unauthorized({})),
          AuthRequestError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          DatabaseReadError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          SchemaError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
        }),
        withNoStoreResponse,
      ),
    );
  }),
);
