import { withApiClient } from "../api.js";

// Private reads stay with the mounted dashboard, outside the public query cache.
export async function getPreferences() {
  const [user, subscriptions] = await Promise.all([
    withApiClient((api) => api.user.get()),
    withApiClient((api) => api.subscription.list()),
  ]);
  return { user, subscriptions };
}

export type Preferences = Awaited<ReturnType<typeof getPreferences>>;
