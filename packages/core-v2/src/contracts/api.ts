import { HttpApi } from "effect/unstable/httpapi";

import { PingGroup } from "./ping.js";
import { SignupGroup } from "./signup.js";
import { UnsubscribeGroup } from "./unsubscribe.js";

export const Api = HttpApi.make("ApiV2")
  .add(PingGroup, SignupGroup, UnsubscribeGroup)
  .prefix("/api");
