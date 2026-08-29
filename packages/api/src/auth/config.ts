import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Config, Effect } from "effect";

export const AuthConfig = Effect.gen(function* () {
  const secret = yield* Config.redacted("BETTER_AUTH_SECRET");
  const apiUrl = new URL(yield* ApiUrl);
  const webUrl = new URL(yield* WebUrl);

  const protocol: "http" | "https" =
    apiUrl.protocol === "https:" ? "https" : "http";

  return {
    secret,
    baseURL: {
      allowedHosts: [apiUrl.host] as string[],
      fallback: apiUrl.origin,
      protocol,
    },
    apiOrigin: apiUrl.origin,
    webOrigin: webUrl.origin,
    trustedOrigins: [apiUrl.origin, webUrl.origin],
  };
});

export type AuthConfig = Effect.Success<typeof AuthConfig>;
