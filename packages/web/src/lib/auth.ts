import { buildServiceUrl } from "@dtpt/core/lib/url";
import { createAuthClient } from "better-auth/client";
import { Option } from "effect";

import { useStore } from "./auth/solid.js";

const apiBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_URL_BASE;
  if (!base) throw new Error("VITE_API_URL_BASE is not configured");
  const rawPort: string | undefined = import.meta.env.VITE_API_URL_PORT;
  const port =
    rawPort === undefined || rawPort === ""
      ? Option.none<number>()
      : Option.some(Number(rawPort));

  return buildServiceUrl(base, port);
};

export const authClient = createAuthClient({ baseURL: apiBaseUrl() });

// Public session hook. Components import this from lib/auth and never touch
// the bridge directly, so the eventual better-auth/solid swap only edits
// this file.
export const useSession = () => useStore(authClient.useSession);
