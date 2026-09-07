import { Struct } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { User } from "../modules/users/schema.js";
import { SignupRateLimited, SignupRequest, SignupResponse } from "./signup.js";
import {
  UnsubscribeRateLimited,
  UnsubscribeRequest,
  UnsubscribeResponse,
} from "./unsubscribe.js";

export const UserResponse = User.mapFields(Struct.pick(["email", "timezone"]));

export const UserGroup = HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.get("get", "/", {
      success: UserResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
    HttpApiEndpoint.post("create", "/", {
      payload: SignupRequest,
      success: SignupResponse,
      error: [
        HttpApiError.BadRequest,
        HttpApiError.InternalServerError,
        SignupRateLimited,
      ],
    }),
    HttpApiEndpoint.post("unsubscribe", "/unsubscribe", {
      payload: UnsubscribeRequest,
      success: UnsubscribeResponse,
      error: [HttpApiError.InternalServerError, UnsubscribeRateLimited],
    }),
  )
  .prefix("/user");
