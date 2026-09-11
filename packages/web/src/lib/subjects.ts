import { query } from "@solidjs/router";

import { withApiClient } from "./api.js";

// Shared subject-catalog query. Lives here (not in a page file) so every
// route reads through one cache key.
export const getSubjects = query(
  () =>
    withApiClient((api) => api.subjects.list()).catch((error: unknown) => {
      console.error("Failed to load the subject catalog", error);
      return [];
    }),
  "subjects",
);
