import { Config } from "effect";

export const AuthBasePath = "/api/auth";

export const AuthConfig = Config.all({
  secret: Config.redacted("BETTER_AUTH_SECRET"),
});
