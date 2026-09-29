import { query } from "@solidjs/router";
import { Result } from "effect";

import { withApiResult } from "./api.js";

// Query results cross the SSR boundary, so the error channel stays a plain
// tag instead of the Effect error (which can hold non-serializable context).
export const SubjectsLoadFailed = "SubjectsLoadFailed" as const;

const loadSubjects = async () => {
  const result = await withApiResult((api) => api.subjects.list());

  if (import.meta.env.SSR && Result.isFailure(result)) {
    console.error("Failed to load the subject catalog", result.failure);
  }

  return Result.mapError(result, () => SubjectsLoadFailed);
};

export const getSubjects = query(loadSubjects, "subjects");

export type SubjectsResult = Awaited<ReturnType<typeof loadSubjects>>;
