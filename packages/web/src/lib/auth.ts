import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";

import { useStore } from "./auth/solid.js";
import { RuntimeClient } from "./platform.js";

export const authClient = createAuthClient({
  baseURL: RuntimeClient.runSync(ApiUrl),
});

// Public session hook. Components import this from lib/auth and never touch
// the bridge directly, so the eventual better-auth/solid swap only edits
// this file.
export const useSession = () => useStore(authClient.useSession);
