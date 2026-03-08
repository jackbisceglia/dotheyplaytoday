import { HttpApi, HttpApiError } from "@effect/platform";

import { PingGroup } from "./ping.js";

export const Api = HttpApi.make("Api")
  .add(PingGroup)
  .addError(HttpApiError.InternalServerError)
  .prefix("/api");
