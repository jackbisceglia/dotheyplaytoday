import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

export const BillingResponse = Schema.Struct({
  plan: Schema.Literals(["free", "pro"]),
  source: Schema.Literals(["free", "grandfathered", "stripe"]),
  teamLimit: Schema.Int,
  subscriptionStatus: Schema.NullOr(Schema.String),
  periodEnd: Schema.NullOr(Schema.String),
  cancelAtPeriodEnd: Schema.Boolean,
  hasBillingCustomer: Schema.Boolean,
  canUpgrade: Schema.Boolean,
  available: Schema.Boolean,
});

export const BillingApi = HttpApi.make("billing")
  .add(
    HttpApiGroup.make("billing").add(
      HttpApiEndpoint.get("get", "/", {
        success: BillingResponse,
        error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
      }),
    ),
  )
  .prefix("/billing");
