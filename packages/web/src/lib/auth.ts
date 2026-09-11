import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";

import { authHint } from "./auth/hint.js";
import { useStore } from "./auth/solid.js";
import { RuntimeClient } from "./platform.js";

export const auth = createAuthClient({
  baseURL: RuntimeClient.runSync(ApiUrl),
});

if (!import.meta.env.SSR) {
  auth.useSession.listen((session) => {
    if (session.isPending || session.error) return;
    if (session.data) authHint.set();
    else authHint.clear();
  });
}

// Public session hook; the better-auth/solid swap only edits this file.
export const useSession = () => useStore(auth.useSession);
