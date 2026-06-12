import { HttpApi } from "effect/unstable/httpapi";

import { PingGroup } from "./ping.js";
import { SignupGroup } from "./signup.js";

export const Api = HttpApi.make("ApiV2")
  .add(PingGroup, SignupGroup)
  .prefix("/api");
