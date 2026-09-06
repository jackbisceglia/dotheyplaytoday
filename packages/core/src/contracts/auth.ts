import { HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";

export const AuthGroup = HttpApiGroup.make("auth")
  .add(HttpApiEndpoint.get("get", "/*"))
  .add(HttpApiEndpoint.post("post", "/*"))
  .prefix("/auth");
