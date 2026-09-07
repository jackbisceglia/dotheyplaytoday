import { HttpApi } from "effect/unstable/httpapi";

import { AuthApi } from "./auth.js";
import { FeedbackApi } from "./feedback.js";
import { PingApi } from "./ping.js";
import { SubjectsApi } from "./subjects.js";
import { UserApi } from "./user.js";

export const Api = HttpApi.make("ApiV2")
  .addHttpApi(AuthApi)
  .addHttpApi(FeedbackApi)
  .addHttpApi(PingApi)
  .addHttpApi(SubjectsApi)
  .addHttpApi(UserApi)
  .prefix("/api");
