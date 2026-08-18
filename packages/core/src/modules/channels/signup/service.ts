import { Context, type Effect } from "effect";

import type { ChannelDeliveryError } from "../errors.js";
import type { SignupConfirmation } from "./schema.js";

export class SignupChannel extends Context.Service<
  SignupChannel,
  {
    readonly deliver: (
      confirmation: SignupConfirmation,
    ) => Effect.Effect<void, ChannelDeliveryError>;
  }
>()("@dtpt/core/SignupChannel") {}
