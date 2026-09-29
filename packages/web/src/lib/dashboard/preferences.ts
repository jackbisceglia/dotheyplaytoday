import { query } from "@solidjs/router";

import { withApiClient } from "../api.js";

const loadPreferences = async () => {
  const [user, subscriptions] = await Promise.all([
    withApiClient((api) => api.user.get()),
    withApiClient((api) => api.subscription.list()),
  ]);
  return { user, subscriptions };
};

// The API cookie lives in the browser, so only the client calls this. The
// router drops the entry once nothing has read it for a few seconds, so it
// never outlives the signed-in page that uses it.
export const getPreferences = query(loadPreferences, "preferences");

export type Preferences = Awaited<ReturnType<typeof loadPreferences>>;
