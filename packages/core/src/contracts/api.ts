import { HttpApi } from "effect/unstable/httpapi";

import { AuthGroup } from "./auth.js";
import { FeedbackGroup } from "./feedback.js";
import { PingGroup } from "./ping.js";
import { SubjectsGroup } from "./subjects.js";
import { UserGroup } from "./user.js";
import { UserSubscriptionGroup } from "./user.subscription.js";

export const Api = HttpApi.make("ApiV2")
  .add(
    UserGroup,
    UserSubscriptionGroup,
    AuthGroup,
    FeedbackGroup,
    PingGroup,
    SubjectsGroup,
  )
  .prefix("/api");
