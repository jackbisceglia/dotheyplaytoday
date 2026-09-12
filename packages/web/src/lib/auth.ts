import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";

import { useStore } from "./auth/solid.js";
import { RuntimeClient } from "./platform.js";

export const auth = createAuthClient({
  baseURL: RuntimeClient.runSync(ApiUrl),
});

// Public session hook; the better-auth/solid swap only edits this file.
export const useSession = () => useStore(auth.useSession);
