import { Layer } from "effect";

import { NotifierChannelUnavailable } from "../errors.js";
import { Notifier } from "../index.js";

export const NotifierLayerSms = Layer.succeed(
  Notifier,
  Notifier.of({
    send: () =>
      NotifierChannelUnavailable.make({
        channel: "sms",
        message: "SMS notifier is not configured yet",
      }),
  }),
);
