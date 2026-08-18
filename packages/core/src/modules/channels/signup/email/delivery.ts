import type { ChannelDelivery } from "../../client/service.js";
import type { EmailAddress } from "../../../users/schema.js";
import type { SignupConfirmation } from "../schema.js";

export type SignupEmailDelivery = ChannelDelivery<EmailAddress>;

export const SignupEmailDelivery = {
  make: (
    confirmation: SignupConfirmation,
    deliveryId: string,
  ): SignupEmailDelivery => ({
    recipient: confirmation.user.email,
    hash: deliveryId,
  }),
};
