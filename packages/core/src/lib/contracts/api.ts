import { HttpApi, HttpApiError } from "@effect/platform";

import { PingGroup } from "./ping.js";
import { SignupGroup } from "./signup.js";

export const Api = HttpApi.make("Api")
  .add(PingGroup)
  .add(SignupGroup)
  .addError(HttpApiError.InternalServerError)
  .prefix("/api");
