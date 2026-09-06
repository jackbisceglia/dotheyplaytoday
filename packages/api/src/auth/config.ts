import { Config } from "effect";

export const AuthConfig = Config.all({
  secret: Config.redacted("BETTER_AUTH_SECRET"),
});
