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

export class BillingRateLimited extends Schema.TaggedError<BillingRateLimited>()(
  "BillingRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

const writeErrors = [
  HttpApiError.BadRequest,
  HttpApiError.Unauthorized,
  HttpApiError.Forbidden,
  HttpApiError.InternalServerError,
  HttpApiError.ServiceUnavailable,
  BillingRateLimited,
];

export const BillingApi = HttpApi.make("billing")
  .add(
    HttpApiGroup.make("billing").add(
      HttpApiEndpoint.get("get", "/", {
        success: BillingResponse,
        error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
      }),
      HttpApiEndpoint.post("checkout", "/checkout", {
        success: Schema.Struct({ url: Schema.String }),
        error: writeErrors,
      }),
      HttpApiEndpoint.post("portal", "/portal", {
        success: Schema.Struct({ url: Schema.String }),
        error: writeErrors,
      }),
      HttpApiEndpoint.post("sync", "/sync", {
        success: BillingResponse,
        error: writeErrors,
      }),
      HttpApiEndpoint.post("webhook", "/webhook", {
        success: Schema.Struct({ ok: Schema.Boolean }),
        error: [
          HttpApiError.BadRequest,
          HttpApiError.InternalServerError,
          HttpApiError.ServiceUnavailable,
        ],
      }),
    ),
  )
  .prefix("/billing");
