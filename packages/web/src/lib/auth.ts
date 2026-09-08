import { ApiUrl } from "@dtpt/core/lib/config/api";
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

import { RuntimeClient } from "./platform.js";

export const auth = createAuthClient({
  baseURL: RuntimeClient.runSync(ApiUrl),
  plugins: [magicLinkClient()],
  fetchOptions: { credentials: "include" },
});
