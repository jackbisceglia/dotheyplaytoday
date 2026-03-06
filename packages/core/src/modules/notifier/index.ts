import { Context, Effect } from "effect";

import type { NonEmptyEvents } from "../events/schema.js";
import type { User } from "../users/schema.js";
import type { NotifierError } from "./errors.js";

export class Notifier extends Context.Tag("@dtpt/Notifier")<
  Notifier,
  {
    readonly send: (
      user: User,
      events: NonEmptyEvents,
    ) => Effect.Effect<void, NotifierError>;
  }
>() {}
