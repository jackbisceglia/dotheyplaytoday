import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi";

export const AuthApi = HttpApi.make("auth").add(
  HttpApiGroup.make("auth")
    .add(HttpApiEndpoint.get("get", "/*"))
    .add(HttpApiEndpoint.post("post", "/*"))
    .prefix("/auth"),
);
