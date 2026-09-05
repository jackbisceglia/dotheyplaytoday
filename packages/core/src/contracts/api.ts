import { HttpApi } from "effect/unstable/httpapi";

import { AuthGroup } from "./auth.js";
import { FeedbackGroup } from "./feedback.js";
import { PingGroup } from "./ping.js";
import { SignupGroup } from "./signup.js";
import { SubjectsGroup } from "./subjects.js";
import { UnsubscribeGroup } from "./unsubscribe.js";

export const Api = HttpApi.make("ApiV2")
  .add(
    AuthGroup,
    FeedbackGroup,
    PingGroup,
    SignupGroup,
    SubjectsGroup,
    UnsubscribeGroup,
  )
  .prefix("/api");
