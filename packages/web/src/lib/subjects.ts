import { query } from "@solidjs/router";
import { Result } from "effect";

import { withApiResult } from "./api.js";

// Query results cross the SSR boundary, so the error channel stays a plain
// tag instead of the Effect error (which can hold non-serializable context).
export const SubjectsLoadFailed = "SubjectsLoadFailed" as const;

export const getSubjects = query(async () => {
  const result = await withApiResult((api) => api.subjects.list());

  // Declared contract errors are Schema data and cross the SSR boundary
  // safely, so they pass through untouched — including variants added later.
  // Only transport failures (which carry the live request) collapse to the
  // tag.
  return Result.mapError(result, (error) =>
    error._tag === "HttpClientError" ? SubjectsLoadFailed : error,
  );
}, "subjects");
