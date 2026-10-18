import { query } from "@solidjs/router";

import { withApiClient } from "../api.js";

// Like preferences, private schedule data is read and preloaded client-side.
export const getEvents = query(
  () => withApiClient((api) => api.events.list()),
  "user-events",
);
