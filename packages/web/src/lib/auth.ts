import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";
import { Effect } from "effect";

import { RuntimeClient } from "./platform.js";

// Lazily initialize one browser client. This caches the client, not session data;
// Web SSR must not perform session lookups with API host-only cookies.
const AuthClient = Effect.gen(function* () {
  const baseURL = yield* ApiUrl;

  return createAuthClient({
    baseURL,
    plugins: [magicLinkClient()],
    fetchOptions: { credentials: "include" },
  });
}).pipe(Effect.cached, Effect.runSync);

export const getAuthClient = () => RuntimeClient.runPromise(AuthClient);
