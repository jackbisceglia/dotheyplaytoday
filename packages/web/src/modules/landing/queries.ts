import { query } from "@solidjs/router";

import { withApiClient } from "../../lib/api.js";

export const getSubjects = query(
  () =>
    withApiClient((api) => api.subjects.list()).catch((error: unknown) => {
      console.error("Failed to load the subject catalog", error);
      return [];
    }),
  "subjects",
);
