import { HttpApi } from "effect/unstable/httpapi";

import { AuthGroup } from "./auth.js";
import { FeedbackGroup } from "./feedback.js";
import { PingGroup } from "./ping.js";
import { SubjectsGroup } from "./subjects.js";
import { UserApi } from "./user.js";

export const Api = HttpApi.make("ApiV2")
  .add(AuthGroup, FeedbackGroup, PingGroup, SubjectsGroup)
  .addHttpApi(UserApi)
  .prefix("/api");
