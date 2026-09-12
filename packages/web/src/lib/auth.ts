import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";

import { useStore } from "./auth/solid.js";
import { RuntimeClient } from "./platform.js";

export const auth = createAuthClient({
  baseURL: RuntimeClient.runSync(ApiUrl),
});

export type SessionStatus =
  | "pending"
  | "unavailable"
  | "authenticated"
  | "unauthenticated";

export function getSessionStatus(
  session: ReturnType<typeof auth.useSession.get>,
): SessionStatus {
  if (session.isPending) return "pending";
  if (session.error) return "unavailable";
  return session.data ? "authenticated" : "unauthenticated";
}

// Public session hook; the better-auth/solid swap only edits this file.
export const useSession = () => useStore(auth.useSession);
