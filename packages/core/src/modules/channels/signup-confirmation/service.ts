import { Context, type Effect } from "effect";

import type { ChannelDeliveryError } from "../errors.js";
import type { SignupConfirmation } from "./schema.js";

export class SignupConfirmationChannel extends Context.Service<
  SignupConfirmationChannel,
  {
    readonly deliver: (
      confirmation: SignupConfirmation,
    ) => Effect.Effect<void, ChannelDeliveryError>;
  }
>()("@dtpt/core/SignupConfirmationChannel") {}
