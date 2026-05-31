import { Context, Effect } from "effect";

import type { NotifierError } from "./channel/errors.js";
import type { Notification } from "./schema.js";

export type NotifierService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, NotifierError>;
};

export class Notifier extends Context.Service<Notifier, NotifierService>()(
  "@dtpt/core-v2/Notifier",
) {}
