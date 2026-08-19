import { Schema } from "effect";

import { Subject } from "../../subjects/schema.js";
import { Subscription } from "../../subscriptions/schema.js";
import { User } from "../../users/schema.js";

const receiptFields = {
  user: User,
  subjects: Schema.NonEmptyArray(Subject),
  schedule: Subscription.fields.schedule,
};

export type SignupConfirmation = typeof SignupConfirmation.Type;
export const SignupConfirmation = Schema.TaggedUnion({
  firstSignup: receiptFields,
  repeatSignup: receiptFields,
});
