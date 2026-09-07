import { Schema, Struct } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";
import { User } from "../modules/users/schema.js";
import { SubscriptionWithSubject } from "../modules/subscriptions/schema.js";

// Read model for viewing saved account settings, not a separate domain aggregate.
// Select public user fields so credentials and the unsubscribe token stay private.
export const AccountResponse = Schema.Struct({
  user: User.mapFields(Struct.pick(["email", "timezone"])),
  subscriptions: Schema.Array(SubscriptionWithSubject),
});

export const AccountGroup = HttpApiGroup.make("account")
  .add(
    HttpApiEndpoint.get("get", "/", {
      success: AccountResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
  )
  .prefix("/account");
