import type { ChannelDelivery } from "../../client/service.js";
import type { EmailAddress } from "../../../users/schema.js";
import type { SignupConfirmation } from "../schema.js";

export type SignupConfirmationEmailDelivery = ChannelDelivery<EmailAddress>;

export const SignupConfirmationEmailDelivery = {
  make: (
    confirmation: SignupConfirmation,
    deliveryId: string,
  ): SignupConfirmationEmailDelivery => ({
    recipient: confirmation.user.email,
    hash: deliveryId,
  }),
};
