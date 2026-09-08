import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

import { RuntimeClient } from "./platform.js";

// Session reads run in the browser: the API cookie is intentionally host-only.
export async function getAuthClient() {
  return createAuthClient({
    baseURL: await RuntimeClient.runPromise(ApiUrl),
    plugins: [magicLinkClient()],
    fetchOptions: { credentials: "include" },
  });
}

export function authenticatedDestination(search: string) {
  const params = new URLSearchParams(search);
  if (params.has("error")) return "/home?error=1";
  return params.get("confirmed") === "1" ? "/home?confirmed=1" : "/home";
}

export function consumeConfirmation(
  url: URL,
  user: { readonly emailVerified: boolean },
  history: Pick<History, "state" | "replaceState">,
) {
  const confirmed = url.searchParams.get("confirmed") === "1";
  const show =
    confirmed && user.emailVerified && !url.searchParams.has("error");
  if (url.searchParams.has("confirmed")) {
    url.searchParams.delete("confirmed");
    history.replaceState(
      history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }
  return show;
}
