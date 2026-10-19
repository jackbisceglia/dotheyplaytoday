import { Predicate } from "effect";

import { type Subject, SubjectDetails } from "../subjects/schema.js";

export const supportsWeeklyDigest = (subject: Subject): boolean =>
  Predicate.isTagged(subject, "sports_team") &&
  SubjectDetails.guards.sports_team(subject.details);
